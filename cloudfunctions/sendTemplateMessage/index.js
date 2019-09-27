// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')
const request = require('request')
const rp = require('request-promise')


cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  // let datetime = event.datetime
  let res = await getSession_key(wxContext, event)
  let rejson = JSON.parse(res)
  var steps = _encryptedData(wxContext.APPID, rejson.session_key, event.encryptedData, event.iv)
  // let rq = formatTimeDay(new Date());
  let toDayStep = 0;
  let toDayStepTime = '';
  if (steps != null) {
    let wsList = [];
    for (let i = 0; i < steps.stepInfoList.length; i++) {
      let dt = formatTimeTwo(steps.stepInfoList[i].timestamp, 'Y/M/D')
      let ws = steps.stepInfoList[i].step
      let d = {
        timestamp: dt,
        step: ws
      }
      wsList.push(d)
    }
    let count = wsList.length - 1;
    toDayStep = wsList[count].step
    toDayStepTime = wsList[count].timestamp
    await db.collection('user').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        toDayStep: toDayStep,
        toDayStepTime: toDayStepTime
      }
    })
    return steps
  }
}

async function getSession_key(wxContext, event) {
  return await rp({
    method: 'POST',
    url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + wxContext.APPID + "&secret=20d96d777b184a3295fcc4bf0401bb05&js_code=" + event.code + "&grant_type=authorization_code",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function(res) {
      return res;
    }
  })
}


function _encryptedData(appId, sessionKey, encryptedData, iv) {
  // base64 decode
  sessionKey = new Buffer(sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')
  try {
    // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded;
}



const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}