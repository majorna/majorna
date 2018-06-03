import Tx from './Tx'

it('Tx', async () => {
  expect(new Tx())
  const fullStrArr = new Uint8Array(8)
  expect(await crypto.subtle.digest('SHA-256', fullStrArr.buffer))
})
