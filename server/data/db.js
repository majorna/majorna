const assert = require('assert')
const txUtils = require('../blockchain/tx')
const blockUtils = require('../blockchain/block')
const blockchainUtils = require('../blockchain/blockchain')
const utils = require('./utils')
const firebaseConfig = require('../config/firebase')
const firestore = firebaseConfig.firestore

// collection and doc refs
const txsColRef = firestore.collection('txs')
const blocksColRef = firestore.collection('blocks')
const usersColRef = firestore.collection('users')
const mjColRef = firestore.collection('mj')
const metaDocRef = mjColRef.doc('meta')
const blockInfoDocRef = mjColRef.doc('blockInfo')

const maxTxsInUserDoc = 15
const genesisBlock = blockUtils.getGenesisBlock()

/**
 * Initializes database collections if database is empty, asynchronously.
 */
exports.init = async () => {
  const metaDoc = await metaDocRef.get()
  if (metaDoc.exists) {
    return
  }

  const batch = firestore.batch()
  batch.create(metaDocRef, {
    val: 0.01,
    cap: 0,
    userCount: 0
    // monthly: [{t: 'May 12', mj: 0.01}]
  })
  batch.create(blockInfoDocRef, {
    lastBlockHeader: {},
    nextBlock: {
      headerStrWithoutNonce: '',
      targetDifficulty: 0,
      reward: 0
    }
  })
  batch.create(blocksColRef.doc(genesisBlock.header.no), blockUtils.sign(genesisBlock))
  batch.create(usersColRef.doc('majorna'), {email: 'majorna@majorna', name: 'Majorna', created: new Date(), balance: 0, txs: []})
  await batch.commit()
}

/**
 * Deletes all the data and seeds the database with dummy data for testing, asynchronously.
 */
exports.initTest = async () => {
  const testData = require('../config/test').data
  const batch = firestore.batch()

  // delete all data
  const mjsSnap = await mjColRef.get()
  mjsSnap.forEach(mjSnap => batch.delete(mjSnap.ref))
  const usersSnap = await usersColRef.get()
  usersSnap.forEach(userSnap => batch.delete(userSnap.ref))
  const txsSnap = await txsColRef.get()
  txsSnap.forEach(txSnap => batch.delete(txSnap.ref))
  const blocksSnap = await blocksColRef.get()
  blocksSnap.forEach(blockSnap => batch.delete(blockSnap.ref))

  // add seed data
  batch.create(metaDocRef, testData.mj.meta)
  batch.create(blockInfoDocRef, testData.mj.blockInfo)
  batch.create(usersColRef.doc('1'), testData.users.u1Doc)
  batch.create(usersColRef.doc('2'), testData.users.u2Doc)
  testData.txs.forEach((tx, i) => batch.create(txsColRef.doc(i.toString()), tx))
  testData.blocks.forEach(block => batch.create(blocksColRef.doc(block.header.no.toString()), block))

  await batch.commit()
}

/**
 * Get majorna metadata document asynchronously.
 */
exports.getMeta = async () => (await metaDocRef.get()).data()

/**
 * Get a user by id, asynchronously.
 */
exports.getUser = async id => {
  assert(id, 'user ID parameters is required')
  const userDoc = await usersColRef.doc(id).get()
  if (!userDoc.exists) {
    throw new utils.UserVisibleError(`user ID:${id} does not exist`, 404)
  }
  return userDoc.data()
}

/**
 * Create user doc and push first bonus transaction, asynchronously.
 * Can be used as a firestore cloud function trigger.
 * Returns newly created user data.
 */
