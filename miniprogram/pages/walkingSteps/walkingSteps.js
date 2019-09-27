const app = getApp()
var dateTime = require('../../util/util.js')
// // 引入SDK核心类
// var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// // 实例化API核心类
// var demo = new QQMapWX({
//   key: '7A2BZ-7TKRP-MLYDD-LNAIJ-T67CS-RXBI7' // 必填
// });
var db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    height: app.globalData.windowHeight,
    width: app.globalData.windowWidth,
    walkSteps: [],
    timer: '',
    step: 0, //今日步数
    number: 10000,
    totalItems: 10000, //默认目标数据1万
    isCard: false,
    skin: false,
    TabCur: 0,
    scrollLeft: 0,
    nvrList: ['近30天步数'],
    noList: [], //同城榜
    addressList: [] //全国榜
  },
  tabSelect: function(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  showModal: function(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal: function(e) {
    this.setData({
      modalName: null
    })
  },
  hideModalOK: function() {
    this.setData({
      totalItems: this.data.number
    })
    wx.setStorage({
      key: 'totalItems',
      data: this.data.totalItems
    })
    this.getResultComment(this.data.step);
    this.showScoreAnimation(this.data.step, this.data.totalItems);
    this.setData({
      modalName: null
    })
  },
  inputValue: function(event) {
    var n = event.detail.value;
    this.setData({
      number: n
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (app.globalData.isCard) {
      that.setData({
        isCard: app.globalData.isCard
      })
    }
    if (app.globalData.skin) {
      that.setData({
        skin: app.globalData.skin
      })
    }
    wx.getStorage({
      key: 'totalItems',
      success(res) {
        if (res.data) {
          that.setData({
            totalItems: res.data
          })
        }
      }
    })
    this.getData();
  },
  onShow: function() {
    this.getData();
  },
  getData: function() {
    var that = this;
    wx.login({
      success: function(resLogin) {
        if (resLogin.code) {
          wx.getWeRunData({
            success(resRun) {
              wx.showLoading({
                title: '获取数据中',
              });
              let toDayTime = dateTime.formatTimeDay(new Date());
              wx.cloud.callFunction({
                name: 'sendTemplateMessage',
                data: {
                  code: resLogin.code,
                  datetime: toDayTime,
                  encryptedData: resRun.encryptedData,
                  iv: resRun.iv
                },
                success: res => {
                  var wsList = [];
                  for (var i = 0; i < res.result.stepInfoList.length; i++) {
                    var dt = dateTime.formatTimeTwo(res.result.stepInfoList[i].timestamp, 'Y/M/D')
                    var ws = res.result.stepInfoList[i].step
                    var d = {
                      timestamp: dt,
                      step: ws
                    }
                    wsList.push(d)
                  }
                  wsList.sort(function(a, b) {
                    return Date.parse(b.timestamp) - Date.parse(a.timestamp)
                  })
                  let toDay = dateTime.formatTimeDay(new Date());
                  wsList.forEach(function(v, i) {
                    if (v.timestamp == toDay) {
                      that.setData({
                        step: v.step
                      })
                    }
                  })
                  // 页面初始化 options为页面跳转所带来的参数
                  that.getResultComment(that.data.step);
                  that.showScoreAnimation(that.data.step, that.data.totalItems);
                  //写入数据到页面
                  that.setData({
                    walkSteps: wsList
                  })
                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '获取数据失败！',
                  })
                },
                complete: () => {
                  wx.hideLoading()
                }
              })
            },
            fail: err => {
              that.setData({
                modalName: 'DialogModal2'
              })
            }
          })
        }
      }
    })
  },
  showScoreAnimation: function(rightItems, totalItems) {
    let that = this;
    let copyRightItems = rightItems;
    // 页面渲染完成
    // 这部分是灰色底层
    let cxt_arc = wx.createCanvasContext('canvasArc'); //创建并返回绘图上下文context对象。
    cxt_arc.setLineWidth(6); //绘线的宽度
    cxt_arc.setStrokeStyle('#d2d2d2'); //绘线的颜色
    cxt_arc.setLineCap('round'); //线条端点样式
    cxt_arc.beginPath(); //开始一个新的路径
    cxt_arc.arc(53, 53, 50, 0, 2 * Math.PI, false); //设置一个原点(53,53)，半径为50的圆的路径到当前路径
    cxt_arc.stroke(); //对当前路径进行描边
    //这部分是蓝色部分
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#3ea6ff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath(); //开始一个新的路径
    cxt_arc.arc(53, 53, 50, -Math.PI * 1 / 2, 2 * Math.PI * (copyRightItems / totalItems) - Math.PI * 1 / 2, false);
    cxt_arc.stroke(); //对当前路径进行描边
    cxt_arc.draw();

  },

  getResultComment: function(completePercent) {
    let that = this;
    let countText;
    if (completePercent >= that.data.totalItems) {
      countText = "达标啦";
    } else {
      countText = completePercent;
    }
    that.setData({
      resultComment: countText
    })
  },
})