// pages/payment/payment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    OpenId:''
  },
  confirmPay: function () {
    if (!this.data.OpenId){
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败！',
        showCancel: false
      })
      return;
    }
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.wap}/weixin/Xcx/GetPrepay_id`,
      method: 'post',
      dataobj: {
        m: parseFloat(that.data.m),
        projectId: that.data.projectId,
        supportopenid: that.data.OpenId
      }
    };
    console.log(requestObj.dataobj);
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.ResultCode == 0) {
        let payData = res.data.Data;
        app.interfacePay(payData.timeStamp, payData.nonceStr, payData.package, payData.signType, payData.paySign, (res) => {
          wx.redirectTo({
            url: payData.successUrl
          })

        }, (res) => {
          wx.navigateBack()
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.Message,
          showCancel: false
        })
      }
      //console.dir(that.data.orderList);
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    console.log(options);
    this.setData(options);
    this.initData();
  },
  initData(){
    let that = this;
    wx.login({
      success: function (res) {
        let requestObj = {
          url: app.globalData.requestUrlobj.wap + "/weixin/xcx/Jscode2session",
          method: 'post',
          dataobj: {
            js_code: res.code
          },
        }
        app.globalData.myLoading('努力加载中...');
        app.globalData.wxRequestPromise(requestObj).then((res) => {
          let resData = res.data.Data;
          //app.globalData.openid = resData.OpenId
          if (res.data.ResultCode == 0) { // 成功获取useInfo保存起来。
            that.setData({
              OpenId: resData.OpenId
            });
          } else {
            app.globalData.hideMyLoading();
            wx.showModal({
              title: '提示',
              content: res.data.Message,
              showCancel: false
            })
          }

        }).catch((errMsg) => {
          app.globalData.hideMyLoading();
          console.log(errMsg);//错误提示信息
        });
        app.globalData.hideMyLoading();
      }
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