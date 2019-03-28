// pages/orderList/orderList.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentOrderType: 0, //普通订单，众筹订单
    currentOrdinaryType: 0,//普通订单'全部','待付款','已付款
    currentCrowdfundingType: 0,//众筹订单==全部、众筹中、已完成、已终止
    orderList: [],
    formatOrderType: [1, 2],
    formatOrdinaryType: [-1, 0, 1, 2],
    formatCrowdfundingType: [0, 1, 2, 3],
    formatStatusToCNFromOrdinaryType: ['待付款', '已付款', '已取消'],
    formatStatusToCNFromCrowdfundingType: ['已取消', '众筹中', '已完成', '已终止'],
    projectid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  initData: function () {
    let that = this;
    let dataobj = {
      "OrderType": that.data.formatOrderType[that.data.currentOrderType],//转换orderType值
      "username": app.globalData.userInfo.Username
    }
    if (that.data.currentOrderType == 0 && that.data.currentOrdinaryType != 0) { //如果是普通订单，不是查询全部则传递currentOrdinaryType值
      dataobj.OrderStatus = that.data.formatOrdinaryType[that.data.currentOrdinaryType]
    }
    if (that.data.currentOrderType == 1 && that.data.currentCrowdfundingType != 0) {//如果是众筹订单
      dataobj.FundStatus = that.data.formatCrowdfundingType[that.data.currentCrowdfundingType]
    }
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/STExams/GetOrderList`,
      method: 'post',
      dataobj: dataobj
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.ResultCode == 0) {
        that.setData({ orderList: res.data.Data });
      }
      if (res.data.ResultCode == 9) {
        that.setData({ orderList: [] });
      }
      //console.dir(that.data.orderList);
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      that.setData({ orderList: [] });
      console.log(errMsg);//错误提示信息
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onBottomTabTap: function (e) {
    this.setData({
      currentOrderType: e.currentTarget.dataset.index
    })
    this.initData();
  },
  onOrdinaryTabTap: function (e) {
    this.setData({
      currentOrdinaryType: e.currentTarget.dataset.index
    })
    this.initData();
  },
  onCrowdfundingTabTap: function (e) {
    this.setData({
      currentCrowdfundingType: e.currentTarget.dataset.index
    })
    this.initData();
  },
  goOrderDetailPage: function (e) {
    let orderId = e.currentTarget.dataset.ordernumber;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderId=' + orderId
    })
  },
  toEvaluate:function(e){
    
    let productsid = e.currentTarget.dataset.productsid;
    wx.navigateTo({
      url: '../evaluate/evaluate?ProductsId=' + productsid + "&productsType=" + e.currentTarget.dataset.productstype
    })
  },
  goPaymentPage: function (e) {
    //console.log(e.currentTarget.dataset)
    //如果是苹果需要显示不支持购买
    app.iosBuyShowInfo();
    if (app.globalData.systemInfo.isIOS) return;

    let orderId = e.currentTarget.dataset.ordernumber;
    let productsprice = e.currentTarget.dataset.productsprice;
    wx.navigateTo({
      url: '../payment/payment?orderId=' + orderId + '&NeedMoney=' + productsprice
    })
  },
  cancelOrder: function (e) {
    let orderId = e.currentTarget.dataset.ordernumber;
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.api}/app/order.ashx?username=${app.globalData.userInfo.Username}&ordernum=${orderId}&t=cannel&Flag=0`,
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
    let orderId = e.currentTarget.dataset.ordernumber;
    //console.log("找人代付");
    wx.navigateTo({
      url: '../crowdfundingPayment/crowdfundingPayment?orderId=' + orderId
    })
  },
  recoveryOrder: function (e) {
    let orderId = e.currentTarget.dataset.ordernumber;
    let that = this;
    let requestObj = {
      
      url: `${app.globalData.requestUrlobj.api}/app/order.ashx?username=${app.globalData.userInfo.Username}&ordernum=${orderId}&t=cannel&Flag=1`,
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
    // console.log(e)
    // this.setData({
    //   projectid: e.currentTarget.dataset.projectid
    // })
    //console.log("找人众筹");
    // wx.navigateTo({
    //   url: '../crowdfundingPayment/crowdfundingPayment?orderId=' + orderId
    // })
  },
  payTheBalance: function (e) {
    //如果是苹果需要显示不支持购买
    app.iosBuyShowInfo();
    if (app.globalData.systemInfo.isIOS) return;
    let orderId = e.currentTarget.dataset.ordernumber;
    let productsprice = e.currentTarget.dataset.productsprice;
    wx.navigateTo({
      url: '../payment/payment?orderId=' + orderId + '&NeedMoney=' + productsprice
    })
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
  onShareAppMessage: function (e) {
    let that = this;
    let path = "pages/crowdfundingInfo/crowdfundingInfo?projectId=" + e.target.dataset.projectid;
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