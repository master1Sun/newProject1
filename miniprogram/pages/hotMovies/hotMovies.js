const app = getApp();
const year = new Date().getFullYear()
const month = new Date().getMonth() + 1
const date = new Date().getDate()
var config = require('../../libs/url.js')
var log = require('../../util/log.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    databool1: false,
    dataList1: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.query1()
  },
  query1: function() {
    let that = this;
    that.setData({
      dataList1: [],
      databool1: false
    })
    wx.showLoading({
      title: '获取数据中',
    });
    wx.request({
      url: config.Config.moveing,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.reason == "success") {
          that.setData({
            dataList1: res.data.data,
            databool1: true
          })
          log.setCloudUSerInfo('热门电影', '查看了当前热门电影排行前十电影是【' + that.data.dataList1[0].MovieName + '】,【' + that.data.dataList1[1].MovieName + '】,【' + that.data.dataList1[2].MovieName + '】,【' + that.data.dataList1[3].MovieName + '】,【' + that.data.dataList1[4].MovieName + '】,【' + that.data.dataList1[5].MovieName + '】,【' + that.data.dataList1[6].MovieName + '】,【' + that.data.dataList1[7].MovieName + '】,【' + that.data.dataList1[8].MovieName + '】,【' + that.data.dataList1[9].MovieName + '】,【' + that.data.dataList1[10].MovieName + '】');
        } else {
          wx.showToast({
            icon: 'none',
            title: '没查到数据！',
          })
        }
      },
      fail(e) {
        wx.showToast({
          icon: 'none',
          title: '没数据啦！',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
})