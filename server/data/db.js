const assert = require('assert')
const firebaseAdmin = require('firebase-admin')
const config = require('../config/config')
const txUtils = require('../blockchain/tx')
const blockUtils = require('../blockchain/block')
const utils = require('../utils/utils')
const firebaseConfig = require('../config/firebase')
const firestore = firebaseConfig.firestore

// collection and doc refs
const txsColRef = firestore.collection('txs')
const blocksColRef = firestore.collection('blocks')
const usersColRef = firestore.collection('users')
const metaColRef = firestore.collection('meta')
const mjMetaDocRef = metaColRef.doc('mj')
const blockInfoMetaDocRef = metaColRef.doc('blockInfo')

const maxTxsInUserDoc = 15
const signedGenesisBlock = blockUtils.sign(blockUtils.getGenesisBlock())

/**
 * Initializes database collections if database is empty, asynchronously.
 */
exports.init = async () => {
  const metaDoc = await mjMetaDocRef.get()
  if (metaDoc.exists) {
    return
  }

  const batch = firestore.batch()
  batch.create(mjMetaDocRef, { // todo: use this data as testData.meta.mj init data
    val: 0.01, // usd
    marketCap: 0,
    userCount: 0,
    maxSupply: 200 * 1000 * 1000 * 1000,
    monthly: {
      updated: 0,
      txVolume: 0
      // vals: [{t: 'May 12', mj: 0.01}]
    }
  })
  batch.create(blockInfoMetaDocRef, {
    header: signedGenesisBlock.header,
    miner: {
      headerStrWithoutNonce: '',
      targetDifficulty: 0,
      reward: 0
    }
  })
  batch.create(blocksColRef.doc(signedGenesisBlock.header.no.toString()), signedGenesisBlock)
  batch.create(usersColRef.doc('majorna'), { email: 'majorna@majorna', name: 'Majorna', created: new Date(), balance: 0, txs: [] })
  // todo: initial allocation of funds dev/foundation/public
  await batch.commit()
}

/**
 * Deletes all the data and seeds the database with dummy data for testing, asynchronously.
 */
exports.initTest = async () => {
  const testData = require('../config/test').data
  const batch = firestore.batch()

  // delete all data
  const metasSnap = await metaColRef.get()
  metasSnap.forEach(metaSnap => batch.delete(metaSnap.ref))
  const usersSnap = await usersColRef.get()
  usersSnap.forEach(userSnap => batch.delete(userSnap.ref))
  const txsSnap = await txsColRef.get()
  txsSnap.forEach(txSnap => batch.delete(txSnap.ref))
  const blocksSnap = await blocksColRef.get()
  blocksSnap.forEach(blockSnap => batch.delete(blockSnap.ref))

  // add seed data
  batch.create(mjMetaDocRef, testData.meta.mj)
  batch.create(blockInfoMetaDocRef, testData.meta.blockInfo)
  batch.create(usersColRef.doc('1'), testData.users.u1Doc)
  batch.create(usersColRef.doc('2'), testData.users.u2Doc)
  testData.txs.forEach((tx, i) => batch.create(txsColRef.doc(i.toString()), tx))
  testData.blocks.forEach(block => batch.create(blocksColRef.doc(block.header.no.toString()), block))

  await batch.commit()
}

/**
 * Get majorna metadata document, asynchronously.
 */
exports.getMjMeta = async () => (await mjMetaDocRef.get()).data()

/**
 * Updates estimated mj stats if required. Update happens only once a month.
 * Returns true if stats were updated, false otherwise.
 * @param endTime - Only used for testing. Automatically calculated otherwise.
 */
exports.updateMjMetaStatsIfRequired = async endTime => {
  const now = new Date()
  const metaDoc = await mjMetaDocRef.get()
  const meta = metaDoc.data()

  const previousMonthEnd = new Date(now.getTime())
  previousMonthEnd.setMonth(now.getMonth() - 1)
  previousMonthEnd.setDate(30)
  previousMonthEnd.setHours(0, 0, 0, 0)
  if (previousMonthEnd <= meta.monthly.updated) {
    console.log(`skipping mj meta stats update. condition: previous month end: ${previousMonthEnd} <= last updated: ${meta.monthly.updated}`)
    return false
  }

  // get all txs from the beginning of the previous month until the end of previous month
  const previousMonthBeginning = new Date(previousMonthEnd.getTime())
  previousMonthBeginning.setDate(0)
  previousMonthBeginning.setHours(0, 0, 0, 0)
  const limit = 500
  let volume = 0
  let totalQueried = 0
  let lastQueriedDocumentTime = previousMonthBeginning

  console.log('starting mj meta stats update loop')
  while (true) {
    console.log(`mj meta stats update loop is running with total queried: ${totalQueried}, last queried time: ${lastQueriedDocumentTime}`)
    const txsSnap = await txsColRef.orderBy('time').startAfter(lastQueriedDocumentTime).endBefore(endTime || previousMonthEnd).limit(limit).get()
    if (!txsSnap.size || totalQueried > 1000000 /* infinite loop protection */) {
      break
    }
    lastQueriedDocumentTime = txsSnap.docs[txsSnap.size - 1].data().time
    totalQueried += txsSnap.size
    txsSnap.docs.forEach(tx => { volume += tx.data().amount })
  }

  await mjMetaDocRef.update({ 'monthly.updated': previousMonthEnd, 'monthly.txVolume': volume })

  console.log(`mj meta stats have been updated for period: previousMonthBeginning: ${previousMonthBeginning} - previousMonthEnd: ${previousMonthEnd}`)
  return true
}

