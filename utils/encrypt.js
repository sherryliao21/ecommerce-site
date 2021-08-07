const crypto = require('crypto')

const URL = 'https://0b23b73c0735.ngrok.io' // ngrok for local testing
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.MERCHANT_HASH_KEY
const HashIV = process.env.MERCHANT_HASH_IV
const PayGateWay = 'https://ccore.newebpay.com/MPG/mpg_gateway'
const ReturnURL = URL + '/newebpay/callback?from=ReturnURL'
const NotifyURL = URL + '/newebpay/callback?from=NotifyURL'
const ClientBackURL = URL + '/orders'

function getDataForTradeInfo(amount, orderDescription, email) {
  const data = {
    MerchantID: MerchantID, 
    RespondType: 'JSON', 
    TimeStamp: new Date(), 
    Version: 1.6, 
    LangType: 'en',
    MerchantOrderNo: Date.now(), 
    LoginType: 0, // newebpay member login
    TradeLimit: 60, // trade duration limit, if exceed, result in trade failure
    OrderComment: 'Proceeding to payment', // order comment
    Amt: amount,
    ItemDesc: orderDescription, 
    Email: email,
    ReturnURL: ReturnURL, // after payment, notify user
    NotifyURL: NotifyURL, // after payment, notify admin
    ClientBackURL: ClientBackURL, // if cancel payment, go back to this url
  }

  const chainedData = chainData(data)  // chain data first, then encrypt & hash
  const aesEncryptedData = aesEncrypt(chainedData)
  const shaHashedData = shaHash(aesEncryptedData)

  const tradeInfo = {
    MerchantID: MerchantID, 
    TradeInfo: aesEncryptedData, 
    TradeSha: shaHashedData,
    Version: 1.6, 
    PayGateWay: PayGateWay,
    MerchantOrderNo: data.MerchantOrderNo,
  }

  return tradeInfo
}

// chain our data in order to proceed AES encryption
function chainData(tradeInfo) {
  const results = []
  for (let keyValuePair of Object.entries(tradeInfo)) {
    results.push(`${keyValuePair[0]}=${keyValuePair[1]}`)
  }
  return results.join("&")
}

// encrypt the trade info
function aesEncrypt(chainedData) {
  let encryptParams = crypto.createCipheriv("aes256", HashKey, HashIV)
  let result = encryptParams.update(chainedData, "utf8", "hex")
  return result + encryptParams.final("hex")
}

// hash the AES-encrypted info
function shaHash(aesEncryptedData) {
  let hash = crypto.createHash("sha256")
  let hashParams = `HashKey=${HashKey}&${aesEncryptedData}&HashIV=${HashIV}`
  const result = hash.update(hashParams).digest("hex").toUpperCase()
  return result
}

// decrypt encryption from pay gateway callback into our desired data
function decryptData(encryptedData) {
  let decryptParams = crypto.createDecipheriv("aes256", HashKey, HashIV)
  decryptParams.setAutoPadding(false)
  let decryption = decryptParams.update(encryptedData, "hex", "utf8") + decryptParams.final("utf8")
  let result = decryption.replace(/[\x00-\x20]+/g, "")
  return result
}

// fix paytime format
function convertTimeFormat(paytime) {
  const date = paytime.slice(0, 10)
  const time = paytime.slice(10)
  return date + 'T' + time + 'Z'
}

module.exports = {
  chainData,
  aesEncrypt,
  shaHash,
  getDataForTradeInfo,
  decryptData,
  convertTimeFormat
}