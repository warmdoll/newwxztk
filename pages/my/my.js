var app = getApp();
import utils from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    applicationArr:[],
    avatarUrl:'',
    nickName:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that=this;
    this.getUserPersonalMenu();
    //that.appConfig(); // 20180519 不需要调用 lxw
    if (app.globalData.userInfo && app.globalData.userInfo.Username){ //如果在首页已拿到数据执行否则授权获取用户信息并验证登录态
      that.setData({
        avatarUrl: app.globalData.userInfo.HeadPic ? app.globalData.userInfo.HeadPic : '',
        nickName: app.globalData.userInfo.NickName ? app.globalData.userInfo.NickName : '',
        userName: app.globalData.userInfo.Username ? app.globalData.userInfo.Username : '',
      })
      return;
    }
    app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
    /* 20180516 注释 此方法已调取不到用户信息
    app.upDataUserInfo(()=>{
      that.setData({
        avatarUrl: app.globalData.userInfo.HeadPic ? app.globalData.userInfo.HeadPic : '',
        nickName: app.globalData.userInfo.NickName ? app.globalData.userInfo.NickName : '',
        userName: app.globalData.userInfo.Username ? app.globalData.userInfo.Username : '',
      })
    }, (resData) => {
      wx.navigateTo({
        url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
      })
    });
    */
    
  },
  //获取应用
  appConfig:function(){   
    var that=this,
    requestObj = {
      url: 'https://appconfig.wangxiao.cn/service/GetCommendApplication?DeviceType=0&ClassID=99999999-9999-9999-9999-999999999999',
      method: 'get',
      dataobj: {},
      callback1: that.getappConfig,
      callback2: ""
    };
    app.globalData.wxRequestfn(requestObj);
  },
  getappConfig:function(res){
    var that = this, appliCation;
    if (res.data.ResultCode==0){
      appliCation=res.data.Data.slice(0, 3);
      that.setData({
        applicationArr: appliCation
      })
      let sessionFrom = {
        username: '',
        openid: '',
        examid: '',
        subjectid: ''
      };
      sessionFrom.username = app.globalData.userInfo.Username || '';
      sessionFrom.openid = app.globalData.userInfo.OpenId || '';
      sessionFrom.examid = app.globalData.exameId || '';
      sessionFrom.subjectid = app.globalData.subjectId || '';
      that.setData({
        sessionFrom: JSON.stringify(sessionFrom)
      })
    }
  },
  //应用跳转
  gotoHref:function(){
    wx.navigateTo({
      url: '../applicationList/applicationList'
    })
  },
  toOrderList:function(){
    let that = this;
    if (app.globalData.userInfo && app.globalData.userInfo.Username) {
      wx.navigateTo({
        url: '../orderList/orderList'
      })
    } else {
      that.checkUserLogin(function () {
        wx.navigateTo({
          url: '../orderList/orderList'
        })
      });
    }
    
  },
  toAgreement: function () {
    let that = this;
    if (app.globalData.userInfo && app.globalData.userInfo.Username) {
      wx.navigateTo({
        url: '../myagreement/myagreement'
      })
    } else {
      that.checkUserLogin(function () {
        wx.navigateTo({
          url: '../myagreement/myagreement'
        })
      });
    }

  },
  toMyCourse:function(){
    let that = this;
    if (app.globalData.userInfo && app.globalData.userInfo.Username) {
      wx.navigateTo({
        url: '../mycourse/mycourse'
      })
    } else {
      that.checkUserLogin(function () {
        wx.navigateTo({
          url: '../mycourse/mycourse'
        })
      });
    }
  },
  toExclusiveTeacher:function(){
    let that = this;
    if (app.globalData.userInfo && app.globalData.userInfo.Username) {
      wx.navigateTo({
        url: '../exclusiveTeacher/exclusiveTeacher'
      })
    } else {
      that.checkUserLogin(function () {
        wx.navigateTo({
          url: '../exclusiveTeacher/exclusiveTeacher'
        })
      });
    }

    
  },
  checkUserLogin: function (cb) {
    app.upDataUserInfo(() => {
      typeof cb == "function" && cb()
    }, (resData) => {
      app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
      wx.navigateTo({
        url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
      })
    },true);
  },
  settingAuthority:function(){
    let that = this;
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          app.upDataUserInfo(() => {
            
            that.setData({
              avatarUrl: app.globalData.userInfo.HeadPic ? app.globalData.userInfo.HeadPic : '',
              nickName: app.globalData.userInfo.NickName ? app.globalData.userInfo.NickName : '',
              userName: app.globalData.userInfo.Username ? app.globalData.userInfo.Username : '',
            })
          }, (resData) => {
            app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
            wx.navigateTo({
              url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
            })
          });
        } else {
          that.globalData.isRefuseAuthor = true;
          wx.showModal({
            title: '提示',
            content: '拒绝获取用户信息权限，您将无法获取完整用户体验，可通过我的-->权限设置进行授权。',
            confirmText: '知道了',
            showCancel: false
          })
        }
      }
    })
    
  },
  //获取微信用户信息
  getWxUserInfo:function(result){
    var that=this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]){
          app.updateUserInfo({
            data:result,
            succ:function(){
              that.setData({
                avatarUrl: app.globalData.userInfo.HeadPic||'',
                nickName: app.globalData.userInfo.NickName || '',
                userName: app.globalData.userInfo.Username|| '',
              })
            },
            error:function(resData){
              app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
              wx.navigateTo({
                url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
              })
            },
            canShowLogin:true
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '拒绝获取用户信息权限，您将无法获取完整用户体验，可通过我的-->权限设置进行授权。',
            confirmText: '知道了',
            showCancel: false
          });
        }
      }
    });
  },
  getUserPersonalMenu:function(){
    if (app.globalData.openid){
      var that=this;
      app.globalData.wxRequestPromise({
        url: app.globalData.requestUrlobj.apimvc +"/api/xcxapi/GetUserPersonalMenu",
        method:"POST",
        dataobj:""
      }).then((res) => { 
        if(res.data.ResultCode==0){
          that.setData({ menus: res.data.Data});
        }
      }).catch((errMsg) => {
        that.globalData.hideMyLoading();
        console.log(errMsg);//错误提示信息
      });;
    }
  },
  menutap:function(e){
    var action = e.currentTarget.dataset.action;
    var url = e.currentTarget.dataset.url;
    switch(action){
      case "switchTab":
        wx.switchTab({
          url: url
        })
      break;
      default:
        wx.navigateTo({
          url: url
        })
      break;
    }
  }
})