/**
 * Retrieves the block info document, asynchronously.
 */
exports.getBlockInfo = async () => (await blockInfoMetaDocRef.get()).data()

/**
 * Retrieves a block by its no.
 */
exports.getBlock = async no => (await blocksColRef.doc(no.toString()).get()).data()

/**
 * Get a user doc by id, asynchronously.
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

  // update meta doc
  const metaDoc = await t.get(mjMetaDocRef)
  const meta = metaDoc.data()
  t.update(mjMetaDocRef, { marketCap: meta.marketCap + initBalance, userCount: meta.userCount + 1 })

  // create the first transaction for the user
  const txRef = txsColRef.doc()
  const signedTx = txUtils.sign({ id: txRef.id, from: { id: 'majorna', balance: 0 }, to: { id: uid, balance: 0 }, time, amount: initBalance })
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
 * @param showSenderName - If true, sender name will be stored as tx metadata in receiver user doc's txs.
 */
exports.makeTx = (from, to, amount, showSenderName) => firestore.runTransaction(async t => {
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
  // todo: const toName = receiver.name (only show if in user's contacts)

  // add tx to txs collection
  const txRef = txsColRef.doc()
  const signedTx = txUtils.sign({ id: txRef.id, from: { id: from, balance: sender.balance }, to: { id: to, balance: receiver.balance }, time, amount })
  t.create(txRef, signedTx)

  // update user docs with tx and updated balances
  addTxToUserDoc(sender, txRef.id, null, null, to, null, time, amount)
  t.update(senderDocRef, { balance: sender.balance - amount, txs: sender.txs })
  addTxToUserDoc(receiver, txRef.id, from, showSenderName && fromName, null, null, time, amount)
  t.update(receiverDocRef, { balance: receiver.balance + amount, txs: receiver.txs })

  return signedTx
})

/**
 * Creates and inserts the next block with given txs, asynchronously.
 * @param txs - Txs to be included in the block.
 * @param now - Optional creation time for the block.
 */
exports.insertBlock = (txs, now) => firestore.runTransaction(async t => {
  const blockInfoDoc = await t.get(blockInfoMetaDocRef)
  const blockInfo = blockInfoDoc.data()

  // create new block with the given txs and with reference to previous block header
  const newBlock = blockUtils.create(txs, blockInfo.header, now)
  blockUtils.sign(newBlock)
  blockUtils.verify(newBlock, blockInfo.header)

  // insert the new block
  const newBlockRef = blocksColRef.doc(newBlock.header.no.toString())
  t.create(newBlockRef, newBlock)

  // update block info doc
  blockInfo.header = newBlock.header
  blockInfo.pow = blockUtils.hashHeaderToPowStr(blockInfo.header)
  blockInfo.miner.targetDifficulty = config.blockchain.initialMinBlockDifficulty
  blockInfo.miner.reward = blockUtils.getBlockReward(blockInfo.miner.targetDifficulty)
  blockInfo.miner.headerStrWithoutNonce = blockUtils.getHeaderStr(newBlock.header, true, blockInfo.miner.targetDifficulty)
  t.set(blockInfoMetaDocRef, blockInfo)

  return newBlock
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
  const blockInfoDoc = await t.get(blockInfoMetaDocRef)
  const blockInfo = blockInfoDoc.data()
  const givenNonceDifficulty = blockUtils.getHashDifficultyFromStr(blockInfo.miner.headerStrWithoutNonce, nonce)
  if (givenNonceDifficulty < blockInfo.miner.targetDifficulty) {
    throw new utils.UserVisibleError(`Given nonce does not belong to the last block or is of insufficient difficulty.`)
  }
  const miningReward = blockUtils.getBlockReward(givenNonceDifficulty)

  // update last block
  const lastBlockRef = blocksColRef.doc(blockInfo.header.no.toString())
  const lastBlockDoc = await t.get(lastBlockRef)
  const lastBlock = lastBlockDoc.data()
  lastBlock.header.minDifficulty = blockInfo.miner.targetDifficulty
  lastBlock.header.nonce = nonce
  blockUtils.sign(lastBlock)

  // update block info
  blockInfo.header = lastBlock.header
  blockInfo.pow = blockUtils.hashHeaderToPowStr(blockInfo.header)
  blockInfo.miner.targetDifficulty = givenNonceDifficulty + config.blockchain.blockDifficultyIncrementStep
  blockInfo.miner.reward = blockUtils.getBlockReward(blockInfo.miner.targetDifficulty)
  blockInfo.miner.headerStrWithoutNonce = blockUtils.getHeaderStr(lastBlock.header, true, blockInfo.miner.targetDifficulty)

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

  // increase market marketCap
  const metaDoc = await t.get(mjMetaDocRef)
  const meta = metaDoc.data()
  t.update(mjMetaDocRef, { marketCap: meta.marketCap + miningReward })

  // block op writes (here to have reads before writes)
  t.update(lastBlockRef, { sig: lastBlock.sig, 'header.minDifficulty': lastBlock.header.minDifficulty, 'header.nonce': lastBlock.header.nonce })
  t.set(blockInfoMetaDocRef, blockInfo) // '.set' not to use dot notation for all nested fields

  // add tx to txs collection
  const txRef = txsColRef.doc()
  const signedTx = txUtils.sign({ id: txRef.id, from: { id: from, balance: 0 }, to: { id: to, balance: receiver.balance }, time, amount: miningReward })
  t.create(txRef, signedTx)

  // update user docs with tx and updated balances
  addTxToUserDoc(receiver, txRef.id, from, fromName, null, null, time, miningReward)
  t.update(receiverDocRef, { balance: receiver.balance + miningReward, txs: receiver.txs })

  return signedTx
})

