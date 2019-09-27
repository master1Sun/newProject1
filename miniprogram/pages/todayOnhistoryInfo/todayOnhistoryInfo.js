const app = getApp();
var config = require('../../libs/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    eid: '',
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.showLoading({
      title: '获取数据中',
    });
    if (app.globalData.skin) {
      this.setData({
        skin: app.globalData.skin
      })
    }
    this.setData({
      eid: app.globalData.eid.eid
    })
    this.queryConent(this.data.eid);
  },
  onLockImage: function(event) {
    var imgUrl = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    })
  },
  queryConent: function(eid) {
    var that = this;
    wx.request({
      url: config.Config.queryDetail,
      data: {
        appid: config.Config.key,
        date: eid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          isShow: true,
          dataList: res.data.data
        })
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