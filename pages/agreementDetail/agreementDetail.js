// pages/agreementDetail/agreementDetail.js
var WxParse = require('../outerFile/wxParse/wxParse.js');
var app = getApp();
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsSignProtocol:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData(options);
    this.initData();
  },
  initData:function(){
    let that = this;
    let dataobj = {
      "id": that.data.id,
      "username": app.globalData.userInfo.Username
    }

    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/Protocol/GetProtocol`,
      method: 'post',
      dataobj: dataobj
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.ResultCode == 0) {
        let article = res.data.Data.ProtocolContent;
        WxParse.wxParse('article', 'html', article, that, 0);
        that.setData({
          IsSignProtocol: res.data.Data.IsSignProtocol
        })
      }
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  signProtocol:function(){
    wx.navigateTo({
      url: `../signagreement/signagreement?id=${this.data.id}&isAll=0`
    })
    // let that = this;
    // let dataobj = {
    //   "id": that.data.id,
    //   "username": app.globalData.userInfo.Username || 'ceshi_3'
    // }

    // let requestObj = {
    //   url: `${app.globalData.requestUrlobj.apimvc}/api/Protocol/GetProtocol`,
    //   method: 'post',
    //   dataobj: dataobj
    // };
    // app.globalData.myLoading('努力加载中...');
    // app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
    //   if (res.data.ResultCode == 0) {
    //     let article = res.data.Data.ProtocolContent;
    //     WxParse.wxParse('article', 'html', article, that, 0);
    //     that.setData({
    //       IsSignProtocol: res.data.Data.IsSignProtocol
    //     })
    //   }
    //   app.globalData.hideMyLoading();

    // }).catch((errMsg) => {
    //   app.globalData.hideMyLoading();
    //   console.log(errMsg);//错误提示信息
    // });
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