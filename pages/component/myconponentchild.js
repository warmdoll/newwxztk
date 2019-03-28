// pages/template/componont/myCon.js

import utils from '../../utils/util.js';
var app = new getApp();
Component({
  behaviors: [],
  /**
   * 组件的属性列表
   */
  properties: {
    childarr: {
      type: Array,
      value: [1]
    },  
    activeIndex:{
      type: Number,
      value:0
    },
    frompage:{
      type:String,
      value:""
    },
    datauu:{
      type:String,
      value:""
    },
    studyShow:{
      type:Boolean,
      value:false
    },
    islogin: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    str1: {},
    activeIndex: 0,
    activeObj: {},
    productsId: "",
    videoUu: "",
    studyShow:false
  },
  //章节课接口
  getChapterfn: function () {
    // var that = this,
    //   userName = typeof app.globalData.userInfo.Username != "undefined" ? app.globalData.userInfo.Username:"",//"ztk_02567647",
    //     subjectId = app.globalData.subjectId,//"4ca44210-2db1-451f-8b77-8453c57108e2",
    //     requrl = app.globalData.requestUrlobj.apimvc + '/ZhangJieKeService/GetClassHoursCart?username=' + userName + '&subjectId=' + subjectId;
       
    // that.data.fromPage = that.getCurrentPageUrl();
    // var dataObj = {},
    //   requestObj = {
    //     url: requrl,
    //     method: 'post',
    //     dataobj: dataObj,
    //     callback1: function studyfn(res) {
    //       that.setData({
    //           str1: res.data
    //       })
    //     },
    //     callback2: ""
    //   };
    // app.globalData.wxRequestfn(requestObj);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openList: function (e) {
      var that = this, dataId = e.currentTarget.dataset.id;
      var obj = that.properties.childarr;
      that.data.frompage = that.getCurrentPageUrl();
      obj.forEach(function (i, v) {
        if (i.Children != null){
          if (i.Id == dataId) {
            //如果是关闭状态，则展开
            i.open = !i.open;
            that.setData({
              childarr: obj
            })

          }
        }
         
      })
    },
    // 点击去播放页面
    childgotocourseplay: function (e) {
      var that = this, eObj = e.target.dataset;
      if (eObj.type == 1 || e.detail.type == 1) {

        //点击播放按钮
        if (that.data.frompage == "study") {
          
          wx.navigateTo({
            url: '../chapterPlay/chapterPlay?id=' + eObj.id + '&parentId=' + eObj.parentid+'&uu=' + app.globalData.uu+ '&vu=' + eObj.vu + '&title=' + eObj.title,
           })
        } else {
          //课程播放页面 点击改变uuvu
          var myEventDetail = {
            uu: e.detail.uu || eObj.uu,
            vu: e.detail.vu || eObj.vu,
            id: e.detail.id || eObj.id,
            parentsid: e.detail.parentId || eObj.parentId,
            type: e.detail.type || eObj.type,
            title: e.detail.title || eObj.title
          } // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          this.triggerEvent('myevent', myEventDetail)

          var currArr = that.data.childarr,
            changeObj = currArr.filter(function (item) {
              return item.Id == myEventDetail.id
            });
          currArr.forEach(function (v, i) {
            v.nowplay = 1
          })
          var currObj = changeObj[0];
          currObj.nowplay = 0;
          var index = currArr.indexOf(changeObj[0]);
          currArr[index] = currObj;
          that.setData({
            childarr: currArr
          })
        }
      }
      else if (eObj.type == 2 || e.detail.type == 2) {
        //点击分享按钮
        var title = eObj.title
        var myEventDetail = {
          title: e.detail.title || eObj.title,
          id: e.detail.id || eObj.id,
          customcallback:function(){
            that.setData({
              item: {
                showModal: true
              }
            });
          }
        } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('myevent', myEventDetail)
      
      }
    },
    // 点击购买
    gotobuy: function (e) {      
      
      if (app.globalData.userInfo.Username) {
        //如果是苹果需要显示不支持购买
        app.iosBuyShowInfo();
        if (app.globalData.systemInfo.isIOS) return;        
        var eObj = e.target.dataset,
          // userName =typeof app.globalData.userInfo.Username != "undefined" ? app.globalData.userInfo.Username : "",//"ztk_02567647",
          subjectId = app.globalData.subjectId,
          requrl = app.globalData.requestUrlobj.apimvc + '/ZhangJieKeService/GetClassHoursBuy';
        var dataObj = {
          username: app.globalData.userInfo.Username,
          subjectId: subjectId,
          ClassHoursId: eObj.id
        },
          requestObj = {
            url: requrl,
            method: 'post',
            dataobj: dataObj,
            callback1: function studyfn(res) {
              if (res.data.ResultCode == 0) {
                var dataArr = res.data.Data;
                dataArr.OtherIsProduct = true;
                dataArr.OtherProductName = dataArr.SaleInfo;
                dataArr.OtherAllPrice = dataArr.OriginMoney;
                app.globalData.buyTi = dataArr;
                // app.globalData.buyTi = res.data.Data;
                wx.navigateTo({
                  url: '../pay/tipay/tipay?id=' + eObj.id + "&frompage=zjk&typename=" + eObj.title,
                })
              }
            },
            callback2: ""
          };
        app.globalData.wxRequestfn(requestObj);
      }else{
        this.setData({ showModal: true });
      }
    },
    // 跳转到做题页面
    gotodoti: function (e) {
      var that = this, sectionId = e.currentTarget.dataset.sectionid;//章节id
      if (app.globalData.userInfo.Username) {
        wx.navigateTo({
          url: '../fliterquestion/fliterquestion?sectionid=' + sectionId,
        })
      } else {
        // that.checkUserLogin(function () {
        //   wx.navigateTo({
        //     url: '../fliterquestion/fliterquestion?sectionid=' + sectionId,
        //   })
        // });
        that.setData({ showModal: true });
      }
    },
    checkUserLogin: function (cb) {
      app.upDataUserInfo(() => {
        typeof cb == "function" && cb()
      }, (resData) => {
        app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
        wx.navigateTo({
          url: `../../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
        })
      });
    },
    //获取页面信息
    getCurrentPageUrl: function () {
      var pages = getCurrentPages()    //获取加载的页面
      var currentPage = pages[pages.length - 1]    //获取当前页面的对象
      return currentPage.data.frompage
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
                app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
                if (that.properties.studyShow) {//首页 章节课 需切换TAB
                  wx.switchTab({
                    url: '/pages/my/my',
                    success: function () {
                      wx.navigateTo({
                        url: `/pages/login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
                      });
                    }
                  });
                } else {
                  wx.navigateTo({
                    url: `/pages/login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
                  });
                }
                that.setData({ showModal: false });
              },
              canShowLogin: true
            });
          } else {
            that.setData({ showModal: false });
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
      this.setData({ showModal: false });
    },
    /**
   * 显示登录窗口
   */
  showLoginDialog: function (event) {
    console.log(app.globalData.userInfo);
      this.setData({ showModal: true });
    }
  },
  ready: function () {
  } 
})
