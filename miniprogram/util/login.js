// 引入SDK核心类
var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
var dateTime = require('../util/util.js')
// 实例化API核心类
var demo = new QQMapWX({
  key: '7A2BZ-7TKRP-MLYDD-LNAIJ-T67CS-RXBI7' // 必填
});
var db = wx.cloud.database();

var uData = {
  openid: '',
  time: '',
  status: false,
  readNum: 1,
  publish: false,
  userLevel: getUserLevel(1)[0],
  userLevelColor: getUserLevel(1)[1],
  nickName: '',
  address: '中国',
  bigImgUrl: '',
  screenHeightAndWidth: '',
  system: '',
  model: '',
  networkType: ''
}

module.exports = {
  login: login
}

function login(suc) {
  uData.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo'] && res.authSetting['scope.userLocation']) {
        getinfoDataAddress(suc)
      } else if (res.authSetting['scope.userInfo']) {
        getinfoData(suc);
      } else {
        getinfoData_no(suc);
      }
      res.authSetting = {
        "scope.userInfo": true,
        "scope.userLocation": true,
      }
    }
  })
}

function getinfoData_no(suc) {
  wx.getSystemInfo({
    success: function(res) {
      uData.model = res.model;
      uData.screenHeightAndWidth = res.screenHeight + "*" + res.screenWidth;
      uData.system = res.system;
      wx.getNetworkType({
        success: function(res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          uData.networkType = res.networkType;
          wirteData(suc);
        }
      })
    }
  })
}

function getinfoData(suc) {
  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  wx.getUserInfo({
    success: res => {
      uData.avatarUrl = res.userInfo.avatarUrl;
      uData.nickName = res.userInfo.nickName;
      wx.getSystemInfo({
        success: function(res) {
          uData.model = res.model;
          uData.screenHeightAndWidth = res.screenHeight + "*" + res.screenWidth;
          uData.system = res.system;
          wx.getNetworkType({
            success: function(res) {
              // 返回网络类型, 有效值：
              // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
              uData.networkType = res.networkType;
              wirteData(suc);
            }
          })
        }
      })
    }
  })
}

