var app = new getApp(),
  feedbackApi = require('../../template/showToast/showToast');//引入消息提醒暴露的接口 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id_token: '',//方便存在本地的locakStorage  
    response: '', //存取返回数据 
    phoneValue:'',
    password:'',
    valiDateCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
    // this.setData({
    //   imgCode: `https://api.wangxiao.cn/app/Validate.ashx?validatekey=${options.validatekey}`
    // })
    //that.getCode();
  },
  bindPhoneValue: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  bindPassWordValue: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  passwordLogin:function(){
    let that = this;
    if (that.data.phoneValue.length == 0) {
      that.testToast("请输入用户名或手机号");
      return;
    }
    if (that.data.password.length == 0) {
      that.testToast("请输入密码");
      return;
    }
    // if (!that.data.valiDateCode.length) {
    //   that.testToast("请输入验证码");
    //   return;
    // }
    let requestObj = {
      url: `${app.globalData.requestUrlobj.wap}/weixin/Xcx/XcxLoginByUP`,
      method: 'post',
      dataobj: {
        "username": that.data.phoneValue,
        "password": that.data.password
      }
    };
    app.globalData.myLoading('正在登录...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      //console.log(res.data.Data);
      if (res.data.ResultCode == 0) {
        app.globalData.userInfo = res.data.Data.userInfo;
        //that.setData({ orderInfo: res.data.Data.userInfo });
        if (app.globalData.callbackPageUrl) {
          if (app.globalData.callbackPageUrl == 'pages/my/my' || app.globalData.callbackPageUrl =='pages/study/study') {
            wx.switchTab({
              url: `../../../${app.globalData.callbackPageUrl}`,
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          } 
          // else if (app.globalData.callbackPageUrl == 'pages/live/live'){
          //   wx.switchTab({
          //     url: `../../../${app.globalData.callbackPageUrl}`,
          //     success: function (e) {
          //       var page = getCurrentPages().pop();
          //       if (page == undefined || page == null) return;
          //       page.onLoad();
          //     }
          //   })
          // }
           else {
            wx.redirectTo({
              url: `../../../${app.globalData.callbackPageUrl}`,
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              },
              fail: function (e) {
                console.log(e);
              }
            })
          }
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
  },
  getimageCode: function () {
    var that = this, imgCode = that.data.imgCode;
    that.setData({
      imgCode: imgCode.replace(/&v=.*/g, "") + "&v=" + Math.random()
    })
  },
  // 登录相关--获取code---code发送给服务器
  getCode: function () {
    var that=this; 
    // 通过wx.login获取code,
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求--code传递给后台
          var requestObj = {
            url: `${app.globalData.requestUrlobj.wap}/weixin/wap/Jscode2session`,
            //url: "https://wap2.wangxiao.cn/weixin/wap/Jscode2session",
            method: 'post',
            dataobj: {
              js_code: res.code
            },
            callback1: that.setCodeCallback,
            callback2: ""
          };
          app.globalData.wxRequestfn(requestObj);

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  setCodeCallback:function(res){
    var resData = res.data;
    if (resData.ResultCode==0){
      // 改变全局的openid
      app.globalData.openid=resData.Data.OpenId
    }
    
  },
  quickLogin:function(){
    wx.redirectTo({
      url: `../quickLogin/quickLogin?IsShowValidatecode=${this.data.IsShowValidatecode}&validatekey=${this.data.validatekey}`
    })
  },
  // 验证手机号
  userPboneNum: function (e) {
    if (this.data.phoneValue.length == 0) {
      this.testToast("请输入用户名或手机号");
      return false;
    }
    return true;
  },
  // 验证密码登录
  userPasswordNum:function(e){
    var that = this, passWord = e.detail.value;
  },
  // 提示框
  testToast: function (titletext) {
    feedbackApi.showToast({ title: titletext })//调用  
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