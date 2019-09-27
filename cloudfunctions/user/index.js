// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  var  page = 0;
  if (event.page){
     page = event.page;
  }
  return await db.collection('user').skip(page).limit(100).get({
    success: res => {
      return res
    },
    fail: err => {
      return "查询失败"
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
}