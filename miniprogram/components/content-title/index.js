// components/cotent-title/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String
    },
    describe: {
      type: String
    },
    doc: {
      type: Boolean,
      value: true
    },
    image: {
      type: String,
      value: '/images/express.png'
    },
    index: {
      type: String,
      value: 0
    },
    styles:{
      type: String,
      value: '1'
    },
    city:{
      type:String,
      value:'武汉'
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
    onDoc() {
      if (this.properties.index == 0) {
        wx.navigateToMiniProgram({
          appId: 'wx89d275c9d52ff3de',
          path: '/pages/index/index?title=' + this.properties.name + '&desc=' + this.properties.describe
        })
      }
    }
  }
})