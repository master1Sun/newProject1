const app = getApp();
const config = require('../../libs/openapiUrl-config.js')
const Urls = config.Config.satinCommentApi;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Article: [],
    isCard: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
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
    this.setData({
      Article: app.globalData.list
    })
    wx.showLoading({
      title: '获取数据中',
    });
    this.onloadData(this.data.Article.sid, 1, false);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.onloadData(this.data.Article.sid, this.data.page + 1, true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onloadData: function(_id, p, bool) {
    var that = this;
    wx.request({
      url: Urls,
      data: {
        id: _id,
        page: p
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (bool == false) {
          that.setData({
            arrList: [],
          })
        }
        var pdata = res.data.data.normal.list;
        for (var i = 0; i < pdata.length; i++) {
          var item = pdata[i];
          if (item.content != '') {
            item.ctime = item.ctime.replace("T", " ");
            if (item.precmts && item.precmts != null && item.precmts.length > 0) {
              for (var z = 0; z < item.precmts.length; z++) {
                item.precmts[z].ctime = item.precmts[z].ctime.replace("T", " ");
              }
              item.precmts.sort(function(a, b) {
                return Date.parse(b.ctime) - Date.parse(a.ctime); //时间倒序
              });
            }
            that.data.arrList.push(item);
          }
        }
        that.setData({
          page: p,
          articles: that.data.arrList
        })
      },
      fail(e) {
        console.log(e)
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
  onLockImage: function(event) {
    var imgUrl = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    })
  },
})