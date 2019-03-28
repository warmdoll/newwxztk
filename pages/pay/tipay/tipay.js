var app = new getApp(),
    feedbackApi = require('../../template/showToast/showToast');//引入消息提醒暴露的接口 
import utils from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: app.globalData.buyTi,
    typename:'',
    oldPrice: 0,
    currentPrice: 0,
    checkedbuy:false,//是否合并购买
    checkedagreement: true,//是否同意协议
    monthNum:2,//默认选择2个月
    isByother:0,//默认没有购买合并商品
    protocolTitle: '',
    protocolUrl: '',
    frompagezjk:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var dataObj = app.globalData.buyTi,
        currentPrice = 0, oldPrice = 0;
    console.log(options)
    if (options.frompage && options.frompage=="zjk"){
      this.setData({
        frompagezjk:true
      })
    }
        this.setData(options)
    dataObj.Discount.MonthDiscountList.forEach(function(v,i){
      v.status = false;
      if (dataObj.Discount.MonthDiscountList.length>1){
        if(i==1){
          v.status = true;
          currentPrice = (dataObj.CurrentPrice * v.TotalMonth * v.Discount * 0.1).toFixed(2);
          oldPrice = (dataObj.Price * v.TotalMonth ).toFixed(2);
        }
      }else{
        v.status = true;
        currentPrice = (dataObj.CurrentPrice * v.TotalMonth * v.Discount * 0.1).toFixed(2);
        oldPrice = (dataObj.Price * v.TotalMonth ).toFixed(2);
      }
    })
    this.setData({
      dataArr: dataObj,
      typename: app.globalData.subjectName+ " " +options.typename,
      oldPrice: oldPrice,
      currentPrice: currentPrice
    })
  },
  // 选择购买月份
  selectedMonth:function(e){
    var that=this,
        datasetObj = e.currentTarget.dataset,
        monthNum = datasetObj.monthcount,
        disCount = datasetObj.discount,
        currdataArr=that.data.dataArr,
        currentPrice=0,oldPrice=0;
    currdataArr.Discount.MonthDiscountList.forEach(function(v,i){
      v.status=false;
      if (v.TotalMonth == monthNum){
        v.status = !v.status;
        if (that.data.checkedbuy) {
          oldPrice = (currdataArr.OriginPrice * v.TotalMonth ).toFixed(2);
          currentPrice= (currdataArr.OtherAllPrice * v.TotalMonth * v.Discount * 0.1).toFixed(2);
          currentPrice = that.data.frompagezjk ? currentPrice * 0.5 : currentPrice;
        }else{
          currentPrice = (currdataArr.CurrentPrice * v.TotalMonth * v.Discount * 0.1).toFixed(2);
          oldPrice = (currdataArr.Price * v.TotalMonth).toFixed(2);
        }
       
      }
    })
    that.setData({
      dataArr:currdataArr,
      oldPrice: oldPrice,
      currentPrice: currentPrice,
      monthNum: monthNum
    })

  },
  // 同时购买高频易错
  checkbuyboxChange:function(){
    var currentPrice = 0, oldPrice=0,
      currdataArr = this.data.dataArr,that=this,
      isByother=0;
    this.setData({
      checkedbuy: !this.data.checkedbuy
    })
    if (this.data.checkedbuy) {
      // 点击高频数据合并购买
      currdataArr.Discount.MonthDiscountList.forEach(function (v, i) {
        if (v.status) {
          oldPrice = (currdataArr.OriginPrice * v.TotalMonth).toFixed(2);
          currentPrice= (currdataArr.OtherAllPrice * v.TotalMonth * v.Discount * 0.1).toFixed(2);
          currentPrice = that.data.frompagezjk ? currentPrice * 0.5 : currentPrice;
        }
      })
      isByother=1;
    }else{
      // 取消合并购买
      isByother=0;
      currdataArr.Discount.MonthDiscountList.forEach(function (v, i) {
        if (v.status) {
          currentPrice = (currdataArr.CurrentPrice * v.TotalMonth * v.Discount * 0.1).toFixed(2);
          oldPrice = (currdataArr.Price * v.TotalMonth ).toFixed(2);
        }
      })
    }
    this.setData({
      oldPrice: oldPrice,
      currentPrice: currentPrice,
      isByother: isByother
    })
  },

  // 点击协议
  agreementChange: function () {
    this.setData({
      checkedagreement: !this.data.checkedagreement
    })
   
  },
  toProtocalDetail:function(){
    wx.navigateTo({
      url: '../../confirmOrder/protocol/protocol?url=' + encodeURIComponent(this.data.protocolUrl)
    })
  },
  // 下单
  getbuydeal:function(){
    var that = this,
      requestUrl = app.globalData.requestUrlobj.tikuapi,
      mvcUrl = app.globalData.requestUrlobj.apimvc,
      tiurl = requestUrl + "/api/TestPaper/BuyDeal",
      zjkUrl = mvcUrl+"/ZhangJieKeService/GetOrder",
      buyObj = {
        Data: {
          Id: that.data.subjectid,
          ProductsType: that.data.productstype,
          username: app.globalData.userInfo.Username || "",
          BuyMonthCount: that.data.monthNum,
          IsByOther: that.data.isByother,
          OrderFromType: app.globalData.OrderFromType,
          TagID: 1,
        }
      },
      buyZJKObj={
        username: app.globalData.userInfo.Username||"",
        buyMonthCount: that.data.monthNum,
        IsBuyAllPack: that.data.isByother,
        subjectId: app.globalData.subjectId,
        ClassHoursId: that.data.id,
        OrderFromType:app.globalData.OrderFromType,
        AppSysClassID: app.globalData.exameId,
        AppSign: app.globalData.signName
      },
    
      requestObj = {
        url: that.data.frompage ? zjkUrl:tiurl ,
        method: 'post',
        dataobj: that.data.frompage ? buyZJKObj : buyObj,
        callback1: that.gotopaycallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  gotopaycallback:function(res){
    console.log(res)
    if (res.data.ResultCode==0){
      // wx.requestPayment({
      //   'timeStamp': '',
      //   'nonceStr': '',
      //   'package': '',
      //   'signType': 'MD5',
      //   'paySign': '',
      //   'success': function (res) {
      //   },
      //   'fail': function (res) {
      //   }
      // })
      //跳转到支付页面 订单号和价格
      var orderObj=res.data.Data;
      wx.navigateTo({
        url: '../../payment/payment?orderId=' + orderObj.OrderNumber + "&NeedMoney=" + orderObj.NeedMoney + "&Hasmoney=" + orderObj.Hasmoney,
      })
      }
  },
  // 确认支付
  gotoPay:function(){
    var that=this;
    if (!that.data.checkedagreement){
      // 提示框
      wx.showModal({
        title: '提示',
        content: '请先阅读并同意协议',
        showCancel: false
      })
      return;
      //feedbackApi.showToast({ title: "请阅读中大网校协议" })//调用  
    }else{
        if (app.globalData.userInfo && app.globalData.userInfo.Username) {
          that.getbuydeal();
        } else {
          that.checkUserLogin(function () {
            wx.navigateTo({
              url: '../../payment/payment?orderId=' + orderObj.OrderNumber + "&NeedMoney=" + orderObj.NeedMoney + "&Hasmoney=" + orderObj.Hasmoney,
            })
          });
        }
      }
      
 
  },
  checkUserLogin: function (cb) {
    app.upDataUserInfo(() => {
      typeof cb == "function" && cb()
    }, (resData) => {
      app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs();
      wx.navigateTo({
        url: `../../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
      })
    });
  },
  // 众筹支付
  crowdfundingPay:function(){
    var that=this;
    if (!that.data.checkedagreement) {
      // 提示框
      wx.showModal({
        title: '提示',
        content: '请先阅读并同意协议',
        showCancel: false
      })
      //feedbackApi.showToast({ title: "请阅读中大网校协议" })//调用  
    } else {
      that.getbuydeal()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      protocolTitle: app.globalData.protocolData.title,
      protocolUrl: app.globalData.protocolData.url
    })
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