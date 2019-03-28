var app=new getApp();
import utils from '../../../utils/util.js';
var downAppApi = require('../../template/downAppTips/downAppTips');//引入消息提醒暴露的接口 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    paperId:"",
    paperObj:{},
    optionsObj:{},
    tiNum:1,
    downAppObj: {
      downAppShowToast: false,
      appName: "",
      logoImg: ""
    },
    examePattern:0,
    currSource:0//考试模式1 练习模式0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      paperId: options.paperid,
      optionsObj: options
    })
  },
  // 获取试卷详情
  getTilist: function () {
    var that = this,
      dataObj = {
        Data: {
          ID: that.data.paperId
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/TestPaper/GetPaperRules',
        method: 'post',
        dataobj: dataObj,
        callback1: that.getTilistcallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  getTilistcallback1: function (res) {
    var that = this,
      resArr = res.data.Data,
      coreObjArr=[];
      if (res.statusCode ==200) {
      if (resArr!=null) {
        var currResArr=resArr;
        currResArr.PaperRules.forEach(function(v,i){
          var coreObjList={};
          // 执业药师获取不到字段QuestionCount 设置为1
          if (!v.QuestionCount){
            v.QuestionCount=1;
            v.tiCount=false;
          }else{
            v.tiCount = true;
          }
          coreObjList.PaperRuleId=v.ID;
          coreObjList.QuestionsScore = v.QuestionsScore.indexOf("|") > -1 ? v.QuestionsScore.split("|")[0] : v.QuestionsScore;
          coreObjArr.push(coreObjList);
        
          v.QuestionsScore2 = v.QuestionsScore;
        //处理 每题的分数为“2|0.5” 取2分
          if (v.QuestionsScore && v.QuestionsScore.indexOf("|")>-1){
            v.QuestionsScore2 = v.QuestionsScore.split("|")[0];
          }
        })
        wx.setStorage({
          key: 'coreObjArr',
          data: coreObjArr,
        })
        app.globalData.datiTotaltime = currResArr.TestPaper.TestMinutes;
        app.globalData.totalScore = currResArr.TestPaper.TotalScore;
        that.setData({
          paperObj: currResArr,
        })
      }
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
  // 开始练习--刷题页面
  gotopractice:function(e){
    var that = this;
    that.setData({
      currSource : e.currentTarget.dataset.source
    })
    var dataObj = {
      Data: {
        PaperID: that.data.paperId,
        username: app.globalData.userInfo.Username,
        IsEmpty: 0,
        Source: that.data.currSource
      }
    },
      requestObj = {
        url: app.globalData.requestUrlobj.tikuapi + '/api/PaperHistory/GetLastDetail',
        method: 'post',
        dataobj: dataObj,
        callback1: that.getpracticeTihistorycallback,
        callback2: ""
      };
    if (app.globalData.userInfo.Username) {
      app.globalData.wxRequestfn(requestObj);
    } else {
     
      that.checkUserLogin(function () {
        dataObj.Data.username = app.globalData.userInfo.Username;
        app.globalData.wxRequestfn(requestObj);
      });
    }
   
    
  },
  getpracticeTihistorycallback:function(res){
    var that = this, haveDoti = 0;
       that.setData({
          examePattern:0
        })
    if (res.data.ResultCode==0){
      haveDoti = res.data.Data.LastQuestionIndex;
      app.globalData.PaperHistoryID= res.data.Data.ID;
    
      if (haveDoti>0){
       
        // 如果上次最后一道题大于0 弹框显示 是否继续
        wx.showModal({
          title: '提示',
          content: '上次已答' + haveDoti+'题，是否继续上次答题',
          success: function (resbtn) {
            if (resbtn.confirm) {
              //已答题数组
              wx.setStorage({
                key: that.data.currSource == 0 ? 'questionHistorysArr' :"examQuestionHistorysArr",
                data: res.data.Data.QuestionHistorys
              })
              //用户已答题时长
              app.globalData.usedSeconds =res.data.Data.UsedSeconds;
            } else if (resbtn.cancel) {
              haveDoti=1;
            }
            that.setData({
              tiNum: haveDoti
            })
            that.getTiList();
            return;
          }
        })
      }else{
        that.setData({
          tiNum:1
        })
        that.getTiList()
      }
    }
  },
  // 获取试题列表
  getTiList: function (){
    var that=this,
      appGlobalObj = app.globalData,
      dataObj = {
        data: {
          id: that.data.paperId,//"0e9b7967-f19e-4aeb-936b-73568aaa11b5",//
          username: appGlobalObj.userInfo.Username,
          ExamID: appGlobalObj.exameId,// "4996ad26-b559 - 4ba2-bd6a - 14bcddbea868",// 
          SubjectID: appGlobalObj.subjectId,//"5bf562fb-79d7-481a-a7a6-f3e9473a5433",// 
          SysClassId: appGlobalObj.SysClassID
        }
      },
      requestObj = {
        url: app.globalData.requestUrlobj.tikuapi + '/api/TestPaper/GetPaperRuleQuestions',
        method: 'post',
        dataobj: dataObj,
        callback1: that.getpracticeTilistcallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  // 开始练习--进入刷题页面
  getpracticeTilistcallback: function (res){
    var that=this,tiArr=[];
    if (res.data.ResultCode==0){
      var PaperRQues = res.data.Data.PaperRuleQuestions,
        MaterialTiArr=[],
        MaterialContent="",
        filterCoreObjArr=wx.getStorageSync('coreObjArr');
      PaperRQues.forEach(function(v,i){
       
        if(v.Questions && v.Questions.length>0){
          v.Questions.forEach(function(vQ,i){
            vQ.QuestionsScore = filterCoreObjArr.filter(function (item) {
              return item.PaperRuleId == v.PaperRule.ID
            })[0].QuestionsScore;
          })
        }
        var Materials = PaperRQues.Materials;
        // 材料题---处理
        if(v.Materials.length>0){
          // 循环所有材料题
          v.Materials.forEach(function(mv,mi){
            MaterialContent = mv.Material.Content;//材料
            MaterialTiArr = mv.Questions;// 材料题的题目
            MaterialTiArr.forEach(function (qv, qi) {
              qv.Content = MaterialContent + "<div style='width:100%;height:40px;'></div>" + qv.Content;
              qv.materialTi = "材料题";
            })
            tiArr.push.apply(tiArr, MaterialTiArr);
          })  
        }
        // 其它题目
        if(v.Questions.length>0){
          tiArr.push.apply(tiArr, v.Questions);
        }
      })
    }
    if (tiArr.length > 0){
   
      var that=this,appObj = app.globalData;
      if (that.data.currSource==0){
        appObj.oyearpaperTi = tiArr;//练习模式
      }else{
        appObj.oyearpaperExamTi = tiArr;//考试模式
      }
      appObj.exametitle = that.data.paperObj.TestPaper.Title;
      wx.navigateTo({
        url: '../tikupaper/tikupaper?exameid=' + appObj.exameId + '&subjectid=' + appObj.subjectId + '&tinum=' + that.data.tiNum + '&frompage=paperquestionsdetail&source=' + that.data.optionsObj.source + "&paperhistoryid=" + that.data.PaperHistoryID + "&paperid=" + that.data.paperId + "&examePattern=" + that.data.currSource
      })
    }else{
      console.log("暂无试题")
    }
  },
  // 开始考试---刷题页面 examePattern 1考试模式 0练习模式
  gototestExame:function(){
    var that = this,
     downAppObj = {
      downAppShowToast: true,
      appSign:app.globalData.signName
    };

    //downAppApi.showDownAppTips(downAppObj)引导下载App
    that.setData({
      tiNum: 1,
      examePattern: 1
     
    })
    that.getTiList()
  },
  closedownAppWindow: function () {
    var that = this;
    that.setData({
      downAppShowToast: false,

    })
  },
  // 点击跳转刷题页面
  gotonaxtpage:function(e){
  
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
    wx.setStorageSync('paperquestiondetailUrl', utils.getCurrentPageUrlWithArgs());
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
    var that=this;
    wx.setStorage({
      key: 'coreObjArr',
      data: "",
    })
    wx.setStorage({
      key: 'questionHistorysArr',
      data: "",
    })
    wx.setStorage({
      key: 'exameQuestionHistorysArr',
      data: "",
    })
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
    let shareData = app.getShareData(1, 2);
    return {
      title: shareData.Title || "快来一起学习" + app.globalData.exameName + "了~",
      path: `${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorage()}`,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})