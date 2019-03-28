// pages/exclusiveTeacher/exclusiveTeacher.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData(options);
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/User/GetUserTeacher`,
      //url: 'https://apimvc2.wangxiao.cn/api/User/GetUserTeacher',
      method: 'post',
      dataobj: {
        "ExamID": app.globalData.exameId,
        "SubjectID": app.globalData.subjectId,
        "username": app.globalData.userInfo.Username
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      console.log(res);
      if (res.data.ResultCode == 0) {
        that.setData({ ...res.data.Data });
      }
      // that.getSetmealListCallback1(res);
      app.globalData.hideMyLoading();
    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
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
  
  }
})