exports.createUserDoc = (user, uid) => firestore.runTransaction(async t => {
  assert(user, 'user parameters is required')
  uid = uid || user.uid
  assert(uid, 'user.uid or user ID parameter is required')
  const email = user.email
  const name = user.name || user.displayName // decoded firebase auth token || cloud functions firestore event data

  const time = new Date()
  const initBalance = 500

  console.log(`creating user: ${uid} - ${email} - ${name}`)

  // increase market cap
  const metaDoc = await t.get(metaDocRef)
  const meta = metaDoc.data()
  t.update(metaDocRef, {cap: meta.cap + initBalance, userCount: meta.userCount + 1})

  // create the first transaction for the user
  const txRef = txsColRef.doc()
  const signedTx = txUtils.sign({id: txRef.id, from: {id: 'majorna', balance: 0}, to: {id: uid, balance: 0}, time, amount: initBalance})
  t.create(txRef, signedTx)

  // create user doc
  const userData = {
    email: email,
    name: name,
    created: time,
    balance: initBalance,
    txs: [
      {
        id: txRef.id,
        from: 'majorna',
        time,
        amount: initBalance
      }
    ]
  }

  t.create(usersColRef.doc(uid), userData)
  return userData
})

/**
 * Get a transaction from transactions collection by ID, asynchronously.
 */
exports.getTx = async id => {
  assert(id, 'tx ID parameters is required')
  const txDoc = await txsColRef.doc(id).get()
  if (!txDoc.exists) {
    throw new utils.UserVisibleError(`transaction ID:${id} does not exist`, 404)
  }
  return txDoc.data()
}

/**
 * Queries the txs by given date objects range: start time (inclusive), end time (exclusive).
 */
exports.getTxsByTimeRange = async (startTime, endTime) => {
  const txsSnap = await txsColRef.where('time', '>=', startTime).where('time', '<', endTime).get()
  return txsSnap.docs.map(doc => doc.data())
}

/**
 * Performs a financial transaction from person A to B asynchronously.
 * Both user documents and transactions collection is updated with the transaction data and results.
 * Returned promise resolves to completed transaction data -or- to an error if transaction fails.
 * @param from - Sender ID.
 * @param to - Receiver ID.
 * @param amount - Transaction amount as integer.
 */
exports.makeTx = (from, to, amount) => firestore.runTransaction(async t => {
  assert(from, '"from" parameter is required')
  assert(to, '"to" parameter is required')
  assert(from !== to, '"from" and "to" parameters cannot be same')
  assert(amount, '"amount" parameters is required')
  assert(Number.isInteger(amount), 'amount must be an integer')
  assert(amount > 0, 'amount should be > 0')

  // check if sender exists
  const senderDocRef = usersColRef.doc(from)
  const senderDoc = await t.get(senderDocRef)
  if (!senderDoc.exists) {
    throw new utils.UserVisibleError(`sender ID:${from} does not exist`)
  }
  const sender = senderDoc.data()
  const fromName = sender.name

  // verify sender's funds
  if (sender.balance < amount) {
    throw new utils.UserVisibleError(`sender ID:${from} has insufficient funds`)
  }

  const time = new Date()

  // check if receiver exists
  const receiverDocRef = usersColRef.doc(to)
  const receiverDoc = await t.get(receiverDocRef)
  if (!receiverDoc.exists) {
    throw new utils.UserVisibleError(`receiver ID:${to} does not exist`)
  }
  const receiver = receiverDoc.data()
  const toName = receiver.name

  // add tx to txs collection
  const txRef = txsColRef.doc()
  const signedTx = txUtils.sign({id: txRef.id, from: {id: from, balance: sender.balance}, to: {id: to, balance: receiver.balance}, time, amount})
  t.create(txRef, signedTx)

  // update user docs with tx and updated balances
  sender.txs.unshift({id: txRef.id, to, toName, time, amount})
  sender.txs.length > maxTxsInUserDoc && (sender.txs.length = maxTxsInUserDoc)
  t.update(senderDocRef, {balance: sender.balance - amount, txs: sender.txs})
  receiver.txs.unshift({id: txRef.id, from, fromName, time, amount})
  receiver.txs.length > maxTxsInUserDoc && (receiver.txs.length = maxTxsInUserDoc)
  t.update(receiverDocRef, {balance: receiver.balance + amount, txs: receiver.txs})

  return signedTx
})

/**
 * Retrieves the block info document, asynchronously.
 */
exports.getBlockInfo = async () => (await blockInfoDocRef.get()).data()

