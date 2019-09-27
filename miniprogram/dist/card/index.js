Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['l-class', 'l-img-class', 'l-title-class'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    images: {
      type: String,
      value: ''
    },
    image: String,
    title: String,
    describe: String,
    plaintext: Boolean,
    full: Boolean,
    position: {
      type: String,
      value: 'left'
    },
    type: {
      type: String,
      value: 'primary'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLockImage: function(event) {
      var imgUrl = event.currentTarget.dataset.images; //获取data-list
      if (imgUrl!='') {
        var imgList = imgUrl.split(',')
        wx.previewImage({
          current: imgList[0], // 当前显示图片的http链接
          urls: imgList // 需要预览的图片http链接列表
        })
      }
    },
  }
})