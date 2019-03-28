// pages/template/componont/myCon.js

import utils from '../../utils/util.js';
var app=new getApp();
Component({
  behaviors: [],
  /**
   * 组件的属性列表
   */
  properties: {
    showCircle:{
      type: Boolean,
      value: true
    },
    productsId:{
        type:String,
        value:null
      },
    classHoursid:{
      type: String,
      value: null
    },
    subjectTitle:{
      type: String,
      value: null
    },
      str: {            // 属性名
        type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        value:{}
      },
      arr:{
        type: Array,
        value:[]
      },
      parentId:{
        type: String,
        value: null
      },
      progressObj:{
        type: Object,
        value: null
      },
      dataIsChange:{
        type:Boolean,
        value:false,
        observer: 'getChapterfn'
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //arr: [4, 5, 6]
    str1:{},
    activeIndex:0,
    activeObj:{},
    frompage:"",
    productsId:"",
    videoUu:"",
    studyShow:false,
    fp:{},
    islogin:false
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    //章节课接口
    getChapterfn: function () {
      this.setData({ islogin: !!app.globalData.userInfo.Username});
      var callfn,requrl="",
          reData={},
          requtype = "get",
          that = this,
          userName = app.globalData.userInfo.Username||"",
          subjectId = app.globalData.subjectId;
          that.data.frompage=that.getCurrentPageUrl();
          that.setData({
            frompage: that.getCurrentPageUrl()
          });
          switch (that.data.frompage){
            case "chapterPlay":
              that.chapterPlayfn();
              break;
            case "study":
              requrl = app.globalData.requestUrlobj.apimvc + '/ZhangJieKeService/GetClassHoursCart' ;
                var  dataObj = {
                  subjectId: subjectId,
                  ExameId: app.globalData.exameId,
                  username: userName
                 },
                requestObj = {
                  url: requrl,
                  method: 'post',
                  dataobj: dataObj,
                  callback1:function studyfn(res) {
                    that.setData({videoUu: app.globalData.uu });
                    if (res.data.ResultCode==0){
                      var obj = res.data;
                      //第一级添加open状态 第一级的第一个列表添加open为false
                      if (obj.Data.ClassHoursList){
                        obj.Data.ClassHoursList.forEach(function (i, v) {
                          
                          if (i.hasOwnProperty("name")) {
                            i.Title = i.Name;
                          }
                          that.fristLevOpen(i, v)
                          //第二级、三级。。。递归循环添加open标记
                          that.eachAddstatus(i);
                        })
                        that.setData({ progressObj: obj.Data, arr: obj.Data.ClassHoursList, studyShow: true, showModal:false });
                        that.drawCircle(res.data.Data.StudyProgress);//章节进度绘制
                      } 
                    }
                  },
                  callback2: ""
                };
                  app.globalData.wxRequestfn(requestObj);
              break;
            case "practiceList":
            // 考点练习
              app.globalData.myLoading();
              var dataObj = {
                Data: {
                  UnlockType: 2,
                  username: app.globalData.userInfo.Username||"",
                  ID: app.globalData.subjectId,//科目id "867b9cbd-93b7-4d97-bb82-102b3358c7a2"
                  IsLevel: 1,
                  ApplicationID: app.globalData.SysClassID,
                }
              },
              requrl = app.globalData.requestUrlobj.tikuapi + "/api/UnlockConfig/GetSections",
              requestObj = {
                url: requrl,
                method: 'post',
                dataobj: dataObj,
                callback1: function studyfn(res) {
                  app.globalData.hideMyLoading();
                  var obj = res.data;
                  //第一级添加open状态 第一级的第一个列表添加open为false
                  if (obj.Data != null && obj.Data.length > 0) {
                    obj.Data.forEach(function (i, v) {
                      that.setObjfn(i);
                      that.fristLevOpen(i, v)
                      //第二级、三级。。。递归循环添加open标记
                      that.eachAddstatus(i);
                    })
                  }
                  that.setData({ arr: obj.Data, showModal:false});
                },
                callback2: ""
              }
              app.globalData.wxRequestfn(requestObj);
            break;
            }
    },

    //章节课播放目录请求成功回调
    chapterPlayfn:function(){
      var that=this,
        requrl = app.globalData.requestUrlobj.apimvc + '/ZhangJieKeService/GetClassHours?subjectId=' + app.globalData.subjectId + "&ClassHoursId=" + that.data.classHoursid,
      requestObj = {
        url: requrl,
        method: 'get',
        dataobj: {},
        callback1: function (res) {
          var obj = res.data;
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
            that.setData({ arr: currArr });
          }
        },
        callback2: ""
      };
      app.globalData.wxRequestfn(requestObj);
    },
    //第一级添加open状态
    fristLevOpen:function(i,v){
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
    eachAddstatus: function(a){
      var that=this;
      if (a.Children!=null&&a.Children.length>0){
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
    setObjfn:function(i){
      if (i.hasOwnProperty("Name")) {
        i.Title = i.Name;
      }
      if (i.hasOwnProperty("ID")) {
        i.Id = i.ID;
      }
      if (i.hasOwnProperty("QuestionCount")) {
        i.StudyCount = i.StudyCount + "人在学";
      }
      if (this.data.frompage =="practiceList"){
        i.frompage = "practiceList";
      }
      if (this.data.frompage == "chapterPlay" && i.hasOwnProperty("RecentClassHours")) {
        i.Children = i.RecentClassHours;
      }
     
    },
   //点击打开折叠列表
    openList:function(e){
      var that = this, dataId = e.currentTarget.dataset.id;
      var arrList = that.properties.arr;
     // var firstObj = obj.Data.ClassHoursList;
      arrList.forEach(function (i, v) {
        if (i.Id == dataId && i.Children != null){
          i.open=!i.open;
          that.setData({
            arr: arrList
          })
        }
      })
    },
    // 点击购买
    gotobuy:function(e){      
      if (app.globalData.userInfo.Username) {      
        //如果是苹果需要显示不支持购买
        app.iosBuyShowInfo();
        if (app.globalData.systemInfo.isIOS) return;  
        var eObj = e.target.dataset,
        // userName = userName = typeof app.globalData.userInfo.Username != "undefined" ? app.globalData.userInfo.Username : "",//"ztk_02567647",      
            subjectId = app.globalData.subjectId,
              requrl = app.globalData.requestUrlobj.apimvc + 'ZhangJieKeService/GetClassHoursBuy?username=' + app.globalData.userInfo.Username + '&subjectId=' + subjectId +"&ClassHoursId="+eObj.id;
          var dataObj = {},
            requestObj = {
              url: requrl,
              method: 'post',
              dataobj: dataObj,
              callback1: function studyfn(res) {
                if (res.data.ResultCode==0){
                  var dataArr=res.data.Data;
                  dataArr.OtherIsProduct=true;
                  dataArr.OtherProductName = dataArr.SaleInfo;
                  dataArr.OtherAllPrice =dataArr.OriginMoney;
                  app.globalData.buyTi = dataArr;
                  wx.navigateTo({
                    url: '../pay/tipay/tipay?id=' + eObj.id + "&frompage=zjk&typename=" + eObj.title,
                  })
                }
              },
              callback2: ""
            };
          app.globalData.wxRequestfn(requestObj);
      }
      else
      {
        this.setData({ showModal:true});
      }
    },
    // 点击去播放页面 或分享按钮
    gotocourseplay:function(e){
      var that = this, eObj = e.target.dataset || e.detail;
      if (eObj.type == 1 || e.detail.type==1){
        //点击播放按钮
        if (that.data.frompage == "study") {
          wx.navigateTo({
            url: '../chapterPlay/chapterPlay?id=' + eObj.id + '&uu=' + app.globalData.uu+'&vu=' + eObj.vu + '&title=' + eObj.title,
          })
        } else {
          //课程播放页面 点击改变uuvu
          var myEventDetail = {
            uu: e.detail.uu || eObj.uu,
            vu: e.detail.vu || eObj.vu,
            id: e.detail.id || eObj.id,
            type: e.detail.type || eObj.type,
            title: e.detail.title || eObj.title
          } // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          this.triggerEvent('myevent', myEventDetail);
          var currArr = that.data.arr,
            changeObj = currArr.filter(function(item){
              return item.Id == myEventDetail.id
            });
            currArr.forEach(function (v, i) {
              v.nowplay = 1
            })
            if (changeObj.length>0){
              var currObj = changeObj[0];
              currObj.nowplay = 0;
              var index = currArr.indexOf(changeObj[0]);
              currArr[index] = currObj;
            }
            if (changeObj.length==0) {
              currArr.forEach(function (v, i) {
                v.nowplay = 1
                if(v.Children){
                  v.Children.forEach(function(v,i){
                    v.nowplay = 1
                  })
                }
              })
            }
          that.setData({
            arr: currArr
          })
        }
      }
      else if (eObj.type == 2 || e.detail.type == 2){
        //点击分享按钮
        var title = eObj.title
        var myEventDetail = {
          title: e.detail.title || eObj.title,
          id: e.detail.id || eObj.id,
          customcallback: function () {
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
   
    changeNowplay:function(){

    },
    //获取页面信息
    getCurrentPageUrl:function (){
        var pages = getCurrentPages()    //获取加载的页面
        var currentPage = pages[pages.length - 1]    //获取当前页面的对象
        return currentPage.data.frompage
    },
    // 跳转到做题页面
    gotodoti: function (e) {
      var that=this,chapterId = e.currentTarget.dataset.chaperid;//章节id
      if (app.globalData.userInfo.Username) {
        wx.navigateTo({
          url: '../fliterquestion/fliterquestion?chapterid=' + chapterId,
        })
      } else {
        // that.checkUserLogin(function () {
        //   wx.navigateTo({
        //     url: '../fliterquestion/fliterquestion?chapterid=' + chapterId,
        //   })
        // });
        that.setData({ showModal:true});
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

    // 章节进度条
    drawCircle: function (data) {
      var that = this;
      var cxt_arc = wx.createCanvasContext('canvasArcCir',this);//创建并返回绘图上下文context对象。
      //绘制背景灰色的圆圈
      cxt_arc.setLineWidth(4);
      cxt_arc.setStrokeStyle('#d2d2d2');
      cxt_arc.setLineCap('round');
      cxt_arc.beginPath();//开始一个新的路径 
      cxt_arc.arc(50, 50, 40, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径 
      cxt_arc.stroke();//对当前路径进行描边 
      //绘制蓝色的圆圈 ----根据进度条的变化
      cxt_arc.setLineWidth(4);
      cxt_arc.setStrokeStyle('#58a6f8');
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath();//开始一个新的路径 
      cxt_arc.arc(50, 50, 40, -Math.PI * 1 / 2, 2 * Math.PI * data / 100 - Math.PI * 1 / 2, false);
      cxt_arc.stroke();//对当前路径进行描边 
      cxt_arc.draw();
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
                app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs();
                if (that.data.studyShow){//首页 章节课 需切换TAB
                  wx.switchTab({
                    url: '/pages/my/my',
                    success: function () {
                      wx.navigateTo({
                        url: `/pages/login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
                      });
                    }
                  });
                }else{
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
    showLoginDialog: function () {
      console.log(app.globalData.userInfo);
      this.setData({ showModal: true });
    }
    
  },
  ready: function () {    
    var that=this;
    if(app.globalData.userInfo.Username){
      this.getChapterfn();      
      this.setData({ islogin: true });
    }else{
      app.hideGetUserInfo({ callback:function(){
        that.getChapterfn();
        that.setData({ islogin: !!app.globalData.userInfo.Username });
      }});
    }
    this.setData({ showModal: false });
  }
  
})
