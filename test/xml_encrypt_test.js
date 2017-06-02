
const log = require('debug')('xml-encrypt')
const WXBizMsgCrypt = require('wechat-crypto')
const {appId, appSecret, appKey, token, encodingAESKey} = require('../config')
const wxCrypt = new WXBizMsgCrypt(token, encodingAESKey, appKey)

var randomString = function(length) {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

const timestamp = Math.round(Date.now() / 1000)
const nonce = randomString(6)

const raw_msg1 = `
<xml>
  <ToUserName><![CDATA[gh_fb9688c2a4b2]]></ToUserName>
  <FromUserName><![CDATA[od1P50M-fNQI5Gcq-trm4a7apsU8]]></FromUserName>
  <CreateTime>1488856591</CreateTime>
  <MsgType><![CDATA[event]]></MsgType>
  <Event><![CDATA[weapp_audit_fail]]></Event>
  <Reason><![CDATA[1:账号信息不符合规范:<br>
(1):包含色情因素<br>
  2:服务类目"金融业-保险_"与你提交代码审核时设置的功能页面内容不一致:<br>
(1):功能页面设置的部分标签不属于所选的服务类目范围。<br>
(2):功能页面设置的部分标签与该页面内容不相关。<br>
]]></Reason>
  <FailTime>1488856591</FailTime>
</xml>
`

const raw_msg2 = `
<xml>
  <ToUserName><![CDATA[gh_fb9688c2a4b2]]></ToUserName>
  <FromUserName><![CDATA[od1P50M-fNQI5Gcq-trm4a7apsU8]]></FromUserName>
  <CreateTime>1488856741</CreateTime>
  <MsgType><![CDATA[event]]></MsgType>
  <Event><![CDATA[weapp_audit_success]]></Event>
  <SuccTime>1488856741</SuccTime>
</xml>
`

const encrypt = wxCrypt.encrypt(raw_msg2)

const msgSignature = wxCrypt.getSignature(timestamp, nonce, encrypt)

const uri = `?signature=f345ac77aababfff845ffc0ffa445809fa994b8b&timestamp=${timestamp}&nonce=${nonce}&encrypt_type=aes&msg_signature=${msgSignature}`

log('uri %s', uri)

const msg = `
<xml>
  <AppId><![CDATA[${appId}]]></AppId>
  <encrypt><![CDATA[${encrypt}]]></encrypt>
</xml>
`
log('msg %s', msg)






