const crypto = require('crypto')
const URL = process.env.PAYMENT_URL
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV

const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway'
const ReturnURL = URL + '/spgateway/callback?from=ReturnURL'
const NotifyURL = URL + '/spgateway/callback?from=NotifyURL'
const ClientBackURL = URL + '/orders'
let data

function genDataChain(TradeInfo) {
  let results = []
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`)
  }
  return results.join('&')
}

function encryptTradeInfoAES(TradeInfo) {
  let encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
  let enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex')
  return enc + encrypt.final('hex')
}

function hashTradeInfoSHA(TradeInfo) {
  let sha = crypto.createHash('sha256')
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha.update(plainText).digest('hex').toUpperCase()
}

module.exports = {
  getTradeInfo: (Amt, Desc, Email) => {
    data = {
      MerchantID,
      RespondType: 'JSON',
      Version: 1.6,
      TimeStamp: Date.now(),
      MerchantOrderNo: Date.now(),
      Amt,
      ItemDesc: Desc,
      Email,
      LoginType: 0,
      ReturnURL,
      NotifyURL,
      ClientBackURL,
      OrderComment: 'OrderComment'
    }

    mpg_aes_encrypt = encryptTradeInfoAES(data)
    mpg_sha_encrypt = hashTradeInfoSHA(mpg_aes_encrypt)

    tradeInfo = {
      MerchantID,
      TradeInfo: mpg_aes_encrypt,
      TradeSha: mpg_sha_encrypt,
      Version: 1.6,
      PayGateWay,
      MerchantOrderNo: data.MerchantOrderNo
    }

    return tradeInfo
  },
  decryptTradeInfo: TradeInfo => {
    let decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
    decrypt.setAutoPadding(false)
    let text = decrypt.update(TradeInfo, 'hex', 'utf8')
    let plainText = text + decrypt.final('utf8')
    let result = plainText.replace(/[\x00-\x20]+/g, '')
    return result
  }
}
