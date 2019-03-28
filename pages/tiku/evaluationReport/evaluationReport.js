var app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    tiNumber: [],
    rightRate:0,
    tiTypeArr: [
      { type: 1, QuestionType: "正确题", tiArr: [], className:"right-ti" },
      { type: 2, QuestionType: "错误题", tiArr: [], className: "erro-ti" },
      { type: 3, QuestionType: "未做题", tiArr: [], className: "no-do" },
      { type: 4, QuestionType: "未知", tiArr: [], className: "wei-zhi" },
    ],
    exametitle:"",
    optionsObj:{},
    srcUrl:"",
    isPaperExameStatus:false,
    totalScore:""//模拟试题的总分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that=this;
    that.setData({
      tiNumber: app.globalData.tiObj,
      exametitle:app.globalData.exametitle,
      optionsObj:options,
      isPaperExameStatus: app.globalData.isPaperExameStatus,
      totalScore: app.globalData.examSortCount.toFixed(1)
    })
    that.rightRatabox();
    
  },
  // 答题结果统计
  rightRatabox: function () {
    var that = this, resaultTi = that.data.tiTypeArr,
      totalTinum = app.globalData.tiObj.length;
    // 对题
    resaultTi[0].tiArr = app.globalData.tiObj.filter(function (item) {
      return item.mySelected == item.rightDaan
    })
    // 错题
    resaultTi[1].tiArr = app.globalData.tiObj.filter(function (item) {
      return item.mySelected !== "" && item.mySelected != item.rightDaan
    })
   //未答
    // 错题
    resaultTi[2].tiArr = app.globalData.tiObj.filter(function (item) {
      return item.mySelected == ""
    })
    that.setData({
      tiTypeArr: resaultTi
    })
    var rightRate = ((resaultTi[0].tiArr.length / totalTinum)*100).toFixed(2),
      //imgSrc = "http://wap2.wangxiao.cn/ztkxcx/images/";
      imgSrc = `${app.globalData.requestUrlobj.wap}/ztkxcx/images/`;
    that.setData({
      rightRate: rightRate,
      srcUrl: rightRate > 60 ? imgSrc + "kaixin.png" : imgSrc+"kuqi.png"
    })
  },
  // 点击题号跳转
  clickBtn:function(e){
    var appObj = app.globalData,that=this;
    wx.redirectTo({
      url: '../tikupaper/tikupaper?exameid=' + appObj.exameId + "&subjectid=" + appObj.subjectId + "&tinum=" + e.currentTarget.dataset.tinum + "&frompage=paperquestionsdetail&source=" + that.data.optionsObj.source + "&examePattern=" + that.data.optionsObj.examePattern+"&footer=1"
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let shareData = app.getShareData(1,2);
    return {
      title: shareData.Title||"我正在准题库刷题~求监督",
      imageUrl: shareData.ImageUrl,
      path:`${wx.getStorageSync('paperquestiondetailUrl')}&${app.getLocationStorage()}`
    }
  },
  //显示所有解析
  reTest:function(){
    var appObj = app.globalData, that = this;
    wx.redirectTo({
      url: '../tikupaper/tikupaper?exameid=' + appObj.exameId + '&subjectid=' + appObj.subjectId + '&source=' + appObj.source + '&frompage=paperquestionsdetail&tinum=1&examePattern=' + that.data.optionsObj.examePattern,
    })
  },
  // 显示所有解析
  allTiAnalyze:function(){
    var appObj = app.globalData, that = this;
    wx.redirectTo({
      url: '../tikupaper/tikupaper?exameid=' + appObj.exameId + '&subjectid=' + appObj.subjectId + '&source=' + that.data.optionsObj.source + '&frompage=paperquestionsdetail&tinum=1&allanalyze=1&examePattern=' + that.data.optionsObj.examePattern,
     
    })
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
})
