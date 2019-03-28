var app=new getApp();
var downAppApi = require('../template/downAppTips/downAppTips');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applicationArr:[],
    mobileModel: '',
    shoptype:'',
    downappUrl:'',
    downAppObj: {
      downAppShowToast: false,
      appName: "",
      logoImg: ""
    },
  },
  closedownAppWindow: function () {
    var that = this;
    that.setData({
      downAppShowToast: false,

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, mobiletype;
    this.appConfig();
  },

  //获取应用列表
  appConfig: function () {
    var that = this,
      requestObj = {
        url: 'https://appconfig.wangxiao.cn/service/GetCommendApplication?DeviceType=0&ClassID=99999999-9999-9999-9999-999999999999',
        method: 'get',
        dataobj: {},
        callback1: that.getappConfig,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  getappConfig: function (res) {
    var that = this, appliCation;
    if (res.data.ResultCode == 0) {
      appliCation = res.data.Data;
      that.setData({
        applicationArr: appliCation
      })
    }
  },
  //判断安卓和苹果】
  judgemobiletype:function() {
    //判断手机类型 安卓 苹果
    var mobiletype,shoptype;
    wx.getSystemInfo({
      success: function (res) {
        mobiletype = res.model.toLocaleLowerCase();
        if (mobiletype.indexOf("iphone") !== -1) {
          //是苹果手机
            shoptype=1
        } else {
          //安卓手机
            shoptype=0
        }
        
      }
    });
    return shoptype;
  },
  //引导下载app
  downApp:function(e,num){
    var that = this,
      sign = e.currentTarget.dataset.sign;
      var that = this, downAppObj = {
        downAppShowToast: true,
        appSign: sign
      }
      downAppApi.showDownAppTips(downAppObj)

     var  requestObj = {
        url: 'https://appconfig.wangxiao.cn/Service/GetAdviertisement?sign=' + sign + '&DeviceType=' + that.judgemobiletype(),
        method: 'get',
        dataobj: {},
        callback1: that.downAppfn,
        callback2: ""
      };
      app.globalData.wxRequestfn(requestObj);
  },
  downAppfn:function(res){
    var that=this;
    if (res.data.ResultCode==0){
      that.setData({
        downappUrl:res.data.Data.AppUrl
      })
    
    }
  }
})