var app = new getApp();
Component({
  behaviors: [],
  /**
   * 组件的属性列表
   */
  properties: {
    tiNumber: {
      type: Array,
      value: []
    }
  },
  /**
  * 组件的初始数据
  */
  data: {
    currentTab: 0,
    swiperHeight: 0,
    lastTidata: [
      { type: 1, QuestionType: "单项选择题", tiArr: [] },
      { type: 2, QuestionType: "多项选择题", tiArr: [] },
      { type: 3, QuestionType: "不定项选择题", tiArr: [] },
      { type: 4, QuestionType: "判断题", tiArr: [] },
    ],
    optionsObj: {}
  },
  /**
  * 组件的方法列表
  */
  methods: {
    // 按题型重新排序
    tiTypeOper: function () {
      var that = this, lastTidata = that.data.lastTidata;
      lastTidata.forEach(function (v, i) {
        v.tiArr = app.globalData.tiObj.filter(function (item) {
          return item.QuestionType == v.type;
        })
        that.setData({
          lastTidata: lastTidata
        })
      });
    },
    // 重新测试
    resetTest: function () {
      wx.navigateTo({
        url: '../tikupaper/tikupaper?exameid=' + app.globalData.exameId + "&subjectid=" + app.globalData.subjectId + "&day=" + app.globalData.tiDay,
      })
    },
    // 交卷
    testResault: function () {
      wx.navigateTo({
        url: '../tikupaper/tikupaper?exameid=' + app.globalData.exameId + "&subjectid=" + app.globalData.subjectId + "&day=" + app.globalData.tiDay,
      })
    },
    /** 
    * 滑动切换tab 
    */
    bindChange: function (e) {
      var that = this;
      that.setData({ currentTab: e.detail.current });
    },
    //获取swiper的高度
    getRectHeight: function (view) {
      var that = this, outerHeight, tabHeight, footerHeight;
      wx.createSelectorQuery().select("#outerHeight").boundingClientRect(function (rect) {
        outerHeight = rect.height;
      }).exec()
      wx.createSelectorQuery().select("#tabHeight").boundingClientRect(function (rect) {
        tabHeight = rect.height;
      }).exec()
      wx.createSelectorQuery().select("#footerHeight").boundingClientRect(function (rect) {
        footerHeight = rect.height;
        that.setData({
          swiperHeight: parseFloat(outerHeight - tabHeight - footerHeight - 40)
        })
      }).exec()
    },
    /** 
     * 点击tab切换 
     */
    swichNav: function (e) {
      var that = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
      }
    },
    //点击跳转到------对应题号
    clickBtn: function (e) {
      var that = this,
        tinum = e.currentTarget.dataset.tinum,
        datasetObj = that.data.optionsObj;
      wx.navigateTo({
        url: '../tikupaper/tikupaper?exameid=' + app.globalData.exameId + "&subjectid=" + app.globalData.subjectId + "&day=" + app.globalData.tiDay+ "&tinum=" + tinum,
      })
    },
    ready: function () {
      var that = this;
      that.tiTypeOper();
      that.getRectHeight();
      that.setData({
        tiNumber: app.globalData.tiObj,
        tiDay: app.globalData.tiDay
      })
      console.log(that.data.tiNumber)
    },

  }
})

    
