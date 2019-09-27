// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var data;
  if (event.ptype){
    data={
      _openid: wxContext.OPENID,
      ptype: event.ptype
    }
  }else{
    data = {
      _openid: wxContext.OPENID
    }
  }
  const countResult = await db.collection('store').where(data).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection("store").where(data).get()
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
}