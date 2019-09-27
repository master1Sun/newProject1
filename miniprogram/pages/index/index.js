var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
var markersData = [];
var key = config.Config.key;
var myAmapFun = new amapFile.AMapWX({
  key: key
});
const app = getApp();
var log = require('../../util/log.js')
// 在页面中定义插屏广告
let interstitialAd = null
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
    searchDatas: [],
    latitude: '',
    longitude: '',
    textData: {},
    city: '',
    keywords: '',
    TabCur: 0,
    inputValue: '',
    isLoad: false
  },
  //搜索框文本内容显示
  inputBind: function(event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  onDoc() {
    let plugin = requirePlugin("subway");
    let key = '7A2BZ-7TKRP-MLYDD-LNAIJ-T67CS-RXBI7'; //使用在腾讯位置服务申请的key
    let referer = '风与蓝天'; //调用插件的app的名称
    wx.navigateTo({
      url: 'plugin://subway/index?key=' + key + '&referer=' + referer
    });
  },
  query() {
    if (this.data.inputValue && this.data.inputValue != '') {
      this.loadData({
        keywords: this.data.inputValue
      });
    } else {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options && options.keywords) {
      this.setData({
        keywords: options.keywords
      })
    }
    this.loadData(options);
    this.getWeather(); //weather
    log.setCloudUSerInfo('附近信息', '打开小程序，定位获取周边信息');

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-e24520ab0490c05e'
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
  loadData: function(options) {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    that.setData({
      isLoad: true
    })
    var params = {
      success: function(data) {
        markersData = data.markers;
        var poisData = data.poisData;
        var markers_new = [];
        that.setData({
          markersDatas: poisData
        })
        if (markersData.length > 0) {
          that.setData({
            markers: markers_new
          });
          that.setData({
            city: poisData[0].cityname || ''
          });
          that.setData({
            latitude: markersData[0].latitude
          });
          that.setData({
            longitude: markersData[0].longitude
          });
        } else {
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              that.setData({
                latitude: res.latitude
              });
              that.setData({
                longitude: res.longitude
              });
              that.setData({
                city: '北京市'
              });
            },
            fail: function() {
              that.setData({
                latitude: 39.909729
              });
              that.setData({
                longitude: 116.398419
              });
              that.setData({
                city: '北京市'
              });
            }
          })
        }
        that.setData({
          isLoad: false
        })
      },
      fail: function(info) {
        // wx.showModal({title:info.errMsg})
        that.setData({
          isLoad: false
        })
      }
    }
    if (options && options.keywords) {
      params.querykeywords = options.keywords;
      log.setCloudUSerInfo('附近信息', '根据关键字' + options.keywords + '检索');
    }
    myAmapFun.getPoiAround(params)
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
  getWeather: function() {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getWeather({
      success: function(data) {
        // console.log(data)
        if (data) {
          let weatherTitle = data.weather.data + "【" + data.temperature.data + "℃】";
          that.setData({
            noticeTitle: weatherTitle
          });
          log.setCloudUSerInfo('附近信息', "获取[" + data.liveData.city + "]的天气，天气信息是：" + data.weather.text + ": " + data.weather.data + "  " + data.winddirection.text + ": " + data.winddirection.data + "  " + data.windpower.text + ": " + data.windpower.data + "  " + data.temperature.text + ": " + data.temperature.data + "℃  " + data.humidity.text + ": " + data.humidity.data + "");
        }
      },
      fail: function(info) {
        // wx.showModal({title:info.errMsg})
      }
    })
  },
})