/**
 * Deposits given amount of mj to given user by ID.
 */
exports.giveMj = (userId, usdAmount) => firestore.runTransaction(async t => {
  assert(userId, '"userId" parameter is required')
  assert(usdAmount, '"usdAmount" parameter is required')

  const time = new Date()

  // sender is majorna
  const from = 'majorna'
  const fromName = 'Majorna'

  // check if receiver exists
  const receiverDocRef = usersColRef.doc(userId)
  const receiverDoc = await t.get(receiverDocRef)
  if (!receiverDoc.exists) {
    throw new utils.UserVisibleError(`receiver ID:${userId} does not exist`)
  }
  const receiver = receiverDoc.data()

  // increase market marketCap
  const metaDoc = await t.get(mjMetaDocRef)
  const meta = metaDoc.data()
  const amount = Math.round(usdAmount / meta.val)
  t.update(mjMetaDocRef, { marketCap: meta.marketCap + amount })

  // add tx to txs collection
  const txRef = txsColRef.doc()
  const signedTx = txUtils.sign({ id: txRef.id, from: { id: from, balance: 0 }, to: { id: userId, balance: receiver.balance }, time, amount })
  t.create(txRef, signedTx)

  // update user docs with tx and updated balances
  addTxToUserDoc(receiver, txRef.id, from, fromName, null, null, time, amount)
  t.update(receiverDocRef, { balance: receiver.balance + amount, txs: receiver.txs })

  return signedTx
})

/**
 * Add given notification object to given user's document's notifications array.
 */
exports.addNotification = async (uid, notification) => {
  const userDocRef = usersColRef.doc(uid)
  await userDocRef.update({ notifications: [notification] })
}

exports.clearNotifications = async uid => {
  const userDocRef = usersColRef.doc(uid)
  await userDocRef.update({ notifications: firebaseAdmin.firestore.FieldValue.delete() })
}

/**
 * Adds a tx in txs array property in the given user doc. This function mutates the doc.
 * Last item in the txs array is dropped if max txs in the doc limit is reached.
 * @param userData - User object.
 * @param txId
 * @param fromId
 * @param fromName
 * @param toId
 * @param toName
 * @param time - JavaScript DateTime object instance.
 * @param amount - Amount in mj.
 */
function addTxToUserDoc (userData, txId, fromId, fromName, toId, toName, time, amount) {
  assert(amount, `"amount" field is required as the last field`)
  assert(userData.id !== fromId && userData.id !== toId, 'txs array object should omit self referencing IDs, otherwise we cannot know if it is outgoing or incoming tx')

  if (fromId) {
    const tx = { id: txId, from: fromId, time, amount }
    fromName && (tx.fromName = fromName)
    userData.txs.unshift(tx)
  } else {
    userData.txs.unshift({ id: txId, to: toId, toName, time, amount })
  }

  userData.txs.length > maxTxsInUserDoc && (userData.txs.length = maxTxsInUserDoc)
}
