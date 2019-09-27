var url = "https://restapi.amap.com/v3/place/around?parameters"
var key = '5e287897a4d3bd6e8c7f1d61794a12f5';
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '7A2BZ-7TKRP-MLYDD-LNAIJ-T67CS-RXBI7' // 必填7A2BZ-7TKRP-MLYDD-LNAIJ-T67CS-RXBI7
});
var db = wx.cloud.database();



function getsearch(keyword, page, callback, that) {
  getCity(function(res, latitude, longitude) {
    var location = longitude + "," + latitude;
    var query = {
      url: url,
      data: {
        keywords: keyword,
        city: res,
        key: key,
        location: location,
        offset: 25,
        page: page,
        sortrule: 'distance',
        radius: 50000,
        extensions: 'all'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (callback)
          callback(res.data)
      },
      fail() {
        wx.hideLoading()
      },
      complete() {
        wx.hideLoading();
        that.setData({
          isLoad: false
        })
      }
    }
    wx.request(query)
  })

}

function getCity(callback) {
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function(res) {
      var latitude = res.latitude
      var longitude = res.longitude
      // 调用接口
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {
          if (callback)
            callback(res.result.address_component.city, latitude, longitude)
        }
      })
    },
    fail() {
      wx.showToast({
        title: '请到设置处开启定位功能',
        icon: 'none',
        duration: 3000
      })
    },
  })
}


var save = function(that, uid, data) {
  db.collection('store').where({
      _openid: getApp().globalData.openid,
      id: uid
    }).get().then(res => {
      if (res.data && res.data.length <= 0) {
        db.collection('store').add({
            data: data
          }).then(res => {
            message(that, 1, '收藏成功')
          })
          .catch(err => {
            message(that, 2, '收藏失败')
          })
      } else {
        message(that, 2, '已经收藏过了')
      }
    })
    .catch(err => {
      message(that, 2, '收藏失败')
    })
}


var message = function(that, type, msg) {
  const messageType = Number(type);
  if (messageType == 1) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 800,
      mask: true
    });
  } else {
    wx.showToast({
      title: msg,
      icon: 'error',
      duration: 800,
      mask: true
    });
  }

  // const messageType = Number(type);
  // switch (messageType) {
  //   case 0:
  //     that.setData({
  //       show: true,
  //       type: 'primary',
  //       icon: true,
  //       duration: 1500,
  //       content: msg
  //     })
  //     break
  //   case 1:
  //     that.setData({
  //       show: true,
  //       type: 'success',
  //       duration: 1500,
  //       content: msg
  //     })
  //     break
  //   case 2:
  //     that.setData({
  //       show: true,
  //       type: 'error',
  //       duration: 1500,
  //       content: msg
  //     })
  //     break
  //   case 3:
  //     that.setData({
  //       show: true,
  //       type: 'warning',
  //       duration: 1500,
  //       content: msg
  //     })
  //     break
  //   case 4:
  //     that.setData({
  //       show: true,
  //       type: 'primary',
  //       duration: 1500,
  //       content: msg
  //     })
  //     break
  //   case 5:
  //     that.setData({
  //       show: true,
  //       type: 'primary',
  //       duration: 4000,
  //       content: msg
  //     })
  //     break
  // }
}
export {
  getsearch,
  save,
  message
}