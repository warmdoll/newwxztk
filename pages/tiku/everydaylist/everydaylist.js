var app = new getApp();
var commonJs = require('../../commonjs/common.js');
var crtTime = new Date();
//直接调用公共JS里面的时间类处理的办法     
var nowData = commonJs.commonObj.dateFtt("yyyyMMdd", crtTime);
import utils from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    dataArr:[],
    exameId:"",
    subjectId:"",
    nodata:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      exameId: options.exameid,
      subjectId: options.subjectid
    })
    that.getTilist();
    that.setData({
      item: {
        showModal: false
      }
    });   
  },
  // 获取每日一练列表
  // 获取题目
  getTilist: function () {
     var that = this,
      dataObj = {
        Data:{
          Query: {
            ExamID: that.data.exameId,
            SubjectID: that.data.subjectId,
            Day: nowData,
            IsNewVersion:1
          }
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/EverydayTest/GetPage',
        method: 'post',
        dataobj: dataObj,
       
        callback1: that.getTilistcallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  getTilistcallback1: function (res) {
    var that = this,
      resArr = res.data.Data;
    if (res.data.ResultCode == 0) {
      if (resArr.length>0){
        var dayStr="20180203";
        resArr.forEach(function(v,i){
          var dayStr ="2018";
         
          v.tiTitle = "《" + v.Day+v.SubjectName+"》每日一练";
          v.UnlockWay = 0;
          if (String(nowData) === String(v.Day)){
            v.nowDay="今天";
          }else{
            v.nowDay = String(v.Day).substring(4, 6) + "月" + String(v.Day).substring(6)+"日";
          }
         
        })
      }
        that.setData({
          dataArr: resArr
        })
    }else{
      that.setData({
        nodata: true
      })
    }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  gotonaxtpage:function(e){

  },
  // 点击跳转刷题页面
  gotonaxtpage:function(e){
    var that=this,datasetObj = e.currentTarget.dataset,
      unlockWay = datasetObj.unlockWay;
      //做题
    if (app.globalData.userInfo.Username) {
        wx.navigateTo({
          url: '../tikupaper/tikupaper?exameid=' + datasetObj.exameid + "&subjectid=" + datasetObj.subjectid + "&day=" + datasetObj.tiday + "&tinum=1" + "&frompage=everydaylist",
        })
      } else {
        // that.checkUserLogin(function () {
        //   wx.navigateTo({
        //     url: '../tikupaper/tikupaper?exameid=' + datasetObj.exameid + "&subjectid=" + datasetObj.subjectid + "&day=" + datasetObj.tiday + "&tinum=1" + "&frompage=everydaylist",
        //   })
        // });
        that.setData({
          item: {
            showModal: true
          }
        });
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
              wx.redirectTo({
                url: `../../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
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
  ,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.tiObj=[];
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
  onShareAppMessage: function (res) {
    let shareData = app.getShareData(1, 2);
    return {
      title: shareData.Title||`快来一起学习${app.globalData.exameName}了~`,
      path: `${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorage()}`,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
})