function getinfoDataAddress(suc) {
  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  wx.getUserInfo({
    success: res => {
      uData.avatarUrl = res.userInfo.avatarUrl;
      uData.userInfo = res.userInfo;
      uData.nickName = res.userInfo.nickName;
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          // 调用接口
          demo.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function(res) {
              uData.address = res.result.address;
              uData.city = res.result.address_component.city;
              wx.getSystemInfo({
                success: function(res) {
                  uData.model = res.model,
                    uData.screenHeightAndWidth = res.screenHeight + "*" + res.screenWidth,
                    uData.system = res.system;
                  wx.getNetworkType({
                    success: function(res) {
                      // 返回网络类型, 有效值：
                      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                      uData.networkType = res.networkType;
                      wirteData(suc);
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

function wirteData(suc) {
  loadData(suc);
}


function loadData(suc) {
  getCloudUSerInfo(function(res) {
    uData.openid = res.result.openid;
    uData.appid = res.result.appid;
    const adata = {
      openid: uData.openid,
      createTime: uData.time,
      lastTime: uData.time,
      status: false,
      readNum: 1,
      toDay: 1,
      toWeek: 1,
      city: uData.city,
      publish: uData.publish,
      userLevel: uData.userLevel,
      userLevelColor: uData.userLevelColor,
      nickName: uData.nickName,
      lastAddress: uData.address,
      bigImgUrl: uData.avatarUrl,
      screenHeightAndWidth: uData.screenHeightAndWidth,
      system: uData.system,
      model: uData.model,
      lastmodel: uData.model,
      networkType: uData.networkType,
      lastnetworkType: uData.networkType,
      lastsystem: uData.system,
      toDayStep: 0,
      toDayStepTime: ''
    }
    getData({
      _openid: uData.openid
    }, function(res) {
      if (res.data && res.data.length <= 0) {
        addData(adata, function(res) {
          uData.readNum = 1;
          uData.toDay = 1;
          uData.toWeek = 1;
          uData.status = false;
          if (suc) {
            suc(uData);
          }
        }, function(e) {
          uData.readNum = 1;
          uData.toDay = 1;
          uData.toWeek = 1;
          uData.status = false;
          console.error(e)
          if (suc) {
            suc(uData);
          }
        })
      } else {
        var _id = res.data[0]._id;
        var _readNum = res.data[0].readNum;
        var _toDay = res.data[0].toDay;
        var _toWeek = res.data[0].toWeek;
        _readNum = _readNum + 1;
        _toDay = _toDay + 1;
        _toWeek = _toWeek + 1;
        var levelName = getUserLevel(_readNum)[0];
        var levelColor = getUserLevel(_readNum)[1];
        uData.userLevel = levelName;
        uData.userLevelColor = levelColor;
        let update = [];
        if (uData.avatarUrl) {
          update = {
            readNum: _readNum,
            toDay: _toDay,
            toWeek: _toWeek,
            lastTime: uData.time,
            lastAddress: uData.address,
            lastnetworkType: uData.networkType,
            lastsystem: uData.system,
            bigImgUrl: uData.avatarUrl,
            nickName: uData.nickName,
            userLevel: levelName,
            userLevelColor: levelColor,
            lastmodel: uData.model,
            city: uData.city
          }
        } else {
          update = {
            readNum: _readNum,
            toDay: _toDay,
            toWeek: _toWeek,
            lastTime: uData.time,
            lastAddress: uData.address,
            lastnetworkType: uData.networkType,
            lastsystem: uData.system,
            userLevel: levelName,
            userLevelColor: levelColor,
            lastmodel: uData.model,
            city: uData.city
          }
        }

        updateData(_id, update, function() {
          uData.readNum = _readNum || 1;
          uData.toDay = _toDay || 1;
          uData.toWeek = _toWeek || 1;
          uData.status = res.data[0].status || uData.status;
          uData.publish = res.data[0].publish || uData.publish;
          if (suc) {
            suc(uData);
          }
        }, function(e) {
          uData.readNum = 1;
          uData.status = false;
          if (suc) {
            suc(uData);
          }
          console.error(e)
        })
      }
    })
  })
}

function getUserLevel(number) {
  if (number < 10) {
    return ['黑铁Ⅴ', '#666666'];
  } else if (10 <= number && number < 25) {
    return ['黑铁Ⅳ', '#666666'];
  } else if (25 <= number && number < 40) {
    return ['黑铁Ⅲ', '#666666'];
  } else if (40 <= number && number < 55) {
    return ['黑铁Ⅱ', '#666666'];
  } else if (55 <= number && number < 70) {
    return ['黑铁Ⅰ', '#666666'];
  } else if (70 <= number && number < 85) {
    return ['青铜Ⅴ', '#CDAD00'];
  } else if (85 <= number && number < 100) {
    return ['青铜Ⅳ', '#CDAD00'];
  } else if (100 <= number && number < 115) {
    return ['青铜Ⅲ', '#CDAD00'];
  } else if (115 <= number && number < 130) {
    return ['青铜Ⅱ', '#CDAD00'];
  } else if (130 <= number && number < 145) {
    return ['青铜Ⅰ', '#CDAD00'];
  } else if (145 <= number && number < 160) {
    return ['白银Ⅴ', '#ABABAB'];
  } else if (160 <= number && number < 175) {
    return ['白银Ⅳ', '#ABABAB'];
  } else if (175 <= number && number < 190) {
    return ['白银Ⅲ', '#ABABAB'];
  } else if (190 <= number && number < 210) {
    return ['白银Ⅱ', '#ABABAB'];
  } else if (210 <= number && number < 225) {
    return ['白银Ⅰ', '#ABABAB'];
  } else if (225 <= number && number < 240) {
    return ['黄金Ⅴ', '#CDAD00'];
  } else if (240 <= number && number < 255) {
    return ['黄金Ⅳ', '#CDAD00'];
  } else if (255 <= number && number < 270) {
    return ['黄金Ⅲ', '#CDAD00'];
  } else if (270 <= number && number < 285) {
    return ['黄金Ⅱ', '#CDAD00'];
  } else if (285 <= number && number < 300) {
    return ['黄金Ⅰ', '#CDAD00'];
  } else if (300 <= number && number < 350) {
    return ['白金Ⅴ', '#E066FF'];
  } else if (350 <= number && number < 450) {
    return ['白金Ⅳ', '#E066FF'];
  } else if (450 <= number && number < 650) {
    return ['白金Ⅲ', '#E066FF'];
  } else if (650 <= number && number < 1000) {
    return ['白金Ⅱ', '#E066FF'];
  } else if (1000 <= number && number < 1500) {
    return ['白金Ⅰ', '#E066FF'];
  } else if (1500 <= number && number < 2000) {
    return ['钻石Ⅴ', '#EE00EE'];
  } else if (2000 <= number && number < 2500) {
    return ['钻石Ⅳ', '#EE00EE'];
  } else if (2500 <= number && number < 3500) {
    return ['钻石Ⅲ', '#EE00EE'];
  } else if (3500 <= number && number < 4500) {
    return ['钻石Ⅱ', '#EE00EE'];
  } else if (4500 <= number && number < 6000) {
    return ['钻石Ⅰ', '#EE00EE'];
  } else if (6000 <= number && number < 8000) {
    return ['大师', '#EE4000'];
  } else {
    return ['王者', '#FF0000'];
  }
}

function getWalkingSteps(callback) {
  wx.login({
    success: function(resLogin) {
      if (resLogin.code) {
        wx.getWeRunData({
          success(resRun) {
            wx.cloud.callFunction({
              name: 'sendTemplateMessage',
              data: {
                code: resLogin.code,
                encryptedData: resRun.encryptedData,
                iv: resRun.iv
              },
              success: res => {
                if (callback) {
                  callback(res)
                }
              },
              fail: err => {
                if (callback) {
                  callback(null)
                }
              }
            })
          },
          fail: err => {
            if (callback) {
              callback(null)
            }
          },
          fail: err => {
            if (callback) {
              callback(null)
            }
          }
        })
      }
    }
  })
}




function getData(data, success, error) {
  db.collection('user').where(data).get().then(res => {
      if (success) {
        success(res);
      }
    })
    .catch(err => {
      if (error) {
        error(err);
      }
    })
}

function addData(data, success, error) {
  db.collection('user').add({
      data: data
    }).then(res => {
      if (success) {
        success(res);
      }
    })
    .catch(err => {
      if (error) {
        error(err);
      }
    })
}

function updateData(_id, data, success, error) {
  db.collection('user').doc(_id).update({
    data: data
  }).then(res => {
    if (success) {
      success(res);
    }
  }).catch(err => {
    if (error) {
      error(err);
    }
  })
}

function getCloudUSerInfo(success, error) {
  wx.cloud.callFunction({
    name: 'login',
    success: res => {
      if (success) {
        success(res);
      }
    },
    fail: err => {
      if (error) {
        error(err);
      }
    }
  })
}


// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt) { //author: meizz   
  var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日   
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}