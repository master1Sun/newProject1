const app = getApp();
var config = require('../../libs/url.js')

const months = []
const days = []
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
// 在页面中定义插屏广告
let interstitialAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isCard: false,
    isShow: false,
    dataList: [],
    months,
    month: new Date().getMonth() + 1,
    days,
    day: new Date().getDate(),
    value: [new Date().getMonth(), new Date().getDate() - 1],
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.isCard) {
      this.setData({
        isCard: app.globalData.isCard
      })
    }
    if (app.globalData.skin) {
      this.setData({
        skin: app.globalData.skin
      })
    }
    wx.showLoading({
      title: '获取数据中',
    });
    this.queryConent(new Date().getMonth() + 1 + '/' + new Date().getDate());

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-813a8df8d3099458'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  bindChange(e) {
    const val = e.detail.value
    var m = this.data.months[val[0]];
    var d = this.data.days[val[1]];
    this.setData({
      month: m,
      day: d
    })
    wx.showLoading({
      title: '获取数据中',
    });
    this.queryConent(m + '/' + d);
  },
  queryConent: function(date) {
    var that = this;
    wx.request({
      url: config.Config.queryEvent,
      data: {
        appid: config.Config.key,
        date: date
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        res.data.data.sort(function(a, b) {
          return Date.parse(a.eid) - Date.parse(b.eid);
        });
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

  onPreviewSub: function(event) {
    var eid = event.currentTarget.dataset.list; //获取data-list
    app.globalData.eid = eid;
    wx.navigateTo({
      url: '../../pages/todayOnhistoryInfo/todayOnhistoryInfo'
    })
  },
})