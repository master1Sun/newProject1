// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100


exports.main = async(event, context) => {
  if (event.address) {
    // 先取出集合记录总数
    const countResult = await db.collection('user').where({
      city: event.address,
      toDayStep: _.gt(1)
    }).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('user').field({
        city: true,
        userLevel: true,
        toDayStepTime: true,
        toDayStep:true,
        bigImgUrl:true,
        nickName: true,
        userLevelColor: true
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
        city: event.address,
        toDayStep: _.gt(1)
      }).get()
      tasks.push(promise)
    }
    if (tasks.length > 0) {
      // 等待所有
      return (await Promise.all(tasks)).reduce((acc, cur) => ({
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }))
    }
  } else {
    // 先取出集合记录总数
    const countResult = await db.collection('user').where({
      toDayStep: _.gt(1)
    }).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('user').field({
        city: true,
        userLevel: true,
        toDayStepTime: true,
        toDayStep: true,
        bigImgUrl: true,
        nickName: true,
        userLevelColor:true
      }).where({
        toDayStep: _.gt(1)
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))
  }
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