module.exports = {
  app: {
    isNode: !!process
  },
  crypto: {
    algo: 'SHA256',
    encoding: 'base64' // todo: can use DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273 (or compressed ec sig for further reduction)
  }
}