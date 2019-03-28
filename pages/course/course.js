var app = new getApp();
import utils from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    advObj:[],
    courseListObj:{},
    optionsObj:{},
    noData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeGlobalData(options);//统一处理扫码及直接进入的参数
    var that=this,
      appObj={
        examId: app.globalData.exameId,
        subjectId: app.globalData.subjectId
      }

    that.setData({
      optionsObj: appObj
    })
    
  },
  //获取头部广告位
  getAdv:function(){
    var that = this, sign = app.globalData.signName;
    var requestObj = {
      url: app.globalData.requestUrlobj.api + "/app/ad.ashx?AdTypeId=20180130165936810&sign=" + sign,
      method: 'get',
      dataobj: {},
      callback1: function (res) {
        var result = res;
        if (result.data.State == 1) {
          that.setData({
            advObj: result.data.Data
          })
        }
      },
      callback2: ""
    };
    app.globalData.wxRequestfn(requestObj);
  },
  // 获取课程列表接口
  getCourseList:function(){
    var that=this,
        requestData={
          SubjectId: that.data.optionsObj.subjectId,//'867b9cbd-93b7-4d97-bb82-102b3358c7a2',
          ExamID: that.data.optionsObj.examId,//'e9fd5aa8-48a8-406d-bfc6-5728a9c6a131',
          username: app.globalData.userInfo.userName||"",
        };
    app.globalData.myLoading();
    var  requestObj = {
        url: app.globalData.requestUrlobj.apimvc + "/api/Course/Index",
        method: 'get',
        dataobj: requestData,
        callback1: function (res) {
          var result = res.data;
          app.globalData.hideMyLoading();
          if (result.ResultCode == 0) {
            if (result.Data.SysClassTaocan.length == 0) {
              that.setData({
                noData: true
              })
            }
            that.setData({
              courseListObj: result.Data
            })
          }
        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);

    
  },
  //点击去课程列表页面
  gotodetailList:function(e){
    var that=this;
    wx.navigateTo({
      url: '../setmeallist/setmeallist?exameid=' + that.data.optionsObj.examId + "&subjectid=" + that.data.optionsObj.subjectId + "&taocantype=" + e.currentTarget.dataset.taocantype,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAdv();
    this.getCourseList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let shareData = app.getShareData(2, 1);
    return {
      title: "快来一起学习" + app.globalData.exameName + "了~",
      path: utils.getCurrentPageUrlWithArgs() + "?" + app.getLocationStorage(),
      imageUrl: shareData.ImageUrl,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  /**
   * 绑定点击事件 跳转相应的页面
   */
  bindtapad:function(event){
    if (event.currentTarget.dataset.url){
      wx.navigateTo({
        url: event.currentTarget.dataset.url
      })
    }
  }
})