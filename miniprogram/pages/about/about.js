Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    isLoad: false
  },
  attached() {
    console.log("success")
    let that = this;
    // wx.showLoading({
    //   title: '数据加载中',
    //   mask: true,
    // })
    that.setData({
      isLoad: true
    })
    numDH();

    function numDH() {
      wx.cloud.callFunction({
        name: 'getcount',
        success: res => {
          if(res.result){
            that.setData({
              starCount: that.coutNum(res.result[0].total),
              forksCount: that.coutNum(res.result[2].total),
              visitTotal: that.coutNum(res.result[1].total)
            })
          }
        },
        fail() {
          wx.hideLoading()
          that.setData({
            isLoad: false
          })
        },
        complete() {
          wx.hideLoading();
          that.setData({
            isLoad: false
          })
        }
      })
    }
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      if (e > 10000000) {
        e = (e / 10000000).toFixed(1) + 'KW'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    onImage() {
      wx.previewImage({
        urls: ['https://6174-atao-1258210999.tcb.qcloud.la/code.png?sign=b13412674b470b5326a6c18b60201d13&t=1553876373']
      });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    onDoc: function() {
      wx.navigateToMiniProgram({
        appId: 'wx89d275c9d52ff3de',
        path: '/pages/index/index'
      })
    },
  }
})