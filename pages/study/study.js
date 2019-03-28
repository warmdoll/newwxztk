var feedbackApi = require('../commonjs/showToast');//引入消息提醒暴露的接口  
var downAppApi= require('../template/downAppTips/downAppTips');//引入消息提醒暴露的接口 
var app = new getApp();
import utils from '../../utils/util.js';
var interval;
var varName;
Page({
  data: {
    frompage: "study",
    title: "",
    exameId:"",
    subjectTitle: app.globalData.subjectName,
    subjectId:'',
    signName:"",
    ModulesObj: [],
    getUpGradesObj:{},
    getmodulefn: true,
    practiceObj:{
      Data:{
          date:'2018年1月23日',
          isdoti:true,
          dotititle:"去做题",
          importantLevel:3,
          questionLabel: [{ title: '高频题', color: "#5b95f4" }, { title: '易错题', color: "#e93a3f" },{ title: '必刷题', color: "#83c23d" }],
      },
      Message:'成功',
      isShow:true,
      ResultCode:0,
      
      
    },
    open:true,
    getChapter: {},
    isShowCom:false,
    downAppObj:{
      downAppShowToast: false,
      appName: "",
      logoImg:""
    },
    showCircle: true,
    isFirst:false,
    dataIsChange:false
    
  },
  closedownAppWindow:function(){
    var that=this;
    that.setData({
      downAppShowToast:false,
      showCircle: true
    })
    
  },
  onLoad: function (options) {
    app.changeGlobalData(options);//统一处理扫码及直接进入的参数
    var that = this,
      globalData = app.globalData;
      that.setData({
        title: globalData.exameName,
        exameId: globalData.exameId,
        subjectId: globalData.subjectId,
        subjectTitle: globalData.subjectName,         
        isShowCom:app.globalData.isShowCom
      })
    app.globalData.myLoading();
      // that.getMessage();
      that.getmodulefn();//获取模块
      
      if (!app.globalData.userInfo.Username) {
        app.hideGetUserInfo({
          callback:function(){
            that.getChapterfn();
            that.getUpGradesfn();//升级服务
            that.data.isFirst = true;
          }
        });
      }else{
        that.getChapterfn();
        that.getUpGradesfn();//升级服务
        that.data.isFirst = true;
      }
      this.getProtocolData();
      app.onShow(options)

      wx.setNavigationBarTitle({ title: this.data.title });
      // that.getMessage();
      that.setData({
        isShowCom: app.globalData.isShowCom
      });      
  },
  getProtocolData(){ //获取用户协议信息
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/Protocol/GetCommonProtocol?Id=`,
      method: 'post',
      dataobj: {
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      if (res.data.ResultCode == 0) {
        app.globalData.protocolData.title = res.data.Data.Title;
        app.globalData.protocolData.url = res.data.Data.Url;
      }
      app.globalData.hideMyLoading();
    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
    });
  },
  
  // 获取模块的接口
  getmodulefn:function(){
    //获取classsId
    var that=this,
        dataurl = app.globalData.requestUrlobj.appconfig + '/service/GetAppconfigs?ClassId=' + that.data.exameId+'&DeviceType=0&VersionNo=100',
          requestObj = {
            url: dataurl,
            method: 'get',
            dataobj: {},
            callback1: function (res) {
              app.globalData.hideMyLoading();
              if (res.data.ResultCode == 0) {
                //请求成功修改moduleArray模块对象
                var index = 0;
                var moduleArray = res.data.Data.Modules;
                var newArray = [];
                while (index < moduleArray.length) {
                  newArray.push(moduleArray.slice(index, index += 4));
                }
                that.setData({
                  ModulesObj: newArray,
                  signName: res.data.Data.sign
                })
               
              } else {
                //提示框
                that.setData({
                  getmodulefn: false
                })
              }
            },
            callback2: function(){
              that.setData({
                getmodulefn: false
              })
          }
          };
        app.globalData.wxRequestfn(requestObj);

  },
  // 模块跳转页面
  jumptoPage:function(e){
    var that=this,clickCurrobj = e.currentTarget.dataset;
    that.navigateHref(clickCurrobj);
  },
  //区别模块跳转页面
  navigateHref: function (clickCurrobj){
    var clickCurr = clickCurrobj.title;
    var exameId = app.globalData.exameId,//考试id
      subjectId = app.globalData.subjectId,//科目id
      typeAction = parseInt(clickCurrobj.typeaction);

    switch (typeAction){
      case 0:
      // 每日一练
        wx.navigateTo({
          url: '../tiku/everydaylist/everydaylist?exameid=' + exameId + "&subjectid=" + subjectId +"&tinum=1",
            
        })
      break;
      case 1:
      // 考点练习
        wx.navigateTo({
          url: '../tiku/practiceList/practiceList?exameid=' + exameId + "&subjectid=" + subjectId + "&tinum=1"
        })
      break;
      case 2:
      // 历年真题
        wx.navigateTo({
          url: '../tiku/oyearpaperlist/oyearpaperlist?exameid=' + exameId + "&subjectid=" + subjectId + "&papertype=0" + "&tinum=1&source=0"
        })
      break;
      case 3:
      // 模拟试题

        wx.navigateTo({
          url: '../tiku/oyearpaperlist/oyearpaperlist?exameid=' + exameId + "&subjectid=" + subjectId + "&papertype=1" + "&tinum=1&source=1"
        })
      break;
      case 4:
      // 高频题库
      var that=this;
        if (app.globalData.userInfo && app.globalData.userInfo.Username) {
          wx.navigateTo({
            url: '../tiku/highfrequencytiku/highfrequencytiku?exameid=' + exameId + "&subjectid=" + subjectId + "&tinum=1"
          })
        } else {
          that.checkUserLogin(function () {
            wx.navigateTo({
              url: '../tiku/highfrequencytiku/highfrequencytiku?exameid=' + exameId + "&subjectid=" + subjectId + "&tinum=1"
            })
          });
        }
       
      break;
      default:
        var that=this,downAppObj={
          downAppShowToast: true,
          appSign: that.data.signName
        }
        that.setData({
          showCircle:false
        })
        downAppApi.showDownAppTips(downAppObj)
        
        // wx.showModal({
        //   title: '',
        //   content: '请下载准题库APP继续学习',
        //   showCancel: false,
        //   confirmText: "我知道了",
        //   success: function (resbtn) {
        //     if (resbtn.confirm) {
        //     } 
        //   }
        // })
      // case 6:
      // // 精品三套卷----引导下载app
      
      //   break;
      // case 5:
      // // 错题练习---引导下载app
     
      //   break;
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
    });
  },
  //答题数量接口 升级服务 需要传入Data对象 post请求
  getUpGradesfn:function(){
    var that=this,
      dataObj={
        Data:{
          Username: app.globalData.userInfo.Username,
          ExamID: that.data.exameId,
          SubjectID: that.data.subjectId
        },
        SystemCode:"",
        Token: ""
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/SysClassEstimate/GetUpGrades',
        method: 'post',
        dataobj: dataObj,
        callback1: function (res) {
          //请求成功修改getUpGradesObj模块对象
          //截取---免费答题的字符串
          that.data.isFirst=false;
          if (res.data.ResultCode == 0) {
            var resObj = res,
              strContent = resObj.data.Data.Content,
              splitContetn = strContent.substr(strContent.indexOf("已免费体验答题"));
            resObj.data.Data.Content = splitContetn;
            if (res.data.ResultCode == 0) {
              that.setData({
                getUpGradesObj: res.data
              })
            }

          }

        },
        callback2: ""
      };
      app.globalData.wxRequestfn(requestObj);
  },
  // 点击升级服务
  gotoupgtade:function(){
    wx.navigateTo({
      url: '../tiku/upgradeservice/upgradeservice',
    })
  },
  //章节课接口
  getChapterfn:function(){
    var that=this;
    that.setData({
      isShowCom: true
    })
    app.globalData.isShowCom = true;
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
  // 测试升级服务
  gotoupgra:function(){
    wx.navigateTo({
      url: '../tiku/upgradeservice/upgradeservice',
    })
  },
  // 点击去播放页面
  gotocourseplay: function (e) {
    var that = this, eObj = e.target.dataset;
    if (that.data.fromPage == "study") {
      wx.navigateTo({
        url: '../chapterPlay/chapterPlay?&vu=' + eObj.vu,
      })
    } else {
      //课程播放页面 点击改变uuvu
      var playerConf = {
        uu: "a91d451d26",
        vu: eObj.vu,
        controls: '1',
        autoplay: "1",
      };
      var player = VodVideo(playerConf, "BLV", this);
      player.sdk.setAutoReplay(true);

    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //修改NavigationBar标题
    var that=this;
    wx.setNavigationBarTitle({ title: this.data.title });
    // that.getMessage();
    that.setData({
      isShowCom: app.globalData.isShowCom
    })    
    if (!that.data.isFirst){
      that.getUpGradesfn();//升级服务
      that.getChapterfn();
      that.setData({ dataIsChange: !that.data.dataIsChange });
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
  getShareFn: function (res) {
    var page = getCurrentPages().pop();
    if (res.data.ResultCode == 0) {
      if (page == undefined || page == null) return;
      page.onLoad(page.options);
    }
    else if (res.data.ResultCode == 2) {
      wx.showModal({
        title: '',
        content: res.data.Message,
        showCancel: false,
        confirmText: "我知道了",
        success: function (resbtn) {
          if (resbtn.confirm) {
            if (page == undefined || page == null) return;
            page.onLoad(page.options);
          }
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this, title, fromBtn = res.from,resTarget;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      resTarget = res.target.dataset;
      title = res.target.dataset.title;
      if (!app.globalData.Username) {
        //需要提示登录
      }
    }else{
      title = "快来一起学习" + app.globalData.exameName+"了~";
    }
    let shareData = app.getShareData(1,1);
    return {
      title: shareData.Title || title,
      path: utils.getCurrentPageUrlWithArgs() + "?" + app.getLocationStorage(),
      imageUrl: shareData.ImageUrl,
      success: function (res) {
        // 转发成功
        if (fromBtn=== 'button'){
          app.shareRequest(resTarget.id);
        }
       
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
 
  onMyEvent:function(e){
    console.log(e.detail)
  },
  //点击选择科目
  gotoSelecsubject:function(){
    var that=this;
    app.globalData.subjectName="";
    that.setData({
      subjectTitle:""
    })
    wx.redirectTo({
      url: '../subject/subject?exameid=' + that.data.exameId + "&frompage=study"
    })
  },
  bindChange:function(){
 
  }
})