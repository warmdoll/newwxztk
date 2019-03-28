// pages/orderDetail/orderDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatStatusToCNFromOrdinaryType: ['待付款', '已付款', '已取消'],
    formatStatusToCNFromCrowdfundingType: ['已取消', '众筹中', '已完成', '已终止']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData(options)
    if (options.NeedMoney) {
      wx.navigateTo({
        url: '../payment/payment?orderId=' + options.orderId + '&NeedMoney=' + options.NeedMoney +'&isBack=true'
      })
      return;
    }
    
  },
  toEvaluate(e){
    let productsid = e.currentTarget.dataset.productsid;
    wx.navigateTo({
      url: '../evaluate/evaluate?ProductsId=' + productsid
    })
  },
  initData:function(){
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
      //console.log(res.data.Data);
      if (res.data.ResultCode == 0) {
        that.setData({ orderInfo: res.data.Data});
      }
      //console.dir(that.data.orderList);
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  goPaymentPage: function (e) {
    wx.navigateTo({
      url: '../payment/payment?orderId=' + this.data.orderId + '&NeedMoney=' + this.data.orderInfo.ProductsPrice + '&isBack=true'
    })
  },
  cancelOrder: function (e) {
    let that = this;
    let requestObj = {
      //url: `https://api2.wangxiao.cn/app/order.ashx?username=${app.globalData.userInfo.Username}&ordernum=${this.data.orderId}&t=cannel&Flag=0`,
      url: `${app.globalData.requestUrlobj.api}/app/order.ashx?username=${app.globalData.userInfo.Username}&ordernum=${this.data.orderId}&t=cannel&Flag=0`,
      method: 'post',
      dataobj: {
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.State == 1) {
        that.initData();
      }
      //console.dir(that.data.orderList);
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  payForAnother: function (e) {
    //console.log("找人代付");
    wx.navigateTo({
      url: '../crowdfundingPayment/crowdfundingPayment?orderId=' + this.data.orderId
    })
  },
  recoveryOrder: function (e) {
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.api}/app/order.ashx?username=${app.globalData.userInfo.Username}&ordernum=${this.data.orderId}&t=cannel&Flag=1`,
      method: 'post',
      dataobj: {
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.State == 1) {
        that.initData();
      }
      //console.dir(that.data.orderList);
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  crowdfundingOrder: function (e) {
    //console.log("找人众筹");
    wx.navigateTo({
      url: '../crowdfundingPayment/crowdfundingPayment?orderId=' + this.data.orderId
    })
  },
  payTheBalance: function (e) {
    //console.log("补交余款");
    wx.navigateTo({
      url: '../payment/payment?orderId=' + this.data.orderId + '&NeedMoney=' + this.data.orderInfo.ProductsPrice + '&isBack=true'
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
    this.initData();
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
    let that = this;
    let path = "pages/crowdfundingInfo/crowdfundingInfo?projectId=" + this.data.orderInfo.ProjectId;
    let shareData = app.getShareData(4, 1);
    return {
      title: shareData.Title,
      path: path,
      imageUrl: shareData.ImageUrl,
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  }
})