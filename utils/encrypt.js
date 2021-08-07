const crypto = require('crypto')

const URL = ''
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.MERCHANT_HASH_KEY
const HashIV = process.env.MERCHANT_HASH_IV
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = URL+"/newebpay/callback?from=ReturnURL"
const NotifyURL = URL+"/newebpay/callback?from=NotifyURL"
const ClientBackURL = URL+"/orders"

function getDataForTradeInfo(amount, orderDescription, email) {
  const data = {
    MerchantID: MerchantID, // 商店代號
    RespondType: 'JSON', // 回傳格式
    TimeStamp: Date.now(), // 時間戳記
    Version: 1.6, // 串接程式版本
    MerchantOrderNo: Date.now(), // 商店訂單編號
    LoginType: 0, // 智付通會員
    TradeLimit: 60, // trade duration limit, if exceed, result in trade failure
    OrderComment: 'Proceeding to payment', // 商店備註
    Amt: amount, // 訂單金
    ItemDesc: orderDescription, // 產品名稱
    Email: email, // 付款人電子信箱
    ReturnURL: ReturnURL, // 支付完成返回商店網址
    NotifyURL: NotifyURL, // 支付通知網址/每期授權結果通知
    ClientBackURL: ClientBackURL, // 支付取消返回商店網址
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

module.exports = {
  chainData,
  aesEncrypt,
  shaHash,
  getDataForTradeInfo
}