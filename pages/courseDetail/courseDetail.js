// pages/courseDetail/courseDetail.js
var WxParse = require('../outerFile/wxParse/wxParse.js');
var WxParse;
var app = getApp();
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    isTrue: false,
    showShare: true,
    sessionFrom: {
      username: app.globalData.userInfo.Username || '',
      openid: app.globalData.userInfo.OpenId || '',
      examid: '',
      subjectid: app.globalData.subjectId || ''
    },
    buttonFlag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // if (options.exameId){
    //   this.setData({
    //     productId: options.productsId
    //   })
    //   app.setGlobalData(options);
    // }
    //console.log(app.globalData);
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData(options);
    //this.initData();
    this.setData({
      item: {
        showModal: false
      }
    });
  },
  initData:function(){
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/XcxApi/ProductsDetail`,
      method: 'post',
      dataobj: {
        "ProductsId": this.data.productId
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      if (res.data.ResultCode == 0) {
        that.setData(res.data.Data);
        //console.log(res.data.Data.BuyType);
        let sessionFrom = {
          username: '',
          openid: '',
          examid: '',
          subjectid: ''
        };
        sessionFrom.username = app.globalData.userInfo.Username || '';
        sessionFrom.openid = app.globalData.userInfo.OpenId || '';
        sessionFrom.examid = that.data.ExamID;
        sessionFrom.subjectid = app.globalData.subjectId || '';
        that.setData({
          sessionFrom: JSON.stringify(sessionFrom)
        })
        if (res.data.Data.ProductsImgs.length <= 1) {
          that.setData({
            autoplay: false,
            indicatorDots: false
          })
        }
        let article = res.data.Data.ProductsDetail;
        WxParse.wxParse('article', 'html', article, that, 0);

        let desc = res.data.Data.SubTitle;
        WxParse.wxParse('desc', 'html', desc, that, 0);
      }
      // that.getSetmealListCallback1(res);
      app.globalData.hideMyLoading();
    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  hiddenShareMenu: function () {
    this.setData({
      showShare: false
    })
  },
  donothing: function () {

  },
  toSharePengyou: function () {
    //console.log(2);
  },
  /**
   * 众筹支付按钮点击回调，跳转到众筹支付页面。
   */
  toCrowdfunding: function () {    

    let that = this;
    if (app.globalData.userInfo && app.globalData.userInfo.Username) {  
      //如果是苹果需要显示不支持购买
      app.iosBuyShowInfo();
      if (app.globalData.systemInfo.isIOS) return;    
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder?productId=' + that.data.productId + '&paymentType=2'
      })
    } else {
      // that.checkUserLogin(function () {
      //   wx.navigateTo({
      //     url: '../confirmOrder/confirmOrder?productId=' + that.data.productId + '&paymentType=2'
      //   })
      // });
      that.data.buttonFlag=2;
      that.setData({
        item: {
          showModal: true
        }
      });
    }
  },
  /**
   * 轮播图点击回调，跳转到试听页面。
   */
  toPlayVideoPage: function () { //跳转到视频播放页面
    let that = this;
    wx.navigateTo({
      url: '../coursePlay/coursePlay?productId=' + that.data.productId +'&frompage=detail'
    })
  },
  /**
   * 点击分享按钮
   */
  showShareMunu: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  /**
   * 立即购买回调
   */
  nowBuy() {
    let that = this;
    if (!that.data.BuyType) {
      return;
    }       

    if (app.globalData.userInfo && app.globalData.userInfo.Username) { 
      //如果是苹果需要显示不支持购买    
      app.iosBuyShowInfo();
      if (app.globalData.systemInfo.isIOS) return;     
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder?productId=' + that.data.productId + '&paymentType=1'
      })
    } else {
      // that.checkUserLogin(function () {
      //   wx.navigateTo({
      //     url: '../confirmOrder/confirmOrder?productId=' + that.data.productId + '&paymentType=1'
      //   })
      // });
      that.data.buttonFlag = 1;
      that.setData({
        item: {
          showModal: true
        }
      });
    }


  },
  /**
   * 咨询按钮回调
   */
  toConsult() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
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
    let _this = this;
    //console.log(`${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorg()}`);
    let shareData = app.getShareData(2, 3);
    return {
      title: _this.data.ProductsTitle,
      path: `${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorage()}`,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  checkUserLogin: function (cb) {
    app.upDataUserInfo(() => {
      typeof cb == "function" && cb()
    }, (resData) => {
      app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs();      
      wx.navigateTo({
        url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
      })
    });
  },
  //获取微信用户信息
  getWxUserInfo: function (result) {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          app.updateUserInfo({
            data: result,
            succ: function () {
              that.setData({
                isShowVideo: true
              })
            },
            error: function (resData) {
              //由于苹果限制登录后先让跳转会当前页面
              app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs();
              //app.globalData.callbackPageUrl = '../confirmOrder/confirmOrder?productId=' + that.data.productId + '&paymentType=' + that.data.buttonFlag;
              wx.navigateTo({
                url: `/pages/login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
              });
              that.setData({
                item: {
                  showModal: false
                }
              });
            },
            canShowLogin: true
          });
        } else {
          that.setData({
            item: {
              showModal: false
            }
          });
          wx.showModal({
            title: '提示',
            content: '拒绝获取用户信息权限，您将无法获取完整用户体验，可通过我的-->权限设置进行授权。',
            confirmText: '知道了',
            showCancel: false
          });
        }
      }
    });
  }
  ,
  /**
   * 取消
   */
  onDialogCancel: function () {
    this.setData({
      item: {
        showModal: false
      }
    });
  }
})