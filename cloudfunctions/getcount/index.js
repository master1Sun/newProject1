// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const tasks = []
  const promise = db.collection('store').count()
  tasks.push(promise)
  const promise1 = db.collection('loginCount').count()
  tasks.push(promise1)
  const promise2 = db.collection('log').count()
  tasks.push(promise2)
  if (tasks.length > 0) {
    // 等待所有
    return await Promise.all(tasks)
  } else {
    return -1;
  }
}