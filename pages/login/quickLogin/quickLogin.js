var app = new getApp(),
  feedbackApi = require('../../template/showToast/showToast');//引入消息提醒暴露的接口 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    information: "",
    imgCode: `https://api.wangxiao.cn/app/Validate.ashx?validatekey=23f9a687-c2cb-4381-b740-f2b84ca88c65`,
    phoneMessage: "获取短信验证码",
    phoneCode: {
      isshow: false,
      title: "验证码已发送，可能会有延后请耐心等待"
    },
    phoneValue: '',
    valiDateCode: '',
    checkCode: '',
    canGetPhoneCode: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);
    this.setData({
      imgCode: `https://api.wangxiao.cn/app/Validate.ashx?validatekey=${options.validatekey}`
    })
    var that = this;
    // /that.getCode();
  },
  bindPhoneValue: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  bindValiDateCode: function (e) {
    this.setData({
      valiDateCode: e.detail.value
    })
  },
  bindCheckCode: function (e) {
    this.setData({
      checkCode: e.detail.value
    })
  },
  onLogin: function () {
    if (!this.userPboneNum()) {
      return;
    }
    if (!this.data.checkCode.length) {
      this.testToast("请输入短信验证码");
      return;
    }
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.wap}/weixin/xcx/XcxLogin`,
      method: 'post',
      dataobj: {
        "mobile": that.data.phoneValue,
        "code": that.data.checkCode
      }
    };
    app.globalData.myLoading('正在登录...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      //console.log(res.data.Data);
      if (res.data.ResultCode == 0) {
        app.globalData.userInfo = res.data.Data.userInfo;
        if (app.globalData.callbackPageUrl){
          if (app.globalData.callbackPageUrl == 'pages/my/my' || app.globalData.callbackPageUrl == 'pages/study/study'){
            wx.switchTab({
              url: `../../../${app.globalData.callbackPageUrl}`,
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }else{
            wx.redirectTo({
              url: `../../../${app.globalData.callbackPageUrl}`,
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }
          
        }
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.Message,
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
  setCodeCallback: function (res) {
    var resData = res.data;
    if (resData.ResultCode == 0) {
      // 改变全局的openid
      wx.setStorage({
        key: "openid",
        data: resData.Data.OpenId
      })
    }
  },
  // 输入手机号
  userPboneNum: function (e) {
    if (!(/^1\d{10}$/).test(this.data.phoneValue)) {
      this.testToast("手机号格式错误");
      return false;
    }
    return true;
  },
  // 获取图形验证码
  getimageCode: function () {
    var that = this, imgCode = that.data.imgCode;
    that.setData({
      imgCode: imgCode.replace(/&v=.*/g, "") + "&v=" + Math.random()
    })
  },
  // 验证短信验证码
  getphoneCode: function () {
    if (this.data.canGetPhoneCode) {
      var that = this;
      that.setTime();
    }
  },
  //获取手机号验证码
  gotopassLogin: function () {
    wx.redirectTo({
      url: `../passLogin/passLogin?IsShowValidatecode=${this.data.IsShowValidatecode}&validatekey=${this.data.validatekey}`
    })
  },
  // 提示框
  testToast: function (titletext) {
    feedbackApi.showToast({ title: titletext })//调用  
  },
  //倒计时
  setTime: function () {
    if (!this.data.canGetPhoneCode) {
      return;
    }
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.wap}/weixin/xcx/XcxSendCode`,
      method: 'post',
      dataobj: {
        "mobile": that.data.phoneValue,
        "validatekey": that.data.validatekey,
        "validatecode": that.data.valiDateCode
      }
    };
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取手机验证码
      //console.log(res)
      if (res.data.ResultCode == 0) {
        that.setData({
          canGetPhoneCode: false
        })
        let timer = 60;
        let interval = setInterval(() => {
          if (timer <= 0) {
            clearInterval(interval);
            interval = null;
            that.setData({
              phoneMessage: "重新获取验证码",
              phoneCode: {
                isshow: false,
                title: ""
              },
              canGetPhoneCode: true
            })
          } else {
            timer--;
            that.setData({
              phoneMessage: timer + "s后重新获取",
              phoneCode: {
                isshow: true,
                title: "验证码已发送，可能会有延后请耐心等待"
              }
            })
          }
        }, 1000)
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.Message,
          showCancel: false
        })
        that.getimageCode();
      }
    }).catch((errMsg) => {
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