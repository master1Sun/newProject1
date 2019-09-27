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
  if (event.a == "all") {
    return await db.collection('score').limit(100).orderBy('score', 'desc').get()
  } else {
    return await db.collection('score').where({
      openid: wxContext.OPENID,
    }).get()
  }
}