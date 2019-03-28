// pages/payment/payment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  confirmPay:function(){
    console.log(typeof parseFloat(this.data.NeedMoney));
    console.log(typeof this.data.Hasmoney);
    if (parseFloat(this.data.Hasmoney) >= parseFloat(this.data.NeedMoney)){ //如果学币够支付
      let that = this;
      let requestObj = {
        url: `${app.globalData.requestUrlobj.api}/app/user.ashx?t=open&username=${app.globalData.userInfo.Username}&ordernumber=${that.data.orderId}`,
        method: 'post',
        dataobj: {
        }
      };
      app.globalData.myLoading('努力加载中...');
      app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
        if (res.data.State == 1) {
          if (that.data.isBack) {
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: '../orderDetail/orderDetail?orderId=' + that.data.orderId
            })
          }
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
      return;
    }
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.wap}/weixin/Xcx/GetPrepay_id`,
      method: 'post',
      dataobj: {
        ordernumber: that.data.orderId
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.ResultCode == 0) {
        let payData = res.data.Data;
        app.interfacePay(payData.timeStamp, payData.nonceStr, payData.package, payData.signType, payData.paySign, (res)=>{
          if (that.data.isBack){
            wx.navigateBack();
          }else{
            wx.redirectTo({
              url: '../orderDetail/orderDetail?orderId=' + that.data.orderId
            })
          }
          
        }, (res)=>{
          if (that.data.isBack) {
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: '../orderDetail/orderDetail?orderId=' + that.data.orderId
            })
          }
        })
      } else if (res.data.ResultCode == 2){
        if (that.data.isBack) {
          wx.navigateBack();
        } else {
          wx.redirectTo({
            url: '../orderDetail/orderDetail?orderId=' + that.data.orderId
          })
        }
      }else{
        wx.showModal({
          title: '提示',
          content: res.Message,
          showCancel:false
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
    this.setData(options);
    this.checkIsPay()
    
  },
  checkIsPay:function(){
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/STExams/GetOrderInfo`,
      method: 'post',
      dataobj: {
        OrderNumber: that.data.orderId,
        "SysClassId": app.globalData.SysClassID,
        "username": app.globalData.userInfo.Username
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.ResultCode == 0) {
        let resData = res.data.Data;
        //that.setData({ orderInfo: res.data.Data });
        if (resData.OrderStatus != 0 && resData.OrderType == 1){
          wx.switchTab({
            url: "pages/my/my",
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }else{
          that.initData();
        }
      }
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  initData:function(){
    let that = this;
    app.getUserInfo(()=>{
      that.setData({
        Hasmoney: app.globalData.userInfo.Balance
      })
    });
    
  },
  toCrowdfunding: function () {
    wx.navigateTo({
      url: '../crowdfundingPayment/crowdfundingPayment?orderId=' + this.data.orderId + '&NeedMoney=' + this.data.NeedMoney + '&Hasmoney=' + this.data.Hasmoney
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