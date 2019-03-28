var app=new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectArr:[],
    exameId:"",
    nodata:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      exameId: options.exameid
    })
    //获取科目名称的接口
    app.globalData.myLoading();//加载中动画
    this.getsubjectName(app.globalData.exameId)
  },
  // 获取考试名称的接口
  getsubjectName: function (exameId) {
    var that = this,
      requestObj = {
        url: app.globalData.requestUrlobj.core+'/api/Category/GetSubjects?id='+exameId+'&Level=1',
        method: 'get',
        dataobj: {},
        callback1: that.getSubjectnamecallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);

  },
  getSubjectnamecallback1:function(res){
    var that=this;
    app.globalData.hideMyLoading();
    if (res.data.ResultCode==0){
        that.setData({
        subjectArr: res.data.Data
      })
    }else{
      that.setData({
        nodata:true
      })
    }
   
  },
  //返回选择考试的页面
  backselectedNa:function(){
    wx.redirectTo({
      url: '../selectedexame/selectedexame'
    })
  },
  //点击科目去学习界面
  gotoStudy:function(e){
    var that=this,sunjectId = e.currentTarget.dataset.subjectid;
      app.globalData.subjectName = e.currentTarget.dataset.name;
      app.globalData.subjectId = e.currentTarget.dataset.subjectid;
      wx.setStorageSync('subjectName', e.currentTarget.dataset.name);
      wx.setStorageSync('subjectId', e.currentTarget.dataset.subjectid);
    //跳转到tabBar学习页面
    wx.switchTab({
      url: '../study/study'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this, title;
    title = "快来一起学习" + app.globalData.exameName + "了~";
   
    return {
      title: title,
      path: utils.getCurrentPageUrlWithArgs() + "&" + app.getLocationStorage(),
      imageUrl: "",
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

})