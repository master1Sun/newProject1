var search = require('./search.js')
const app = getApp();
var log = require('../../util/log.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    inputValue: '',
    page: 1,
    isLoad: false
  },
  //清除数据
  clear: function() {
    this.setData({
      inputValue: ''
    })
    this.setData({
      searchDatas: []
    })
  },
  //搜索框文本内容显示
  inputBind: function(event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  query: function() {
    if (this.data.inputValue == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var that = this;
    // wx.showLoading({
    //   title: '获取数据中',
    // });
    that.setData({
      isLoad: true
    })
    search.getsearch(this.data.inputValue, 1, function(res) {
      if (res.pois) {
        var list = []
        res.pois.forEach(function(val) {
          if (val.photos.length > 0) {
            var photoList = []
            val.photos.forEach(function(v) {
              photoList.push(v.url)
            })
            val.photoString = photoList
            val.photoStr = val.photos[0].url
          } else {
            val.photoString = []
            val.photoStr = null
          }
          val.save = "+ 收藏";
          list.push(val)
        })
        that.setData({
          searchDatas: list
        })
      } else {
        wx.showToast({
          title: '未找到数据！',
          icon: 'none',
          duration: 2000
        })
      }
      log.setCloudUSerInfo('周边搜索', '查询' + that.data.inputValue + '的相关信息');
    }, that)
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    that.setData({
      isLoad: true
    })
    search.getsearch(this.data.inputValue, that.data.page + 1, function(res) {
      if (res.pois) {
        var list = []
        res.pois.forEach(function(val) {
          if (val.photos.length > 0) {
            var photoList = []
            val.photos.forEach(function(v) {
              photoList.push(v.url)
            })
            val.photoString = photoList
            val.photoStr = val.photos[0].url
          } else {
            val.photoString = []
            val.photoStr = null
          }
          val.save = "+ 收藏";
          list.push(val)
        })
        list.forEach(function(val) {
          that.data.searchDatas.push(val)
        })
        that.setData({
          searchDatas: that.data.searchDatas,
          page: that.data.page + 1
        })
      } else {
        wx.showToast({
          title: '未找到数据！',
          icon: 'none',
          duration: 2000
        })
      }
    }, this)
  },
  onSave(event) {
    var list = event.currentTarget.dataset.list
    var index = event.currentTarget.dataset.index
    if (list.save != "已收藏") {
      if (getApp().globalData.openid) {
        list.save = "已收藏"
        this.data.searchDatas[index] = list
        this.setData({
          searchDatas: this.data.searchDatas
        })
        search.save(this, list.id, list)
        log.setCloudUSerInfo('周边搜索', '收藏【' + list.name + '】');
      } else {
        search.message(this, 2, '收藏失败')
      }
    }
  },
  onLockImage: function(event) {
    var imgUrl = event.currentTarget.dataset.images; //获取data-list
    wx.previewImage({
      current: imgUrl[0], // 当前显示图片的http链接
      urls: imgUrl // 需要预览的图片http链接列表
    })
  }
})