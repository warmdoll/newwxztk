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
    paperType:0,
    subjectId:"",
    title:'',
    source:"",
    nodata: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      paperType: options.papertype,
      subjectId: options.subjectid,
      source: options.source
    })
     wx.setNavigationBarTitle({
       title: options.papertype == 0 ? "历年真题" : "模拟试题"//页面标题为路由参数
     })
    // that.getTilist();
     that.setData({
       item: {
         showModal: false
       }
     });  
  },
  // 获取列表
  getTilist: function () {
     var that = this,
      dataObj = {
        Data:{
          Query: {
            ApplicationID : "11111111-1111-1111-1111-111111111111",
            PaperType: that.data.paperType,
            SubjectID: that.data.subjectId,
            TagIsDelete : 0,
            Username: app.globalData.userInfo.Username
          }
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/TestPaper/GetPage',
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
  // 点击跳转刷题页面
  gotonaxtpage:function(e){
    var that=this,datasetObj = e.currentTarget.dataset,
        dataArr=that.data.dataArr,
        unlockWay = datasetObj.unlockway;
      switch (unlockWay) {
        case 0:
          //做题
          if (app.globalData.userInfo.Username) {
            wx.navigateTo({
              url: '../paperquestionsdetail/paperquestionsdetail?paperid=' + datasetObj.id + "&source=" + that.data.source,
            })
          } else {
            // that.checkUserLogin(function () {
            //   wx.navigateTo({
            //     url: '../paperquestionsdetail/paperquestionsdetail?paperid=' + datasetObj.id + "&source=" + that.data.source,
            //   })
            // });
            that.setData({
              item: {
                showModal: true
              }
            });
          }
          break;
        case 3://购买
          var orderObj=that.data;
          if (app.globalData.userInfo.Username) {
            that.buyTi(datasetObj);
          } else {
            // that.checkUserLogin(function () {
            //   wx.navigateTo({
            //     url: '../../payment/payment?orderId=' + orderObj.OrderNumber + "&NeedMoney=" + orderObj.NeedMoney + "&Hasmoney=" + orderObj.Hasmoney,
            //   })
            // });
            that.setData({
              item: {
                showModal: true
              }
            });
          }
          break;
          case 1:
          
          break;
      }
    
  },
  buyTi: function (datasetObj) {
    //如果是苹果需要显示不支持购买
    app.iosBuyShowInfo();
    if (app.globalData.systemInfo.isIOS) return;
    var that = this,
      dataObj = {
        Data: {
          Id: datasetObj.id,
          ProductsType: 10,
          username: app.globalData.userInfo.Username || "",
          OrderFromType: app.globalData.OrderFromType,
          UnlockType:1
        }
      },
      requestObj = {
        url: app.globalData.requestUrlobj.tikuapi + "/api/TestPaper/BuyDeal",
        method: 'post',
        dataobj: dataObj,

        callback1: function (res) {
          var orderObj = res.data.Data;
          if (res.data.ResultCode==0){
            that.setData({
              OrderNumber: orderObj.OrderNumber,
              NeedMoney: orderObj.NeedMoney,
              Hasmoney: orderObj.Hasmoney
            })
            wx.navigateTo({
              url: '../../payment/payment?orderId=' + orderObj.OrderNumber + "&NeedMoney=" + orderObj.NeedMoney + "&Hasmoney=" + orderObj.Hasmoney,
            })
          }
        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    that.getTilist();
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
  onShareAppMessage: function (shareRes) {
    var that=this,
    page = getCurrentPages().pop();
    that.onLoad(page.options);
    let shareData = app.getShareData(1, 2), fromBtn = shareRes.from, resTarget;
    if (shareRes.from === 'button') {
      // 来自页面内转发按钮
      resTarget = shareRes.target.dataset;
      if (!app.globalData.userInfo.Username){
        that.setData({
          item: {
            showModal: true
          }
        });
        return;
      }
    }
    return {
      title: shareData.Title|| "快来一起学习" + app.globalData.exameName + "了~",
      path: `${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorage()}`,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
        // 转发成功
        if (shareRes.from === 'button'){
          app.shareRequest(resTarget.id, 1, '../../login');
        }
        
      },
      fail: function (res) {
      }
    }
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
              wx.navigateTo({
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
})