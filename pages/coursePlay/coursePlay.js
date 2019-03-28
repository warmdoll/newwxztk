import { VodVideo,LiveVideo  } from "../BCLVideo/video";
var app = getApp();
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    livelistArr: [1, 2],
    collection: true,
    optionsObj:{},
    uu:'',
    vu:'',
    ClassHoursStatus:{
      0: '播放',
        1: '购买',
          2: '直播中',
            3: '去预约',
              4: '已预约',
                5: '回放',
                  6: '正在准备视频',
                    7: '分享解锁',
                      8: '好评解锁',
                        9: '已下线'
    },
    isFirst:false,
    seekTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(utils.getCurrentPageUrlWithArgs())
    // if (options.exameId) {
    //   this.setData(options)
    //   app.setGlobalData(options);
    // }
    this.data.isFirst = true;
    this.setData(options)
    this.initData();    
    this.setData({
      item: {
        showModal: false
      }
    });
    this.setData({ isShowVideo:true});
  },
  videoPause: function () {
    if (this.player){
      this.data.seekTime = this.player.api.getVideoTime();
      this.player.api.pauseVideo();
    }
      
  },
  initData:function(){
    // if (!app.globalData.exameId){
    //   return
    // }
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/XcxApi/GetCoursePlay`,
      //url: 'https://apimvc2.wangxiao.cn/api/XcxApi/GetCoursePlay',
      method: 'post',
      dataobj: {
        "ExamID": app.globalData.exameId,
        "ProductsId": that.data.productId,
        "username": app.globalData.userInfo.Username,
      }
    };
    if(that.data.id){
      requestObj.dataobj.Id = that.data.id
    }
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      that.data.isFirst = false;
      if (res.data.ResultCode == 0) {
        //console.log(res);
        that.setData(res.data.Data);
        that.setData({ title: res.data.Data.CoursePlayClassHours.Title});
        wx.setNavigationBarTitle({ title: res.data.Data.CoursePlayClassHours.Title });
        if (that.player){
          app.globalData.hideMyLoading();
          return;
        }
          if (res.data.Data.CoursePlayClassHours.ClassHoursStatus == 0 || res.data.Data.CoursePlayClassHours.ClassHoursStatus == 5){
              that.setData({
                uu: res.data.Data.CoursePlayClassHours.UserUnique,
                vu: res.data.Data.CoursePlayClassHours.VideoUnique,
              })
              let playerConf = {
                uu: that.data.CoursePlayClassHours.UserUnique,
                vu: that.data.CoursePlayClassHours.VideoUnique,
                controls: '1',
                autoplay: "1",
              }
              let player = VodVideo(playerConf, "BLV", that);
              that.player = player;
            //player.sdk.setAutoReplay(true);
          } else if (res.data.Data.CoursePlayClassHours.ClassHoursStatus == 2){          
              that.setData({
                activityId: res.data.Data.CoursePlayClassHours.activityId
              })
              let playerConf = {
                activityId: res.data.Data.CoursePlayClassHours.activityId,
                controls: '1',
                autoplay: "1",
              }
              //console.log(that)
              let player = LiveVideo(playerConf, "BLV", that);
              that.player = player;
            //player.sdk.setAutoReplay(true);
          } else{
            wx.showModal({
              title: '提示',
              content: that.data.ClassHoursStatus[res.data.Data.CoursePlayClassHours.ClassHoursStatus],
              showCancel:false
            })
        }
        
        //that.setVideoData(that.data.CoursePlayClassHours.UserUnique, that.data.CoursePlayClassHours.VideoUnique)
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.Message,
          showCancel:false
        })
      }
      // that.getSetmealListCallback1(res);
      app.globalData.hideMyLoading();
    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
    
  },
  resumeVideo(){
    this.player.api.resumeVideo();
  },
  nowBay: function () {
    let that = this;
    if (that.data.BuyType == 0) {
      return;
    }
    //app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs();
    if (app.globalData.userInfo && app.globalData.userInfo.Username) {
      //如果是苹果需要显示不支持购买
      app.iosBuyShowInfo();
      if (app.globalData.systemInfo.isIOS) return;
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder?productId=' + that.data.ProductsId + '&paymentType=1'
      })
    } else {
      // that.checkUserLogin(function () {
      //   wx.navigateTo({
      //     url: '../confirmOrder/confirmOrder?productId=' + that.data.ProductsId + '&paymentType=1'
      //   })
      // });
      //由于苹果限制登录后先让跳转会当前页面
      app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs();
      //app.globalData.callbackPageUrl = 'pages/confirmOrder/confirmOrder?productId=' + that.data.ProductsId + '&paymentType=1';
      that.setData({item:{
        showModal: true
      }});
      that.setData({ isShowVideo: false });
      that.videoPause();
    }
  },
  setVideoData:function(options){
    // 0: '播放',
      //   1: '购买',
      //     2: '直播中',
      //       3: '去预约',
      //         4: '已预约',
      //           5: '回放',
      //             6: '正在准备视频',
      //               7: '分享解锁',
      //                 8: '好评解锁',
      //                   9: '已下线'
    let that = this;
    if (options.detail.status == 1){ //如果需要购买
      //如果是苹果需要显示不支持购买
      app.iosBuyShowInfo();
      if (app.globalData.systemInfo.isIOS) return;
      wx.showModal({
        title: '提示',
        content: '是否去购买本课程？',
        success: function (res) {
          if (res.confirm) {
            that.nowBay();
          }
        }
      })
    } else if (options.detail.status == 0 || options.detail.status == 5){
      if (!options.detail.uu || !options.detail.vu) { //如果uu或vu为空，则无法播放。
        wx.showModal({
          title: '提示',
          content: '视频加载错误',
          showCancel: false
        })
        return;
      }
      if (options.detail.uu != that.data.uu || options.detail.vu != that.data.vu) {//重复点击同一个视频
        that.setData({
          uu: options.detail.uu,
          vu: options.detail.vu
        })
        let playerConf = {
          uu: options.detail.uu,
          vu: options.detail.vu,
          controls: '1',
          autoplay: "1",
        }
        let player = VodVideo(playerConf, "BLV", that);
        wx.setNavigationBarTitle({
          title: options.detail.title,
        });
        that.setData({
          title: options.detail.title
        })
      } else {
        //console.log('重复了');
      }
    } else if (options.detail.status == 2) { //切换到直播
      if (!options.detail.activityid){
        wx.showModal({
          title: '提示',
          content: '视频加载错误',
          showCancel: false
        })
        return;
      }
      if (options.detail.activityid != that.data.activityId) {//判断重复点击重复点击同一个视频
        that.setData({
          activityId: options.detail.activityid
        })
        let playerConf = {
          activityId: options.detail.activityid,          
          controls: '1',
          autoplay: "1",
        }
        let player = LiveVideo(playerConf, "BLV", that);
        //player.sdk.setAutoReplay(true)
      } else {
        //console.log('重复了');
      }
    }
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
    if (!this.data.isFirst){
      this.initData();
      this.setData({ isShowVideo: true });
      if(this.player){
        this.player.api.seekTo(this.data.seekTime)
      }
    }
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
    let shareData = app.getShareData(2, 4);
    let title = _this.data.title;
    if (shareData.Title.indexOf("${classhour_title}") != -1) {
      title = shareData.Title.replace('${classhour_title}', title)
    }
    return {
      title: title,
      path: `${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorage()}`,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
        // 转发成功
        //console.log(`${utils.getCurrentPageUrlWithArgs()}&exameId=${app.globalData.exameId}&signName=${app.globalData.signName}&exameName=${app.globalData.exameName}&subjectName=${app.globalData.subjectName}&subjectId${app.globalData.subjectId}`);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //点击收藏按钮
  collectionfn: function (e) {


  },
  checkUserLogin: function (cb) {
    app.upDataUserInfo(() => {
      typeof cb == "function" && cb()
    }, (resData) => {
      app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
      wx.navigateTo({
        url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
      })
    });
  },
  gotocourseplay:function(e){
    var that = this, eObj = e.target.dataset;
    var playerConf = {
      uu: "a91d451d26",
      vu: eObj.vu,
      controls: '1',
      autoplay: "1",
    };
    var player = VodVideo(playerConf, "BLV", this);
    //player.sdk.setAutoReplay(true);
  },
  onPageScroll(e){
    // if (e.scrollTop >= 10){
    //   this.setData({
    //     isScroll : true
    //   })
    // }else{
    //   this.setData({
    //     isScroll: false
    //   })
    // } 
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
              wx.navigateTo({
                url: `/pages/login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
              });
              that.setData({
                item: {
                  showModal: false
                }
              });
              that.setData({ isShowVideo: true });
            },
            canShowLogin: true
          });
        } else {
          that.setData({
            item: {
              showModal: false
            }
          });
          that.setData({ isShowVideo: true });
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
    this.setData({ isShowVideo: true });
  }
})