// pages/crowdfundingPayment/crowdfundingPayment.js
var app = getApp();
var WxParse = require('../outerFile/wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ExpireTime: [],
    index: 0,
    isAgreement: true,
    inputName: '',
    passMessage: '',
    isCreated:false,
    showGuide:false,
    protocolTitle: '',
    protocolUrl: ''
  },
  toProtocalDetail: function () {
    wx.navigateTo({
      url: '../confirmOrder/protocol/protocol?url=' + encodeURIComponent(this.data.protocolUrl)
    })
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  checkboxChange(e) {
    let isAgreement = e.detail.value[0] ? true : false;
    this.setData({
      isAgreement: isAgreement
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData(options)
    this.setData({
      protocolTitle: app.globalData.protocolData.title,
      protocolUrl: app.globalData.protocolData.url
    })
    //console.log(this.data);
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/Crowdfunding/GetCreateCFProjectInfo`,
      method: 'post',
      dataobj: {

      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      if (res.data.ResultCode == 0) {
        that.setData(res.data.Data);
        let remark = res.data.Data.Remark;
        WxParse.wxParse('remark', 'html', remark, that, 0);
      }
      app.globalData.hideMyLoading();
      // that.getSetmealListCallback1(res);
    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  bindInputName: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  bindPassMessage: function (e) {
    this.setData({
      passMessage: e.detail.value
    })
  },
  hideGuide:function(){
    this.setData({
      showGuide: false
    })
  },
  createCrowdfunding: function () {
    // console.dir(this.data)
    // return;
    if (!this.data.isAgreement) {
      wx.showModal({
        title: '提示',
        content: '请先阅读并同意协议',
        showCancel: false
      })
      return;
    }
    // if (!this.data.inputName) {
    //   wx.showModal({
    //     content: '请输入您的名称！',
    //     showCancel : false
    //   })
    //   return;
    // }
    if (!this.data.isAgreement) {
      wx.showModal({
        content: '请阅读并同意中大网校服务协议！',
        showCancel: false
      })
      return;
    }
    if (this.data.isCreated){
      this.setData({
        showGuide:true
      })
      return;
    }
    //创建众筹代码逻辑
    let that = this;
    //console.log(this.data);
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/Crowdfunding/CreateCFProject`,
      //url: 'https://apimvc2.wangxiao.cn/api/Crowdfunding/CreateCFProject',
      method: 'post',
      dataobj: {
        "OrderNumber": that.data.orderId,
        "ProjectType": 1,
        "Explain": that.data.passMessage || that.data.Explain,
        "ExpireTime": that.data.ExpireTime[that.data.index].Key,
        "UserRealName": that.data.inputName,
        "key": "sample string 4",
        "SysClassId": app.globalData.SysClassID,
        "username": app.globalData.userInfo.Username
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      if (res.data.ResultCode == 0) {
        wx.showShareMenu();
        that.setData({
          ProjectId: res.data.Data.ProjectId,
          isCreated:true
        })
        that.setData({
          showGuide: true
        })
        // wx.showShareMenu({
        //   withShareTicket: true
        // })
        // wx.navigateTo({
        //   url: '../crowdfundingInfo/crowdfundingInfo?projectId=' + res.data.Data.ProjectId
        // })
        // console.log(res.data)
        // let ProjectId = res.data.ProjectId;
        //wap站地址http://wap2.wangxiao.cn/weixin/wap/cfsupport?o'+that.data.ProductsId'&fromwchat=0
        // wx.showShareMenu({
        //   withShareTicket: false
        // })
      }else{
        wx.showModal({
          content: res.data.Message,
          showCancel: false
        })
      }
      app.globalData.hideMyLoading();
      // that.getSetmealListCallback1(res);
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
    this.setData({
      showGuide:false
    });
    //console.log('调用了')
    let that = this;
    let path = "pages/crowdfundingInfo/crowdfundingInfo?projectId=" + that.data.ProjectId;
    let shareData = app.getShareData(4, 1);
    return {
      title: shareData.Title,
      path: path,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
        // 转发成功
        wx.redirectTo({
          url: '../orderDetail/orderDetail?orderId=' + that.data.orderId
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showModal({
          title: '提示',
          content: '分享失败，可在订单详情页面进行分享。',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../orderDetail/orderDetail?orderId=' + that.data.orderId
              })
            }
          }
        })
      }
    }
  }
})