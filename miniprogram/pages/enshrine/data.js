var db = wx.cloud.database();
var onloadData = function(that) {
  wx.cloud.callFunction({
    name: 'queryStore',
    success: res => {
      if (res.result) {
        var list = []
        res.result.data.forEach(function(val) {
          val.save = "取消收藏";
          list.push(val)
        })
        that.setData({
          searchDatas: list
        })
      } else {
        that.setData({
          searchDatas: []
        })
      }
      wx.hideLoading()
    },
    fail: err => {
      message(that, 2, '查询出错')
      wx.hideLoading()
    }
  })
}



var db = wx.cloud.database();
var del = function(that, id) {
  db.collection('store').doc(id).remove().then(res => {
    message(that, 1, '取消收藏成功')
  }).catch(err => {
    message(that, 2, '取消收藏失败')
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
  onloadData,
  del,
  message
};