import { VodVideo } from "../BCLVideo/video";
import utils from '../../utils/util.js';
var app = new getApp(), playTimer,
  WxParse = require('../outerFile/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/no-star.png',
    selectedSrc: '../../images/full-star.png',
    halfSrc: '../../images/half-star.png',
    frompage: "chapterPlay",
    currentTab: 1,
    livelistArr: [1, 2],
    collection: true,
    courseTitle: '',
    isShowCom: false,
    arr: [],
    classHoursid: "",
    starData:null,
    evaluateList:[],
    pageIndex:1,
    hasMoreData:true,
    bottomHeight:0,
    buttonFlag:0,
    freetime:5,
    islogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeGlobalData(options);//统一处理扫码及直接进入的参数
    //单独处理课时播放的扫码进入的参数
    if (options&&options.q) {//扫描二维码
      options.q = decodeURIComponent(options.q);
      options.id = app.getUrlParms("id", options.q);
      options.title = app.getUrlParms("title", options.q);
      options.vu = app.getUrlParms("vu", options.q);
    }
    var that = this;
    this.setData(options);
    this.setData({ isShowVideo:true});
    wx.setNavigationBarTitle({ title: options.title });
    this.setData({
      classHoursid: options.id
    })
    var chapterTopheight = 0, chapterTabheight = 0, pageHeight=0;
    wx.createSelectorQuery().select("#chapter-top-height").boundingClientRect(function (rect) {
      chapterTopheight=parseFloat(rect.height);
    }).exec()
    wx.createSelectorQuery().select("#chapter-tab-height").boundingClientRect(function (rect) {
      chapterTabheight=parseFloat(rect.height);
    }).exec()
    wx.getSystemInfo({
      success: function (res) {
        pageHeight = res.windowHeight
      }
    })  
    that.setData({
      bottomHeight: pageHeight - (chapterTopheight + chapterTabheight)
    })
   
    // 获取讲义
    this.getJiangyi(options.id);

    that.setData({
      isShowCom: app.globalData.isShowCom
    })

    app.globalData.isShowCom = true;
    that.changeGlobalIsshowCom();
    that.changeVU(app.globalData.uu, options.vu);
    that.setData({
      title: options.title
    })
    that.setData({ islogin: !!app.globalData.userInfo.Username});
    console.log(app.globalData.userInfo.Username)
    that.chapterPlayfn();//获取章节课列表
    that.getEvaluateData();
    that.getStarData();
    
   playTimer=setInterval(function () {
      var playTime = that.getVideoTime();
      if (playTime != 0) {
        that.playProgressFn(that.data.classHoursid, playTime);
      }
    }, 5000) ;
    this.showLogin(); 
    this.setData({
      item: {
        showModal: false
      }
    }); 
  },
  changeGlobalIsshowCom: function () {
    var that = this;
    that.setData({
      isShowCom: true
    })
    app.globalData.isShowCom = true;
  },
  changeVU: function (uu, vu) {
    var that = this,
      playerConf = {
        uu: uu,
        vu: vu,
        controls: '1',
        autoplay: "1"
      }
    that.chapterPlayPlayer = VodVideo(playerConf, "BLV", this);
  },
  getVideoTime: function () {
    var that = this;
    return that.chapterPlayPlayer.api.getVideoTime();
  },
  videoPause:function(){
    this.chapterPlayPlayer.api.pauseVideo();
  },  
  shutDown: function () {
    console.log("停止");
    this.chapterPlayPlayer.api.shutDown();
  },
  loadMoreEvaluateList(){
    if (!this.data.hasMoreData){
      return;
    }
    this.getEvaluateData();
  },
  //获取评价相关信息
  getEvaluateData() {
    let that = this;
    //获取评价列表
    let requestObj2 = {
      url: `${app.globalData.requestUrlobj.tikuapi}/api/Comment/GetPageChapterSectionComments`,
      method: 'post',
      dataobj: { "Data": { "PageInfo": { "CurrentPage": that.data.pageIndex, "PageCount": 0, "PageSize": 20, "RowCount": 0 }, "Query": { "FKID": that.data.classHoursid, "ModuleId": 1 } } }
    };
    app.globalData.wxRequestPromise(requestObj2).then((res) => {
      if (res.data.ResultCode == 0) {
        let pageIndex = that.data.pageIndex;
        pageIndex += 1;
        that.setData({
          pageIndex: pageIndex
        });
        that.setData({
          evaluateList: [...that.data.evaluateList, ...res.data.Data]
        })
      } else if (res.data.ResultCode == 9){
        that.setData({
          hasMoreData: false
        });
      }
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  },
  getStarData(){
    let that = this;
    //获取星级
    let requestObj = {
      url: `${app.globalData.requestUrlobj.tikuapi}/api/Comment/GetChapterSectionCommentsSummary`,
      method: 'post',
      dataobj: { "Data": { "Query": { "FKID": that.data.classHoursid, "ModuleId": 1 } } }
    };
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      that.setData({ starData: res.data.Data });
      //console.dir(that.data.starData);
    }).catch((errMsg) => {
      console.log(errMsg);
    });
  },
  // 获取讲义
  getJiangyi: function (idStr) {
    var that = this,
      requestObj = {
        url: app.globalData.requestUrlobj.apimvc+'/ZhangJieKeService/GetGrasp',
        method: 'post',
        dataobj: {
          username: app.globalData.userInfo.Username || "",
          subjectId: app.globalData.subjectId,
          ClassHoursId: idStr,
        },
        callback1: that.getappConfig,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);

  },
  getappConfig: function (res) {
    var that = this;
    if (res.data.ResultCode == 0) {
      var jiangyiHtml = res.data.Data.JiangYiHtml;
      WxParse.wxParse('jiangyiHtml', 'html', jiangyiHtml, that, 0);
    }
  },
  //获取播放时长
  playProgressFn: function (classhoursid, playTime) {
    var that = this,
      requestObj = {
        url: app.globalData.requestUrlobj.apimvc+'/ZhangJieKeService/UpdateClassHoursHistory?ClassHoursId=' + classhoursid + '&Time=' + playTime,
        method: 'get',
        dataobj: {},
        callback1: that.playProgressCallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  playProgressCallback: function (res) {
   
  },
  //章节课播放目录请求成功回调
  chapterPlayfn: function () {
    var that = this,
      requrl = app.globalData.requestUrlobj.apimvc + '/ZhangJieKeService/GetClassHours?subjectId=' + app.globalData.subjectId + "&ClassHoursId=" + that.data.classHoursid,
      requestObj = {
        url: requrl,
        method: 'get',
        dataobj: {},
        callback1: function (res) {
          var obj = res.data;
          console.log(res.data);
          if (obj.Data&&typeof obj.Data.freetime != "undefined") {
            that.data.freetime = obj.Data.freetime;
          }
          if (obj.ResultCode == 0 && obj.Data.ClassHoursList) {
            //第一级添加open状态 第一级的第一个列表添加open为false
            app.globalData.uu = obj.Data.UserUnique;            
            obj.Data.ClassHoursList.forEach(function (i, v) {
              if (i.hasOwnProperty("name")) {
                i.Title = i.Name;
              }
              that.fristLevOpen(i, v);
              //第二级、三级。。。递归循环添加open标记
              that.eachAddstatus(i);
            })
            // 默认播放的视频--添加播放中的状态
            var currArr = obj.Data.ClassHoursList;
            currArr.forEach(function (v, i) {
              v.nowplay = 1;
              if (!v.Children) {
                v.open = true;
              }
            })
            var changeObj = currArr.filter(function (item) {
              return item.Id == that.data.classHoursid;
            });
            //添加默认播放状态
            if (changeObj.length == 0) {
              currArr.forEach(function (v, i) {
                //先找到父级id
                if (v.Id == that.data.parentId && v.Children) {
                  var childrenArr = v.Children.filter(function (item) {
                    return item.Id == that.data.classHoursid;
                  }),
                    currObj = childrenArr[0];
                  if (childrenArr.length > 0) {
                    // 只有一级的添加展开状态
                    v.open = true;
                  }
                  currObj.nowplay = 0;
                  var index = childrenArr.indexOf(currObj);
                  childrenArr[index] = currObj;
                }
              })
            }
            if (changeObj.length > 0) {
              var currObj = changeObj[0];
              currObj.nowplay = 0;
              var index = currArr.indexOf(changeObj[0]);
              currArr[index] = currObj;
            }
            that.setData({ arr: currArr, videoUu: obj.Data.UserUnique });
          }
        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  //第一级添加open状态
  fristLevOpen: function (i, v) {
    if (v == 0) {
      i.open = true;
    } else {
      i.open = false;
    }
    if (!i.Children) {
      i.open = true;
    }
  },
  //递归调用 数据添加open标记  第二级、三级。。。递归循环添加open标记
  eachAddstatus: function (a) {
    var that = this;
    if (a.Children != null && a.Children.length > 0) {
      a.Children.forEach(function (i, v) {
        i.open = false;
        that.setObjfn(i);
        if (i.hasOwnProperty("Children") && i.Children !== null && i.Children.length > 0) {
          that.eachAddstatus(i);
        }
      })
    }
  },
  //修改对象属性
  setObjfn: function (i) {
    if (i.hasOwnProperty("Name")) {
      i.Title = i.Name;
    }
    if (i.hasOwnProperty("ID")) {
      i.Id = i.ID;
    }
    if (i.hasOwnProperty("QuestionCount")) {
      i.StudyCount = i.StudyCount + "人在学";
    }
    if (this.data.fromPage == "practiceList") {
      i.frompage = "practiceList";
    }
    if (this.data.fromPage == "chapterPlay" && i.hasOwnProperty("RecentClassHours")) {
      i.Children = i.RecentClassHours;
    }

  },
  //点击打开折叠列表
  openList: function (e) {
    var that = this, dataId = e.currentTarget.dataset.id;
    var arrList = that.data.arr;
    // var firstObj = obj.Data.ClassHoursList;
    arrList.forEach(function (i, v) {
      if (i.Id == dataId && i.Children != null) {
        i.open = !i.open;
        that.setData({
          arr: arrList
        })
      }
    })
  },
  // 点击购买
  gotobuy: function (e) {   

    this.data.buttonFlag=1;
    if (!app.globalData.userInfo.Username){
      this.setData({
        item: {
          showModal: true
        }
      });
      return;
    }
    //如果是苹果需要显示不支持购买 20181118
    app.iosBuyShowInfo();
    if (app.globalData.systemInfo.isIOS) return;
    
    var eObj = e.target.dataset,
      userName = typeof app.globalData.userInfo.Username != "undefined" ? app.globalData.userInfo.Username : "",//"ztk_02567647",
      subjectId = app.globalData.subjectId,
      requrl = app.globalData.requestUrlobj.apimvc + '/ZhangJieKeService/GetClassHoursBuy?username=' + userName + '&subjectId=' + subjectId + "&ClassHoursId=" + eObj.id;
    var dataObj = {},
      requestObj = {
        url: requrl,
        method: 'post',
        dataobj: dataObj,
        callback1: function studyfn(res) {
          if (res.data.ResultCode == 0) {
            app.globalData.buyTi = res.data.Data;
            wx.navigateTo({
              url: '../pay/tipay/tipay?id=' + eObj.id + "&frompage=zjk&typename=" + eObj.title,
            })
          }
        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  // 点击去播放页面 或分享按钮
  bindgotocourseplay: function (e) {
    var that = this, eObj = e.target.dataset;
    if (eObj.type == 1) {
      //课程播放页面 点击改变uuvu
      if (eObj.title) {
        that.setData({
          title: eObj.title
        })
        wx.setNavigationBarTitle({ title: eObj.title });
      }
      that.getJiangyi(eObj.id);
      that.setData({
        vu: eObj.vu
      })
      var playerConf = {
        uu: eObj.uu,
        vu: eObj.vu,
        controls: '1',
        autoplay: "1",
      };
      that.chapterPlayPlayer.api.playNewId(playerConf);
      that.setData({
        classHoursid: eObj.id
      })
      var currArr = that.data.arr,
        changeObj = currArr.filter(function (item) {
          return item.Id == eObj.id
        });
      currArr.forEach(function (v, i) {
        v.nowplay = 1;
        if (v.Children && v.Children.length > 0) {
          //第二级
          v.Children.forEach(function (vm, i) {
            vm.nowplay = 1;
            //第三级
            if (vm.Children && vm.Children.length > 0) {
              vm.Children.forEach(function (vn, i) {
                vn.nowplay = 1;
              })
            }
          })
        }
      })

      if (changeObj.length > 0) {
        // 点击的是是第一级 添加播放中的状态
        var currObj = changeObj[0];
        var index = currArr.indexOf(currObj);
        currObj.nowplay = 0;
        currArr[index] = currObj;
      }
      else if (changeObj.length == 0) {
        //点击的是第二级
        var Parent, changeObjchild;
        if (currArr && currArr.length > 0) {
          //父级 根据parentid找到父级元素
          Parent = currArr.filter(function (item) {
            return item.Id == eObj.parentid
          });
          var childrenObj = Parent[0].Children;
          if (childrenObj && childrenObj.length > 0) {
            changeObjchild = childrenObj.filter(function (item) {
              return item.Id == eObj.id
            });
            childrenObj.forEach(function (v, i) {
              v.nowplay = 1
            })
            var currChildObj = changeObjchild[0];//当前点击的对象
            var index = childrenObj.indexOf(currChildObj);
            currChildObj.nowplay = 0;
            childrenObj[index] = currChildObj;
          }
        }
      }
      that.setData({
        arr: currArr
      })
    }
    else if (eObj.type == 2 || e.detail.type == 2) {
      //点击分享按钮
      var title = eObj.title
      var myEventDetail = {
        title: eObj.title,
        id: eObj.id,
      } // detail对象，提供给事件监听函数 

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
    this.setData({
      isShowCom: app.globalData.isShowCom
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(playTimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(playTimer)
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
    let shareData = app.getShareData(1, 3);
    var that = this, title = "", fromBtn = shareRes.from, resTarget;
    title = that.data.title;
    if (shareData.Title.indexOf("${classhour_title}") !=-1 ){
      title = shareData.Title.replace('${classhour_title}',title)
    }
    if (shareRes.from === 'button') {
      // 来自页面内转发按钮
      resTarget = shareRes.target.dataset;
    }
    return {
      title: title,
      path: `${utils.getCurrentPageUrlWithArgs()}&id=${this.data.classHoursid}&${app.getLocationStorage()}`,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
        // 转发成功
        if (shareRes.from === 'button') {
         app.shareRequest(resTarget.id);
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //点击收藏按钮
  collectionfn: function (e) {


  },
  /** 
* 点击tab切换 
*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /** 
 * 滑动切换tab 
 */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /**
   * 定时若未登录 提示登录
   */
  showLogin:function(option){
    var that=this;
    if (!app.globalData.userInfo.Username){
      var showLoginInterval=setInterval(function(){  
        var time = that.getVideoTime();    
        if (time > that.data.freetime*60){
          app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs();
          that.videoPause();
          that.setData({ isShowVideo:false});
          clearInterval(showLoginInterval);
          // app.showLogin({cancel:function(){
          //   that.showLogin(option);
          // }});
          that.setData({
            item: {
              showModal: true
            }
          });
        }        
      },200);
    }
  } ,
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
                url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
              })
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
            showCancel: false,
            success:function(){
              that.onDialogCancel();
            }
          });
        }
      }
    });
  } ,
  onDialogCancel:function(){
    if (this.data.buttonFlag==0){
      wx.navigateBack({
        delta: 1
      })
    }else{
      this.setData({ item: { showModal: false } });
    }
    this.data.buttonFlag=0;
  },/**
   * 显示登录窗口
   */
  showLoginDialog: function () {
    this.data.buttonFlag=1;
    this.setData({ item:{ showModal: true } });
  }
})
