//app.js
var feedbackApi = require('pages/commonjs/showToast');//引入消息提醒暴露的接口  
import utils from 'utils/util.js';
App({
  onLaunch: function () {
    // 展示本地存储能力
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //全局属性和方法app.globalData.myLoading
  globalData: {
    canShare: false,
    sign: '',//考试标识
    signName: '',//考试名称
    exameId: '',//考试id
    subjectId: "",//科目id
    subjectName: "",//科目名称
    paperhistoryid:"",//试卷id
    userInfo: {
      "Username": '', 
      "OpenId": "", 
      "NickName": '', 
      "HeadPic": '', 
      "Balance": 0
    },//数据库保存的用户信息。
    uu:"a91d451d26",//视频uu
    vidoeTitle:"",//当前播放的视频标题
    haveDoti:[],
    resaultTi:[],
    tiObj: [],//试题数组
    oyearpaperTi: [],//历年真题 练习模式
    oyearpaperExamTi: [],//历年真题 考试模式
    getClassHoursCart:{},//学习首页进度条部分相关数据
    tiDay: "",//每日一练传递的日期
    buyTi: {},
    isShowCom:false,
    systemInfo:{},
    filterTiarr: [],//筛选试题数组
    requestUrlobj: {
      wap: "https://wap.wangxiao.cn",
      appconfig: "https://appconfig.wangxiao.cn",
      tikuapi: "https://tikuapi.wangxiao.cn",
      apimvc: "https://apimvc.wangxiao.cn",
      api: "https://api.wangxiao.cn",
      core: "https://coreapi.wangxiao.cn"
    },//请求接口域名
    applicationID: "e8a38467-6064-4684-be0c-f500b42f8238",
    SysClassID: "11111111-1111-1111-1111-111111111111",//应用id
    Sign: "ztk",  //应用标识
    OrderFromType: 5,//订单来源--5代表小程序
    openid: "",
    isRefuseAuthor:false,
    exametitle: "",//试卷名称
    canSelectSubject:false,
    protocolData:{ //中大服务协议信息
      title:'',
      url:''
    },
    datiTotaltime:0,//试卷答题时间
    usedSeconds:0,//用户答题已用时间
    examSortCount:0,//试卷得分
    totalScore:0,//总分数
    isPaperExameStatus:0,//显示总分状态
        shareImgData:null,
    shareImgData:null,
    // 请求接口
    wxRequestfn: function (requestObj) {
      // // 判断是否登录--用户名是否为空
      // if (typeof requestObj.dataobj.username != "undefined" && requestObj.dataobj.username!=""){
      //     //改变用户名

      // }else{
      //   // 调登录

      // }
      wx.request({
        url: requestObj.url,
        method: requestObj.method,
        header: {
          "SysClassId": this.SysClassID,//"e8a38467-6064-4684-be0c-f500b42f8238",
          "ApplicationID": this.SysClassID,
          'from': 'xcx',
          "username": this.userInfo.Username||"",
          "openid": this.userInfo.OpenId,
          "version":"1.0.6"
        },
        data: requestObj.dataobj,
        success: function (res) {
          requestObj.callback1(res);
        },
        fail: function () {
          requestObj.callback2();
        }
      });
    },
    // 请求接口
    wxRequestPromise: function (requestObj) {
      let SysClassId = this.SysClassID || '';
      let username = '';
      let openid = '';
      if (this.userInfo && this.userInfo.Username){
        username = this.userInfo.Username
      }
      if (this.userInfo && this.userInfo.OpenId){
        openid = this.userInfo.OpenId
      }
      return new Promise((resolve, reject) => {
        //网络请求
        wx.request({
          url: requestObj.url,
          method: requestObj.method,
          header: {
            "SysClassId": SysClassId,
            "ApplicationID": SysClassId,
            'from': 'xcx',
            "username": username,
            "openid": openid
          },
          data: requestObj.dataobj,
          success: function (res) {//返回取得的数据
            resolve(res);
          },
          error: function (e) {
            reject('网络出错');
          }
        })
      });
    },
    /**
     * 封装loading和hideloading方法。
     * loading方法参数title参数内容
     */
    isShowTimeEnough: false,
    hideLoadingCalback: null,
    myLoading: function (title) {
      this.isShowTimeEnough = false;
      title = title || '';
      wx.showLoading({
        title: title,
        mask: true,
      })
      let timer = setTimeout(() => {
        this.isShowTimeEnough = true;
        clearTimeout(timer);
        timer = null;
      }, 500)
    },
    /**
     * 封装loading和hideloading方法。
     * hideLoadingCalback为hideloading时的回调函数
     */
    hideMyLoading: function (hideLoadingCalback) {
      hideLoadingCalback = hideLoadingCalback || null;
      if (typeof hideLoadingCalback == 'function') {
        this.hideLoadingCalback = hideLoadingCalback;
      } else {
        this.hideLoadingCalback = null;
      }
      if (this.isShowTimeEnough) {
        wx.hideLoading();
        if (this.hideLoadingCalback) {
          this.hideLoadingCalback();
        }
      } else {
        let timer = setInterval(() => {
          if (this.isShowTimeEnough) {
            wx.hideLoading();
            clearInterval(timer);
            timer = null;
            if (this.hideLoadingCalback) {
              this.hideLoadingCalback();
            }
          }
        }, 200)
      }
    }
  },
  // 提示框
  testToast: function (message) {
    //提示框
    feedbackApi.showToast({
      title: message,
      duration: 10000,
      mask: false
    })
    setTimeout(function () {
      feedbackApi.hideToast();
    }, 1000)
  },
  /**
   * 登录校验，获取openid
   */
  login: function (successCb, errorCb) {
    let that = this;
    wx.login({
      success: function (res) {
        let requestObj = {
          url: that.globalData.requestUrlobj.wap + "/weixin/xcx/Jscode2session",
          method: 'post',
          dataobj: {
            js_code: res.code
          },
        }
        that.globalData.myLoading('努力加载中...');
        that.globalData.wxRequestPromise(requestObj).then((res) => {
          let resData = res.data.Data;
          //that.globalData.openid = resData.OpenId
          if (res.data.ResultCode == 0) { // 成功获取useInfo保存起来。
            that.globalData.userInfo = resData;
            //if (resData.OpenId) {//去验证更新用户数据
            that.upDataUserInfo(successCb, errorCb);
            //}
          } else {
            that.globalData.hideMyLoading();
            wx.showModal({
              title: '提示',
              content: res.data.Message,
              showCancel: false
            })
          }

        }).catch((errMsg) => {
          that.globalData.hideMyLoading();
          console.log(errMsg);//错误提示信息
        });
        that.globalData.hideMyLoading();
      }
    })

  },
  hideGetUserInfo(options){
    let that = this;
    wx.login({
      success: function (res) {
        let requestObj = {
          url: that.globalData.requestUrlobj.wap + "/weixin/xcx/Jscode2session",
          method: 'post',
          dataobj: {
            js_code: res.code
          },
        }
        that.globalData.wxRequestPromise(requestObj).then((res) => {
          let resData = res.data.Data;
          if (resData.OpenId){
            that.globalData.userInfo.OpenId = resData.OpenId;
            let requestObj2 = {
              url: that.globalData.requestUrlobj.wap + "/weixin/xcx/GetUserInfo",
              method: 'post'
            }
            return that.globalData.wxRequestPromise(requestObj2)
          }
        }).then((res)=>{
          if (res.data.ResultCode == 0){
            that.globalData.userInfo = res.data.Data;
            that.globalData.openid = res.data.Data.OpenId;
          }
          if (options && typeof options.callback=="function"){
            options.callback();//执行成功回调
          }
        }).catch((errMsg) => {
          console.log(errMsg);//错误提示信息
          if (options && typeof options.callback == "function") {
            options.callback();//执行成功回调
          }
        });
      }
    })
  },
  // 分享相关接口
  //分享成功请求数据
  shareRequest: function (idstr, UnlockType, loginUrl) {
    var that = this,
      dataObj = {
        Data: {
          UnlockType: UnlockType||0,
          username:that.globalData.userInfo.Username || "",
          ID: idstr,
          UnlockWay: 1,
          ApplicationID: that.globalData.SysClassID
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/UnlockHistory/Insert',
        method: 'post',
        dataobj: dataObj,
        callback1: that.getShareFn,
        callback2: ""
      };
    if (that.globalData.userInfo && that.globalData.userInfo.Username) {
      that.globalData.wxRequestfn(requestObj);
    } else {
      that.checkUserLogin(function () {
        that.globalData.wxRequestfn(requestObj);
      }, loginUrl);
    }
    
  },
  getShareFn: function (res) {
    var that=this,page = getCurrentPages().pop();
    if (res.data.ResultCode==0){
      console.log(page)
      if (page == undefined || page == null) return;
      that.globalData.isShowCom = false;
      page.onLoad(page.options);
      that.globalData.isShowCom = true;
    
    }
    else if (res.data.ResultCode == 2){
      wx.showModal({
        title: '',
        content: res.data.Message,
        showCancel: false,
        confirmText: "我知道了",
        success: function (resbtn) {
          if (resbtn.confirm) {
            if (that.globalData.userInfo && that.globalData.userInfo.Username) {
              if (page == undefined || page == null) return;
              that.globalData.isShowCom = false;
              page.onLoad(page.options);
              console.log(page.options)
              that.globalData.isShowCom = true;
            } else {
              that.checkUserLogin(function () {
               
              });
            }
           
          }
        }
      })
    }
    console.log(res)
  },

  checkUserLogin: function (cb,loginUrl) {
    var that=this;
    that.upDataUserInfo(() => {
      typeof cb == "function" && cb()
    }, (resData) => {
      that.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
      wx.navigateTo({
        url:loginUrl ?`${loginUrl}/quickLogin/quickLogin?IsShowValidatecode = ${resData.IsShowValidatecode } & validatekey=${resData.validatekey }`:`../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
      })
    });
  },
  /**
   * 验证更新用户登录信息
   * successCb验证通过回调。
   * errorCb失败回调
   */
  upDataUserInfo: function (successCb, errorCb,canShowLogin) {
    let that = this;
    if (that.globalData.userInfo.OpenId) { //检测登录态，获取用户信息
      if (that.globalData.isRefuseAuthor){
        wx.showModal({
          title: '提示',
          content: '拒绝获取用户信息权限，您将无法获取完整用户体验，可通过我的-->权限设置进行授权。',
          confirmText: '知道了',
          showCancel: false
        })
      }else{
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            // 获取用户信息
            let requestObj = {
              url: `${that.globalData.requestUrlobj.wap}/weixin/xcx/UpdateUserInfo`,
              method: 'post',
              dataobj: {
                rawData: res.rawData,
                signature: res.signature,
                encryptedData: res.encryptedData,
                iv: res.iv,
                userInfo: res.userInfo
              },
            }
            that.globalData.wxRequestPromise(requestObj).then((res) => {
              let resData = res.data.Data;
              if (res.data.ResultCode == 0) { // 成功获取useInfo保存起来。 判断用户有没有注册过，如果没有注册跳转到快速登录页面。
                if (resData.UserStatus == 1) { //数据有效，进行保存。
                  that.globalData.userInfo = resData.userInfo;
                  typeof successCb == "function" && successCb()
                } else { //登录态失效，重新登录。
                  that.globalData.hideMyLoading();
                  if (canShowLogin){ //不显示确认窗口
                    typeof errorCb == "function" && errorCb(resData);
                    return;
                  }
                  if (resData.userInfo){
                    wx.showModal({
                      title: '提示',
                      content: '登录失效，请重新登录',
                      success: function (res) {
                        if (res.confirm) {
                          typeof errorCb == "function" && errorCb(resData)
                        }
                      }
                    })
                  }else{
                    wx.showModal({
                      title: '提示',
                      content: '请登录!',
                      success: function (res) {
                        if (res.confirm) {
                          typeof errorCb == "function" && errorCb(resData)
                        }
                      }
                    })
                  }
                  
                }
              } else {
                that.globalData.hideMyLoading();
                wx.showModal({
                  title: '提示',
                  content: res.data.Message,
                  showCancel: false
                })
              }

            }).catch((errMsg) => {
              that.globalData.hideMyLoading();
              console.log(errMsg);//错误提示信息
            });
          },
          fail: function () {
            wx.showModal({
              title: '提示',
              content: '拒绝获取用户信息权限，您将无法获取完整用户体验，可通过我的-->权限设置进行授权。',
              confirmText: '知道了',
              showCancel: false
            })
            // wx.showModal({
            //   title: '提示',
            //   content: '若不授权微信登录，则无法获得小程序的完整功能体验。',
            //   confirmText: '知道了',
            //   showCancel: false,
            //   success: function (res) {
            //     if (res.confirm) {
            //       wx.openSetting({
            //         success: (res) => {
            //           if (res.authSetting["scope.userInfo"]) {
            //             that.login(successCb, errorCb);
            //           } else {
            //             that.globalData.isRefuseAuthor = true;
            //             wx.showModal({
            //               title: '提示',
            //               content: '您将无法获得完整的功能体验，您可删除小程序，重新进入进行授权。',
            //               confirmText: '知道了',
            //               showCancel: false
            //             })
            //           }
            //         }
            //       })
            //     }
            //   }
            // })
          }
        })
      }
    } else {
      that.login(successCb, errorCb);
    }
  },
  /**
   * 已登录状态下更新个人数据
   */
  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.userInfo && that.globalData.userInfo.Username) { //如果已登录过，直接更新数据
      let requestObj = {
        url: that.globalData.requestUrlobj.wap + "/weixin/xcx/GetUserInfo",
        method: 'post'
      }
      that.globalData.myLoading('努力加载中...');
      that.globalData.wxRequestPromise(requestObj).then((res) => {
        let resData = res.data.Data;
        //that.globalData.openid = resData.OpenId
        if (res.data.ResultCode == 0) { // 成功获取useInfo保存起来。
          that.globalData.userInfo.Balance = resData.Balance;
          that.globalData.hideMyLoading();
          typeof cb == "function" && cb()
        } else {
          that.globalData.hideMyLoading();
          wx.showModal({
            title: '提示',
            content: res.data.Message,
            showCancel: false
          })
        }

      }).catch((errMsg) => {
        that.globalData.hideMyLoading();
        console.log(errMsg);//错误提示信息
      });
    } else { //如果没登录过，去授权登录。
      that.upDataUserInfo()
    }
  },
  interfacePay: function (timeStamp, nonceStr, _package, signType, paySign, successCb, errorCb){
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': _package,
      'signType': signType,
      'paySign': paySign,
      'success': function (res) {
        typeof successCb == "function" && successCb(res)
      },
      'fail': function (res) {
        typeof errorCb == "function" && errorCb(res)
      }
    })
  },
  getLocationStorage(){
    return `exameId=${this.globalData.exameId}&signName=${this.globalData.signName}&exameName=${this.globalData.exameName}&subjectName=${this.globalData.subjectName}&subjectId=${this.globalData.subjectId}&uu=${this.globalData.uu}`
  },
  setGlobalData:function (options) {
    this.globalData.exameId = options.exameId || '';
    this.globalData.signName = options.signName || '';
    this.globalData.sign = options.signName || '';
    this.globalData.exameName = options.exameName || '';
    this.globalData.subjectName = options.subjectName || '';
    this.globalData.subjectId = options.subjectId || '';
    this.globalData.uu = options.uu || '';
    wx.setStorageSync('exameId', options.exameId || '');
    wx.setStorageSync('sign', options.signName || '');
    wx.setStorageSync('signName', options.signName || '');
    wx.setStorageSync('exameName', options.exameName || '');
    wx.setStorageSync('subjectName', options.subjectName || '');
    wx.setStorageSync('subjectId', options.subjectId || '');
    wx.setStorageSync('uu', options.uu || '');
  },
  //通用接口获取页面分享配置信息
  getShareData(typevalue,typeaction){
    /**
     * 模块 页面 typevalue typeaction
     * 学习 学习首页 1 1
     *      每日一练 1 2
     *      模拟试题 1 2
     *      历年真题 1 2
     *      章节课播放 1 3
     * 课程 课程首页 2 1
     *      商品列表 2 2
     *      商品详情 2 3
     *      课程/直播播放页面 2 4
     * 直播 直播首页 3 1
     * 我的 众筹分享 4 1
     */
    let shareData = this.globalData.shareImgData.filter((item, index) => {
      return item.Type == typevalue && item.TypeAction == typeaction;
    });
    if (shareData.length == 1) {
      shareData = shareData[0];
      return shareData.Data;
    } else {
      return {
        ImageUrl:'',
        Path:'',
        Title:''
      }
    }
  },
  //获取所有页面分享数据
  getShareImg(){
    let that = this;
    wx.login({
      success: function (res) {
        let requestObj = {
          url: that.globalData.requestUrlobj.apimvc + "/api/XcxApi/GetShareModel",
          method: 'post',
          dataobj: {
            js_code: res.code
          },
        }
        that.globalData.wxRequestPromise(requestObj).then((res) => {
          that.globalData.shareImgData = res.data.Data;
        }).catch((errMsg) => {
          console.log(errMsg);//错误提示信息
        });
      }
    })
  },
  onShow: function (options) {
    
    if (!this.globalData.shareImgData){
      this.getShareImg();
    }
    
    if (options.scene == '1008' || options.scene == '1007') {
      this.setGlobalData(options.query);
    }
  },
  //获取网址参数，name:参数名称 url网址
  getUrlParms:function(name,url){
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
       var search = url.substring(url.indexOf("?")+1);
       var r = search.match(reg);
       if(r!=null) return unescape(r[2]);
       return null;
  },
  changeGlobalData:function(options){
    if (options) {
      console.log(options);
      if (options.q) {//扫描二维码
          options.q = decodeURIComponent(options.q);
          options.examId = this.getUrlParms("examId", options.q);
          options.exameId = options.examId;
          options.subjectId = this.getUrlParms("subjectId", options.q);
          options.subjectName = this.getUrlParms("subjectName", options.q);
          options.exameName = this.getUrlParms("exameName", options.q);         
      }
      if (options.examId && options.subjectId && options.subjectName && options.exameName) {//直接进入本页面
        this.globalData.examId = options.examId;
        this.globalData.exameId = options.examId;//晕菜的不知道具体用的哪个参数了  
        this.globalData.subjectId = options.subjectId;
        this.globalData.subjectName = options.subjectName;
        this.globalData.exameName = options.exameName;
      }
    }
  },
  updateUserInfo: function (options){
    var that=this;
    // 获取用户信息
    let requestObj = {
      url: `${that.globalData.requestUrlobj.wap}/weixin/xcx/UpdateUserInfo`,
      method: 'post',
      dataobj: options.data.detail,
    }
    that.globalData.wxRequestPromise(requestObj).then((res) => {
      let resData = res.data.Data;
      if (res.data.ResultCode == 0) { // 成功获取useInfo保存起来。 判断用户有没有注册过，如果没有注册跳转到快速登录页面。
        if (resData.UserStatus == 1) { //数据有效，进行保存。
          that.globalData.userInfo = resData.userInfo;
          typeof options.succ == "function" && options.succ();
        } else { //登录态失效，重新登录。
          that.globalData.hideMyLoading();
          if (options.canShowLogin) { //不显示确认窗口
            typeof options.error == "function" && options.error(resData);
            return;
          }
          wx.showModal({
            title: '提示',
            content: resData.userInfo ? '登录失效，请重新登录' : '请登录!',
            success: function (res) {
              if (res.confirm) {
                typeof options.error == "function" && options.error(resData)
              }
            }
          });
        }
      } else {
        that.globalData.hideMyLoading();
        wx.showModal({
          title: '提示',
          content: res.data.Message,
          showCancel: false
        })
      }

    }).catch((errMsg) => {
      that.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  showLogin: function (options){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '请登录!',
      success: function (res) {
        if (res.confirm) {
          if (options&&(typeof options.succ == "function")){
             options.succ(options);
          }else{
            console.log(that.globalData.callbackPageUrl);
          }
        }
      }
    })
  },
  iosBuyShowInfo:function(){
    var _obj=this;
    wx.getSystemInfo({
      success: function(res) {
       console.log(res);
        _obj.globalData.systemInfo=res;
        _obj.globalData.systemInfo["device"] = res.system.toLowerCase().indexOf("ios") == -1?"android":"ios";
        _obj.globalData.systemInfo["isIOS"] = _obj.globalData.systemInfo.device=="ios";
        if (_obj.globalData.systemInfo.isIOS){
          wx.showModal({
            title:"温馨提示",
            content:"十分抱歉，小程序暂不支持此服务",
            confirmText:"我知道了",
            confirmColor:"#3cc51f",
            showCancel:false
          });
        }
      },
    })
  }
})