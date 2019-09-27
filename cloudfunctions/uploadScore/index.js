// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: 'base-123',
  traceUser: true,
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const promise = await db.collection('score').where({
    openid: wxContext.OPENID,
  }).get()
  if (promise.data.length > 0) {
    let = '';
    if (promise.data[0].score < event.score) {
      d = {
        score: event.score,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        time: event.time
      }
    } else {
      d = {
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
      }
    }
    return db.collection('score').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: d
      })
  } else {
    return db.collection('score').add({
      data: {
        openid: wxContext.OPENID,
        score: event.score,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        time: event.time
      }
    })
  }
}