const app = getApp();
var data = require('./data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    ScreenHeight: app.globalData.ScreenHeight,
    ScreenWidth: app.globalData.ScreenWidth,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '获取数据中',
    });
    this.refreshLoadData()
  },
  refreshLoadData: function() {
    data.onloadData(this);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onSave(event) {
    var list = event.currentTarget.dataset.list
    var index = event.currentTarget.dataset.index
    var id = event.currentTarget.dataset.id
    if (list.save != "已取消收藏") {
      if (getApp().globalData.openid) {
        list.save = "已取消收藏"
        this.data.searchDatas[index] = list
        this.setData({
          searchDatas: this.data.searchDatas
        })
        data.del(this, id)
      } else {
        data.message(this, 2, '取消收藏失败')
      }
    }
  },
  openLocation(event) {
    var location = event.currentTarget.dataset.location
    var name = event.currentTarget.dataset.name
    var address = event.currentTarget.dataset.address
    var locations = location.split(",")
    var latitude = parseFloat(locations[1])
    var longitude = parseFloat(locations[0])
    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
      name: name,
      address: address
    })
  },
})