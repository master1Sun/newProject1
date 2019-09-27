// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const axios = require('axios')
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  // const wxContext = cloud.getWXContext()
  let access_token = await db.collection("session_key").doc('session_key_id').get()
  let data = await db.collection("express").where({
    formStatus: true,
    status: 0
  }).get().then(res => {
    return res
  })
  if (data.data.length > 0) {
    for (var i = 0; i < data.data.length; i++) {
      let form_id = data.data[i].form_id
      let nu = data.data[i].expressCode
      let com = data.data[i].expressCom
      let expressName = data.data[i].expressName
      let _time = data.data[i].createTime
      let openid = data.data[i].openid
      let res = await getSession_key(access_token.data.session_key, event, form_id, nu, com, expressName, openid)
    }
    return await db.collection("express").update({
      data: {
        formStatus: false
      }
    })
  } else {
    return -1;
  }
}

async function getSession_key(_access_token, event, form_id, nu, com, expressName, openid) {
  let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
  var date1 = new Date();
  var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate(); //time1表示当前时间
  let _jsonData = {
    access_token: _access_token,
    touser: openid,
    template_id: 'DeisuLHLTwfuRv-uUxWDRAuwcd-_N4GH9M3TdO0XiqU',
    form_id: form_id,
    page: "pages/indexInfo/indexInfo?num=" + nu + "&code=" + com,
    data: {
      "keyword1": {
        "value": expressName,
        "color": "#173177"
      },
      "keyword2": {
        "value": nu,
        "color": "#173177"
      },
      "keyword3": {
        "value": '点击快速查看',
        "color": "#FFFFFF"
      },
      "keyword4": {
        "value": time1,
        "color": "#173177"
      },
    },
    // "emphasis_keyword": "keyword1.DATA"
  }
  return await axios({
    method: 'POST',
    url: url,
    data: _jsonData,
    success: function(res) {
      return res;
    }
  })
}