/**
 * Overwrite the block info document with the given one, asynchronously.
 */
exports.setBlockInfo = blockInfo => blockInfoDocRef.set(blockInfo)

/**
 * Inserts a given block data to blocks collection and updates the block info document, asynchronously.
 * Does not do any verification or block signing.
 * @param block - Block object to insert.
 * @param blockInfo - Accompanying block info object.
 */
exports.insertBlock = (block, blockInfo) => firestore.runTransaction(async t => {
  t.set(blockInfoDocRef, blockInfo)
  const newBlockRef = blocksColRef.doc(block.header.no.toString())
  t.create(newBlockRef, block)
})

/**
 * Gives mining reward to a miner, asynchronously.
 * Returned promise resolves to completed transaction data -or- to an error if transaction fails.
 * @param to - Receiver ID.
 * @param nonce - Nonce that is mined by the miner.
 */
exports.giveMiningReward = (to, nonce) => firestore.runTransaction(async t => {
  assert(to, '"to" parameter is required')
  assert(nonce, '"nonce" parameter is required')

  // verify nonce
  const blockInfoDoc = await t.get(blockInfoDocRef)
  const blockInfo = blockInfoDoc.data()
  const difficulty = blockUtils.getHashDifficultyFromStr(nonce, blockInfo.nextBlock.headerStrWithoutNonce)
  console.log(difficulty)
  console.log(blockInfo.nextBlock.targetDifficulty)
  if (difficulty < blockInfo.nextBlock.targetDifficulty) {
    throw new utils.UserVisibleError(`Given nonce does not belong to the last block or is of insufficient difficulty.`)
  }

  const miningReward = blockInfo.nextBlock.reward

  // update last block
  const lastBlockRef = blocksColRef.doc(blockInfo.lastBlockHeader.no.toString())
  const lastBlockDoc = await t.get(lastBlockRef)
  const lastBlock = lastBlockDoc.data()
  lastBlock.header.difficulty = difficulty
  lastBlock.header.nonce = nonce
  blockUtils.sign(lastBlock)

  // update block info
  blockInfo.lastBlockHeader.difficulty = difficulty
  blockInfo.lastBlockHeader.nonce = nonce
  blockInfo.nextBlock.targetDifficulty = difficulty + blockchainUtils.blockDifficultyIncrementStep
  blockInfo.nextBlock.reward = blockUtils.getBlockReward(blockInfo.nextBlock.targetDifficulty)
  blockInfo.nextBlock.headerStrWithoutNonce = blockUtils.getHeaderStr(lastBlock.header, true, blockInfo.nextBlock.targetDifficulty)

  const time = new Date()

  // sender is majorna
  const from = 'majorna'
  const fromName = 'Majorna'

  // check if receiver exists
  const receiverDocRef = usersColRef.doc(to)
  const receiverDoc = await t.get(receiverDocRef)
  if (!receiverDoc.exists) {
    throw new utils.UserVisibleError(`receiver ID:${to} does not exist`)
  }
  const receiver = receiverDoc.data()

  // increase market cap
  const metaDoc = await t.get(metaDocRef)
  const meta = metaDoc.data()
  t.update(metaDocRef, {cap: meta.cap + miningReward})

  // block op writes (here to have reads before writes)
  t.update(lastBlockRef, {sig: lastBlock.sig, header: {difficulty, nonce}})
  t.update(blockInfoDocRef, blockInfo)

  // add tx to txs collection
  const txRef = txsColRef.doc()
  const signedTx = txUtils.sign({id: txRef.id, from: {id: from, balance: 0}, to: {id: to, balance: receiver.balance}, time, miningReward})
  t.create(txRef, signedTx)

  // update user docs with tx and updated balances
  receiver.txs.unshift({id: txRef.id, from: from, fromName, time, miningReward})
  receiver.txs.length > maxTxsInUserDoc && (receiver.txs.length = maxTxsInUserDoc)
  t.update(receiverDocRef, {balance: receiver.balance + miningReward, txs: receiver.txs})

  return blockInfo.nextBlock.reward
})
