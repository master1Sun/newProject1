const app = getApp();
var config = require('../../libs/openapiUrl-config.js')
var log = require('../../util/log.js')
var config1 = require('../../libs/url.js')
const months = []
const days = []
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
const year = new Date().getFullYear()
const month = new Date().getMonth() + 1
const date = new Date().getDate()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    isCard: false,
    pageText: 1,
    pageImages: 1,
    arrListImages: [],
    articlesImages: [],
    arrListText: [],
    articlesText: [],
    dataList: [],
    months,
    month: new Date().getMonth() + 1,
    days,
    day: new Date().getDate(),
    value: [new Date().getMonth(), new Date().getDate() - 1],
    date: '',
    databool1: false,
    dataList1: [],
    inputValue: '',
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    wx.showLoading({
      title: '获取数据中',
    });
    if (e.currentTarget.dataset.id == 0) {
      this.onloadData(0, false, 'text');
    } else if (e.currentTarget.dataset.id == 1) {
      this.onloadData(this.data.pageImages + 1, false, 0);
    } else if (e.currentTarget.dataset.id == 2) {
      this.queryConent(new Date().getMonth() + 1 + '/' + new Date().getDate());
    } else if (e.currentTarget.dataset.id == 3) {
      this.query1()
    } else if (e.currentTarget.dataset.id == 4) {
      var _this = this;
      log.getCloudUSerInfo(function (res) {
        _this.setData({
          data: res.result.data
        })
        wx.hideLoading()
      }, function (err) {
        console.log('出错' + err)
      })
    } else {
      wx.hideLoading()
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
    this.refreshLoadData(1);
  },
  refreshLoadData: function(p) {
    wx.showLoading({
      title: '获取数据中',
    });
    if (this.data.TabCur == 0) {
      this.onloadData(p, false, 'text');
    } else if (this.data.TabCur == 1) {
      this.onloadData(p, false, 0);
    } else if (this.data.TabCur == 2) {
      this.queryConent(new Date().getMonth() + 1 + '/' + new Date().getDate());
    } else {
      wx.hideLoading()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.refreshLoadData(0);
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.TabCur == 0) {
      this.onloadData(this.data.pageText + 1, true, 'text');
    } else if (this.data.TabCur == 1) {
      this.onloadData(this.data.pageImages + 1, true, 0);
    } else if (this.data.TabCur == 2) {
      this.queryConent(new Date().getMonth() + 1 + '/' + new Date().getDate());
    } else {
      wx.hideLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  query1: function () {
    let that = this;
    that.setData({
      dataList1: [],
      databool1: false
    })
    wx.showLoading({
      title: '获取数据中',
    });
    wx.request({
      url: config1.Config.moveing,
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
  queryConent: function(date) {
    var that = this;
    wx.request({
      url: config1.Config.queryEvent,
      data: {
        appid: config1.Config.key,
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
  onloadData: function(p, bool, type) {
    var count = 20;
    var that = this;
    var Urls = config.Config.getJoke;
    wx.request({
      url: Urls,
      data: {
        type: type,
        count: count,
        page: p
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (type == 'text') {
          that.loadText(bool, res, p);
        } else {
          that.loadImages(bool, res, p);
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
  loadText: function(bool, res, p) {
    var that = this;
    if (bool == true) {
      for (var i = 0; i < res.data.result.length; i++) {
        var item = res.data.result[i];
        that.data.arrListText.push(item);
      }
      that.setData({
        pageText: p,
        articlesText: that.data.arrListText
      })
    } else {
      that.setData({
        arrListText: [],
      })
      for (var i = 0; i < res.data.result.length; i++) {
        var item = res.data.result[i];
        that.data.arrListText.push(item);
      }
      that.setData({
        pageText: p,
        articlesText: that.data.arrListText
      })
    }
  },
  loadImages: function(bool, res, p) {
    var that = this;
    if (bool == true) {
      for (var i = 0; i < res.data.result.length; i++) {
        var item = res.data.result[i];
        if (item.type != "text") {
          that.data.arrListImages.push(item);
        }
      }
      that.setData({
        pageImages: p,
        articlesImages: that.data.arrListImages
      })
    } else {
      that.setData({
        arrListImages: [],
      })
      for (var i = 0; i < res.data.result.length; i++) {
        var item = res.data.result[i];
        if (item.type != "video" && item.video == null && item.type != "text") {
          that.data.arrListImages.push(item);
        }
      }
      that.setData({
        pageImages: p,
        articlesImages: that.data.arrListImages
      })
    }
  },
  onLockComment: function(event) {
    var list = event.currentTarget.dataset.list
    app.globalData.list = list;
    wx.navigateTo({
      url: '../../pages/storyHappyInfo/storyHappyInfo',
    })
    log.setCloudUSerInfo('趣味段子', '跳转趣味详情,作者：' + list.name + '发表的内容【' + list.text + '】');
  },
})