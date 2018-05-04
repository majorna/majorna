const assert = require('assert')
const crypto = require('crypto')
const config = require('../config/config')
const db = require('../data/db')
const testData = require('../config/test').data

suite('pubroute: webhooks', () => {
  test('coinbase-commerce', async () => {
    // prepare request
    const payload = {
      id: 1,
      scheduled_for: '2017-01-31T20:50:02Z',
      event: {
        id: '24934862-d980-46cb-9402-43c81b0cdba6',
        type: 'charge:confirmed',
        api_version: '2018-03-22',
        created_at: '2017-01-31T20:49:02Z',
        data: {
          code: '66BEOV2A',
          name: 'The Sovereign Individual',
          description: 'Mastering the Transition to the Information Age',
          hosted_url: 'https://commerce.coinbase.com/charges/66BEOV2A',
          created_at: '2017-01-31T20:49:02Z',
          expires_at: '2017-01-31T21:04:02Z',
          timeline: [
            {
              time: '2017-01-31T20:49:02Z',
              status: 'NEW'
            }
          ],
          metadata: {
            userId: '1'
          },
          pricing_type: 'no_price',
          payments: [
            {
              network: 'ethereum',
              transaction_id: '0xe02fead885c3e4019945428ed54d094247bada2d0ac41b08fce7ce137bf29587',
              status: 'CONFIRMED',
              value: {
                local: {
                  amount: '10.12',
                  currency: 'USD'
                },
                crypto: {
                  amount: '1.00',
                  currency: 'ETH'
                }
              },
              block: {
                height: 100,
                hash: '0xe02fead885c3e4019945428ed54d094247bada2d0ac41b08fce7ce137bf29587',
                confirmations_accumulated: 8,
                confirmations_required: 2
              }
            }
          ],
          addresses: {
            bitcoin: 'mymZkiXhQNd6VWWG7VGSVdDX9bKmviti3U',
            ethereum: '0x419f91df39951fd4e8acc8f1874b01c0c78ceba6'
          }
        }
      }
    }

    const hmac = crypto.createHmac('sha256', config.integrations.coinbaseCommerce.webhookSharedSecret)
    hmac.update(JSON.stringify(payload))
    const sig = hmac.digest('hex')

    // record initial stats
    const initMeta = await db.getMjMeta()
    const receiverInitBalance = (await db.getUser('1')).balance
    const amountMj = 10.12 / initMeta.val

    const res = await testData.users.anonRequest.post('/webhooks/coinbase-commerce', payload, {headers: {'X-CC-Webhook-Signature': sig}})
    assert(res.status === 200)

    // validate that user received mj
    const receiver = await db.getUser('1')
    assert(receiver.balance === receiverInitBalance + amountMj)
  })
})
