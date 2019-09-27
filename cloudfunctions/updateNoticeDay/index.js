// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('user').update({
        data: {
          toDay: 0,
          toDayStep:0,
          toDayStepTime:''
        }
      }).then(suc => {
        return 1;
      })
      .catch(err => {
        return 0;
      })
  } catch (e) {
    return -1;
  }
}