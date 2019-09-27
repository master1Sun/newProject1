// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.type == 0) {
    //查询今日是否签到
    return await db.collection('sign').where({
      _openid: wxContext.OPENID,
      signDay: event.signDay
    }).get().then(res => {
      return res;
    })
  } else if (event.type == 1) {
    //查询今日是否签到
    return await db.collection('sign').add({
      data: {
        _openid: wxContext.OPENID,
        signDay: event.signDay,
        signTime: event.signTime,
        signName: '已签到',
        longitude: event.longitude,
        latitude: event.latitude,
        address: event.address,
        city: event.city,
        bigImgUrl: event.bigImgUrl,
        nickName: event.nickName,
        model: event.model
      }
    }).then(res => {
      return res;
    }).catch(err => {

    })
  } else if (event.type == 2) {
    const _ = db.command
    var toDay = formatTime(new Date());
    const countResult = await db.collection('sign').where({
      _openid: wxContext.OPENID,
      signDay: _.gte(toDay)
    }).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection("sign").where({
        _openid: wxContext.OPENID,
        signDay: _.gte(toDay)
      }).orderBy('signDay', 'desc').get()
      tasks.push(promise)
    }
    if (tasks.length > 0) {
      // 等待所有
      return (await Promise.all(tasks)).reduce((acc, cur) => ({
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }))
    } else {
      return;
    }
  } else if (event.type == 3) {
    return await db.collection('sign').where({
      signDay: event.signDay
    }).limit(50).orderBy('signTime', 'asc').get().then(res => {
      return res;
    })
  }
}

function formatTime(date) {
  const year = date.getFullYear() - 1
  const month = date.getMonth()
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}