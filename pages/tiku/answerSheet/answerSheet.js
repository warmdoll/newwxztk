var app = new getApp(),
  singleArr = [],//单选
  moreArr = [], //多选
  indefiniteArr = [], //不定项
  judgmentArr = [],//判断题
  fillblankArr = [];//填空题
    
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    swiperHeight:0,
    tiNumber:[],
    lastTidata:[
      { type: 1, QuestionType:"单项选择题",tiArr:[]},
      { type: 2, QuestionType: "多项选择题", tiArr: [] },
      { type: 3, QuestionType: "不定项选择题", tiArr: [] },
      { type: 4, QuestionType: "判断题", tiArr: [] },
    ],
    optionsObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.myLoading();
    wx.hideShareMenu();
   var that=this;
   that.setData({
     optionsObj:options
   })
    that.tiTypeOper();
    that.setData({
      tiNumber: app.globalData.tiObj,
      tiDay: options.day
    })
   if (that.data.tiNumber.length>0){
      app.globalData.hideMyLoading()
   }
    
  },
  // 按题型重新排序
  tiTypeOper:function(){
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
  resetTest:function(){
    var appObj = app.globalData, that = this, optionsObj = that.data.optionsObj;
   
    if (optionsObj.frompage =="highfrequencytiku"){
      var IsEmpty = optionsObj.isempty,//如果已做题大于总题数则为1
        DifficultType = optionsObj.difficulttype,//区别高频考点 高频易错
        DifficultyRate = optionsObj.difficultyrate,//高频考点的考点频率
        DifficultError = optionsObj.difficulterror;//高频易错的考点频率
      wx.redirectTo({
        url: '../tikupaper/tikupaper?exameid=' + appObj.exameid + "&subjectid=" + appObj.subjectid + "&frompage=highfrequencytiku&tinum=1&isempty=" + IsEmpty + "&difficulttype=" + DifficultType + "&difficultyrate=" + DifficultyRate + "&difficulterror=" + DifficultError
      })
    }
    else{
      wx.redirectTo({
        url: '../tikupaper/tikupaper?exameid=' + appObj.exameId + '&subjectid=' + appObj.subjectId + '&frompage=' + that.data.optionsObj.frompage + "&day=" + that.data.optionsObj.day + '&source=' + that.data.optionsObj.source + "&tinum=1&retest=1" + "&examePattern=" + that.data.optionsObj.examePattern
      })
    }
   
     
  },
  // 交卷
  testResault:function(){
    var that=this;
    if (typeof that.data.optionsObj.frompage != "undefined"){
      if (that.data.optionsObj.frompage == "paperquestionsdetail") {
        wx.redirectTo({
          url: '../evaluationReport/evaluationReport?source=' + that.data.optionsObj.source + "&examePattern=" + that.data.optionsObj.examePattern
        })
        return;
      } 
      else {
        var that = this,
          datasetObj = that.data.optionsObj,
          appObj = app.globalData;
        wx.redirectTo({
          url: '../tikupaper/tikupaper?exameid=' + datasetObj.exameid + "&subjectid=" + datasetObj.subjectid + "&day=" + datasetObj.day + "&frompage=" + that.data.optionsObj.frompage + "&frombtn=jiaojuan&tinum=1" + "&examePattern=" + that.data.optionsObj.examePattern
        })
      }
    } 
   
  },
  // 获取当前页面的url
  getCurrentPageUrl:function(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
  },
  /** 
  * 滑动切换tab 
  */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    var swiperNum = parseInt(e.detail.current) + 1,
      currClass = ".swiper-item" + swiperNum;
    wx.createSelectorQuery().select(currClass).boundingClientRect(function (rect) {
      that.setData({
        swiperHeight: parseFloat(rect.height + 60)
      })
    }).exec()
  },
  //获取swiper的高度
  getRectHeight: function (view) {
    var that = this, outerHeight, tabHeight, footerHeight,firstHeight;
    wx.createSelectorQuery().select("#outerHeight").boundingClientRect(function (rect) {
      outerHeight=rect.height;
    }).exec()
    wx.createSelectorQuery().select("#tabHeight").boundingClientRect(function (rect) {
      tabHeight = rect.height;
    }).exec()
    wx.createSelectorQuery().select(".swiper-item1").boundingClientRect(function (rect) {
      firstHeight=rect.height;
    }).exec()
    wx.createSelectorQuery().select("#footerHeight").boundingClientRect(function (rect) {
      footerHeight = rect.height;
      if (firstHeight >(outerHeight - tabHeight - footerHeight - 40)){
        that.setData({
          swiperHeight: parseFloat(firstHeight+40)
        })
      }else{
        that.setData({
          swiperHeight: parseFloat(outerHeight - tabHeight - footerHeight - 40)
        })
      }
      
    }).exec()
   
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    var swiperNum = parseInt(e.currentTarget.dataset.current)+1,
      currClass = ".swiper-item" + swiperNum;
    wx.createSelectorQuery().select(currClass).boundingClientRect(function (rect) {
      that.setData({
        swiperHeight: parseFloat(rect.height+60)
      })
    }).exec()
    if (this.data.currentTab === e.target.dataset.current) {
      return false;

    } else {
      that.setData({
        currentTab: e.target.dataset.current
      }) 
    }
  },
  //点击跳转到------对应题号
  clickBtn:function(e){
    var that=this,
        tinum=e.currentTarget.dataset.tinum,
        optionsObj = that.data.optionsObj,
        appObj = app.globalData;
    if (optionsObj.frompage == "highfrequencytiku") {
      var IsEmpty = optionsObj.isempty,//如果已做题大于总题数则为1
        DifficultType = optionsObj.difficulttype,//区别高频考点 高频易错
        DifficultyRate = optionsObj.difficultyrate,//高频考点的考点频率
        DifficultError = optionsObj.difficulterror;//高频易错的考点频率
      wx.redirectTo({
        url: '../tikupaper/tikupaper?exameid=' + appObj.exameId + '&subjectid=' + appObj.subjectId + '&frompage=highfrequencytiku&tinum=' + tinum+'&isempty=' + IsEmpty + "&difficulttype=" + DifficultType + '&difficultyrate='+ DifficultyRate + '&difficulterror=' + DifficultError + '&frombtn=1&answersheet=1'
      })
    }else{
        wx.redirectTo({
          url: '../tikupaper/tikupaper?exameid=' + appObj.exameId + "&subjectid=" + appObj.subjectId + "&day=" + optionsObj.day + "&tinum=" + tinum + "&frompage=" + optionsObj.frompage + "&frombtn=1&answersheet=1" + "&examePattern=" + optionsObj.examePattern + "&footer=" + that.data.examePattern
        })
     
    }
    
   
    
  }
}) 