import { VodVideo } from "../../BCLVideo/video";
import utils from '../../../utils/util.js';
var feedbackApi = require('../../template/showToast/showToast'),//引入消息提醒暴露的接口 
  tikuCommonObj = require('tikufn'),//试卷返回按钮弹出框
      app = new getApp(), ansyContentArr = [], count = 0,
          WxParse = require('../../outerFile/wxParse/wxParse.js'),
              touchDotX = 0, touchDotY = 0, touchMove = 0, pointcompareX = 100, pointcompareY=70,//触摸时的原点 
              tmpFlag = true,// 判断左右滑动超出菜单最大值时不再执行滑动事件
              countPlay = 0,count=0,
              selectedName = [], currTiid = "", totalTinum=0,rightTinum=0,
  app = new getApp(), ansyContentArr = [], count = 0,
    WxParse = require('../../outerFile/wxParse/wxParse.js'),
    touchDotX = 0, touchDotY = 0, touchMove = 0, pointcompareX = 100, pointcompareY=70,//触摸时的原点 
tmpFlag = true,// 判断左右滑动超出菜单最大值时不再执行滑动事件
countPlay = 0,count=0,
selectedName = [], currTiid = "", totalTinum = 0, rightTinum = 0, settimmer,
selectedOptionId=[];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ansyPlayer:null,
    tiData: [],
    tiId:"",
    anysId:"",//解析id
    swiperData: [],
    totalTi: 0,//总题数
    currTinum: 1,
    selectedObj:[],
    ansyContentArr:[],
    sourseFrom:'',
    autoplay:false,
    changeWrongshow:false,
    doNote:false,
    currentbigTab:"1",
    currentTab:0,
    ansyHeight:0,
    swiperitemWidth:0,
    swiperOuterwidth:0,
    moveLeft:true,
    swiperLeft:0,
    changeWrong: [{ id: 1, tag: false, name: "含有错别字" },
                  { id:2,tag: false, name: "答案不正确" },
                  { id: 3, tag: false, name: "题目不完整" }, 
                  { id: 4, tag: false, name: "图片不存在" },
                  { id: 5, tag: false, name: "解析不完整" }, 
                  { id: 6, tag: false, name: "其它错误" } 
                  ],
    optionsObj:{},
    myNotelist:[],//自己的笔记
    otherNotelist:[],//其它用户的笔记
    tiType:"",//试题类型
    currSwiperHeight:0,//当前题的高度
    showfontAnsylist:true,//文字解析显示状态
    showvideoAnsylist: false,//文字解析显示状态
    resaultTi: [
      { type: 1, QuestionType: "单选题", tiArr: [],rightTinum:[],wrongTinum:[] },
      { type: 2, QuestionType: "多选题", tiArr: [], rightTinum: [], wrongTinum:[]},
    ],
    rightRate:0,//正确率
    resaultTistatus:false,
    answerSheet:false,//是否显示答题卡
    nodata:false,//没有数据时 显示暂无数据
    everyDay:true,
    currHeight:0,
    erroMoreNumber:'',//易错选项,
    tifooter:false,//如果显示全部解析，隐藏刷题的底部
    sourceNum:0,
    currNoteContent:"",//修改笔记的内容
    showVideoModel:false,
    isClickDati:false,
    isPaperExame:false,//考试模式
    timeEnd:"",
    timeSecond:"",
    haveTime:0,
    examePatternStatu:false,
    submitPaper:false,//提交答题结果
    allanalyze:false
  },
  onLoad: function (options) { 
    var that = this, tiNum;
    wx.hideShareMenu();
    if (typeof options.examePattern != "undefined" && options.examePattern == 1) {
      that.setData({
        examePatternStatu: true
      })
      wx.setNavigationBarTitle({
        title: "考试模式"//页面标题为路由参数
      })
    }
    that.getRectWidth();
    app.globalData.tiDay = options.day;
    var topHeight = 0,bottomHeight=0,swiperHeight;
    // 刚进入页面添加加载中的状态
    
    if (that.data.swiperData.length == 0) {
      app.globalData.myLoading("加载中...")
    }
    //点击题号跳转到对应题目
    tiNum = options.tinum;
    if (typeof tiNum !== "undefined") {
      that.setData({
        currentbigTab: options.tinum,
        currTinum: options.tinum,
        tiData: app.globalData.tiObj.length > 0 ? app.globalData.tiObj : []
      })
    }
    
    that.getIntoPage(options);
    // 显示笔记列表
    //that.showNote(); 在获取完数据回调
    //that.showotherNote();

  },
 
//刚进入页面
 getIntoPage:function(options){
  var that=this;
  var frompageObj = [
    { id: 1, frompage: "filterquestion", title: "章节练习" },
    { id: 2, frompage: "paperquestionsdetail", title: "练习模式" },
    { id: 3, frompage: "highfrequencytiku", title: "高频数据" },
    { id: 4, frompage: "everydaylist", title: "每日一练" }
  ],
    arrId = "", apptiObj = [];
  // 来自试题筛选页面 章节练习
  that.setData({
    optionsObj: options,
    everyDay: false
  })
  // 如果是点击交卷过来的
  if (typeof options.frombtn != "undefined" && options.frombtn == "jiaojuan") {
    var that = this;
    //显示答题结果
    that.rightRatabox();
    that.setData({
      resaultTistatus: true,
    })
  }
  if (typeof options.frompage != "undefined" && options.frompage == "filterquestion") {
    arrId = 1;
    apptiObj = app.globalData.tiObj;
    // 如果是点击交卷过来的
    if (typeof options.frombtn != "undefined" && options.frombtn == "jiaojuan") {
      that.setData({
        swiperData: apptiObj,
        tiData: apptiObj,
        swiperData: apptiObj,
        totalTi: apptiObj.length,
        swiperOuterwidth: parseFloat(wx.getSystemInfoSync().windowWidth) * apptiObj.length,
        tiType: that.tiTypefn(apptiObj[options.tinum - 1].QuestionType),
      })
      that.htmlChangeView();
    }else{
      that.formcommonFn(apptiObj);
    }
    that.setData({
      sourceNum: 1
    })
  }
  //历年真题
  else if (typeof options.frompage != "undefined" && options.frompage == "paperquestionsdetail") {
    //"0"是历年真题 1是模拟试题   //examePattern 1是考试模式
   
    that.setData({
      sourceNum: options.source == "0"?6:7,
      paperid: options.paperid,
      isPaperExame: options.examePattern == 1,
      tifooter: options.examePattern == 1
    })
    if (typeof options.footer != "undefined" && options.footer == 1) {
      
      that.setData({
        tifooter: true,
        isPaperExame: false
      })
     
    }
    arrId = 2;
    apptiObj = options.examePattern == 1 ? that.square(app.globalData.oyearpaperExamTi) : that.square(app.globalData.oyearpaperTi);
    if (that.data.isPaperExame){
      apptiObj.forEach(function(v,i){
        if (v.mySelected && v.mySelected.replace(/(^\s*)|(\s*$)/g, "") !== ""){
          v.ansyShow = true;
        }
        v.ansyShow2 = false;
      })
    }

    that.formcommonFn(apptiObj);
    // 如果是从显示全部解析过来 或者 已提交试卷从题号点击过来----显示全部解
    if (typeof options.allanalyze != "undefined" && options.allanalyze == "1" || typeof options.footer != "undefined" && options.footer == 1){
      
      var zhenTiArr = app.globalData.tiObj;
      if (zhenTiArr.length>0){
        zhenTiArr.forEach(function (v, i) {
          v.ansyShow=true;
          v.ansyShow2= true;
        })
        that.setData({
          swiperData: zhenTiArr,
          tifooter:true,
          isPaperExame:false,
          allanalyze: options.allanalyze == 1
        })
      
      }
      
    }
  }
  // 高频题库
  else if (typeof options.frompage != "undefined" && options.frompage == "highfrequencytiku") {
    arrId = 3;
    that.setData({
      sourceNum: 5
    })
    // 如果是点击交卷过来的
    if (typeof options.frombtn != "undefined" && options.frombtn == "jiaojuan") {
      apptiObj = app.globalData.tiObj;
      that.setData({
        swiperData: apptiObj,
        tiData: apptiObj,
        swiperData: apptiObj,
        totalTi: apptiObj.length,
        swiperOuterwidth: parseFloat(wx.getSystemInfoSync().windowWidth) * apptiObj.length,
        tiType: that.tiTypefn(apptiObj[options.tinum - 1].QuestionType),
      })
      that.htmlChangeView();
    }else{
      that.fromhighfrequency();
    }
  }
  // 每日一练
  else if (typeof options.frompage != "undefined" && options.frompage == "everydaylist") {
    arrId = 4;
    that.setData({
      everyDay: true,
      sourceNum: 3
    })
    apptiObj = app.globalData.tiObj;
    if (typeof options.retest != "undefined" && options.retest == "1"){
      that.getTilist(options);
      return;
    }
    if (apptiObj.length == 0){
      that.getTilist(options);
      return;
    }else{
      that.setData({
       swiperData :app.globalData.tiObj
      })
    }
    // 如果是点击交卷过来的
    if (typeof options.frombtn != "undefined" && options.frombtn == "jiaojuan") {
      var apptiObj=app.globalData.tiObj;
      that.setData({
        swiperData: apptiObj,
        tiData: apptiObj,
        swiperData: apptiObj,
        totalTi: apptiObj.length,
        swiperOuterwidth: parseFloat(wx.getSystemInfoSync().windowWidth) * apptiObj.length,
        tiType: that.tiTypefn(apptiObj[options.tinum - 1].QuestionType),
      })
      that.htmlChangeView();
    }
  }
  var currArray = frompageObj.filter(function (item) {
    return item.id == arrId
  })
  if (typeof options.examePattern != "undefined" && options.examePattern == 1){
   
    that.setData({
      examePatternStatu:true
    })
    console.log(that.data.examePatternStatu)
    wx.setNavigationBarTitle({
      title: "考试模式"//页面标题为路由参数
    })
  }else{
    wx.setNavigationBarTitle({
      title: currArray[0].title//页面标题为路由参数
    })
  }
 
  // 如果是从答题卡页面点击重新测试过来的
  that.fromeveryday(that.data.optionsObj, apptiObj);
  // 隐藏加载中状态
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
   
 },
//从章节练习 历年真题页面来的 处理函数
  formcommonFn: function (parmeArr){
    var that=this;
   if (parmeArr.length > 0) {
    //  如果是从答题卡过来的---直接取数据 不处理数据
     if (typeof that.options.answersheet != "undefined" && that.options.answersheet == "1") {
       that.setData({
         swiperData: parmeArr
       })
       return;
     } else {
       that.setData({
         tiDay: that.square(parmeArr)
       })
       that.dataOperfn(that.data.tiDay)
     }
     that.setData({
       nodata: false,
     })
    
   } else {
     // 如果没有数据 改变nodata的状态
     that.setData({
       nodata: true,
     })
   }
 },
  //  高频题库进入页面处理函数
  fromhighfrequency:function(){
    var that=this,
      optionsObj = that.data.optionsObj,
      dataObj = {
        Data: {
          SubjectID: app.globalData.subjectId,
          DifficultyRate: optionsObj.difficultyrate,
          username: app.globalData.userInfo.Username || "",
          IsEmpty: optionsObj.isempty,
          DifficultError: optionsObj.difficulterror,
          DifficultType: optionsObj.difficulttype,
        },
      },
      requestObj = {
        url: app.globalData.requestUrlobj.tikuapi + '/api/Question/GetDifficultQuestion',
        method: 'post',
        dataobj: dataObj,
        callback1: that.getdifficultQcallback1,
        callback2: ""
      };
    if (typeof optionsObj.answersheet != "undefined" && optionsObj.answersheet == "1") {
      var apptiObj=app.globalData.tiObj;
      that.setData({
        tiData: apptiObj,
        swiperData: apptiObj,
        totalTi: apptiObj.length,
        swiperOuterwidth: parseFloat(wx.getSystemInfoSync().windowWidth) * apptiObj.length,
        swiperLeft: -(parseInt(wx.getSystemInfoSync().windowWidth) * (optionsObj.tinum - 1)),
        tiType: that.tiTypefn(apptiObj[optionsObj.tinum - 1].QuestionType),
      })
      that.htmlChangeView();
      that.optionsChangehtml();
    }else{
      app.globalData.wxRequestfn(requestObj);
    }
   
    
  },
  // 从答题卡页面来的 处理函数
  fromeveryday: function (options, apptiObj){
    var that=this;
    // 从答题卡过来的 不再重新请求数据
    if (apptiObj.length>0){
      that.setData({
        nodata:false
      })
    }
    if (typeof options.answersheet != "undefined" && options.answersheet == "1") {
      that.setData({
        tiData: apptiObj,
        swiperData: apptiObj,
        totalTi: apptiObj.length,
        swiperOuterwidth: parseFloat(wx.getSystemInfoSync().windowWidth) * apptiObj.length,
        swiperLeft: -(parseInt(wx.getSystemInfoSync().windowWidth) * (options.tinum - 1)),
        tiType: that.tiTypefn(apptiObj[options.tinum - 1].QuestionType),
      })
      that.htmlChangeView();
    }
    that.optionsChangehtml();
  },
  // 获取高频题库
  getdifficultQcallback1:function(res){
    var that=this;
    app.globalData.hideMyLoading();
    if (res.data.ResultCode==0){
      that.setData({
        tiData: res.data.Data
      })
      var lastdataArr = that.square(res.data.Data);//筛选后的题型
      //数据添加题号
      that.dataOperfn(lastdataArr);
    }else{
      // 如果没有数据 改变nodata的状态
      that.setData({
        nodata: true,
      })
    }
  },
  // 获取题目
  getTilist: function () {
    var that = this,
      dataObj = {
        Data: {
          Username: app.globalData.userInfo.Username||"",
          ExamID: that.data.optionsObj.exameid,
          SubjectID: that.data.optionsObj.subjectid,
          Day: that.data.optionsObj.day
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/EverydayTest/GetQuestions',
        method: 'post',
        dataobj: dataObj,
        callback1: that.getTilistcallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  // 对数组的操作---去除主观题
  square: function (itemArr) {
    var that=this,chanArr = [];
    if (itemArr.length > 0) {
      app.globalData.hideMyLoading("加载中...")
      itemArr.forEach(function (item, v) {
        if (item.QuestionType < 5) {
          that.setData({
            nodata: false
          })
          chanArr.push(item)
        }else{
          // 如果没有数据 改变nodata的状态
          that.setData({
            nodata: true
          })
        }
      });
      return chanArr;
    }
  },
  getTilistcallback1: function (res) {
    var that = this,
      result = res.data,
      dataArr = result.Data;//请求的所有数据
    if (result.ResultCode == 0 && dataArr!=null) {
      app.globalData.hideMyLoading("加载中...")
      var lastdataArr = that.square(dataArr);//筛选后的题型
      //数据添加题号
      that.dataOperfn(lastdataArr);
    }else{
      // 如果没有数据 改变nodata的状态
      that.setData({
        nodata:true
      })
    }
  },
  // 数据的操作
  dataOperfn: function (lastdataArr){
    var that = this, swiperArr = [];//前三条数据
    if (lastdataArr.length > 0) {
      lastdataArr.forEach(function (iobj, v) {
        iobj.tiNum = (v + 1);
        ansyContentArr.push(iobj.TextAnalysis); //解析内容放入数组
        iobj.ansyShow =false; // 是否显示解析
        iobj.ansyShow2 = false;
        iobj.mySelected = "";// 是否被选中
        iobj.mySelectedoptions="",
        iobj.selectedOptionId="",
        iobj.rightDaan = "";// 题的正确答案--数组
        iobj.tiTypetext = that.tiTypefn(iobj.QuestionType);
        iobj.erroRate = ((1 - iobj.WrongRate) * 100).toFixed(2);
        iobj.active = true; 
        iobj.doRight=0;
        // 正确答案处理
        var rightArr = [];
        if (iobj.Options&&iobj.Options.length>0){
       
          iobj.Options.forEach(function (v, i) {
            v.isStatus = false;
           
            v.addindex = i;
            //每个题的所有正确答案存放在rightDaan---字符串存储 IsRight=1是正确答案
            if (v.IsRight == 1) {
              rightArr.push(v.Name);
              iobj.rightDaan = rightArr.join(",");
            }
          })
        }
        // 如果是第一题则 存放1，2t
        if (v <that.data.currentbigTab){
            swiperArr.push(iobj);
          }
      })
      that.setData({
        tiId: swiperArr[that.data.currentbigTab-1].ID,
        tiType: that.tiTypefn(swiperArr[that.data.currentbigTab - 1].QuestionType),
      })
    }
    app.globalData.tiObj = that.square(lastdataArr);
    
    var questionHistorysArr = that.data.examePatternStatu ? wx.getStorageSync('examQuestionHistorysArr'):wx.getStorageSync('questionHistorysArr');
    console.log(questionHistorysArr)
    if (questionHistorysArr && questionHistorysArr.length>0){
      swiperArr.forEach(function(v,i){
        var currObj = questionHistorysArr.filter(function (item) {
          return item.QuestionID == v.ID
        });
        if (currObj.length>0){
          v.mySelected = currObj[0].UserOptionsName;
          v.mySelectedoptions = currObj[0].UserOptionsName;
          v.selectedOptionId = currObj[0].UserOptionsID;
          if (!that.data.isPaperExame){
            v.ansyShow2 = true;
            v.ansyShow = true;
          }
         
        }
      })
    }
    that.setData({
      tiData: lastdataArr,
      swiperData: swiperArr,
      totalTi: lastdataArr.length,
    })
    that.htmlChangeView();
    that.optionsChangehtml();
    //调整 在这儿回调显示笔记/解析  lxw 20180518
    that.showNote();
    that.showotherNote();
  },
  // 题干 选项 解析的html代码转化
  htmlChangeView:function(){
    var that=this;
        //题干转html
    for (var i = 0; i < that.data.tiData.length; i++) {
      WxParse.wxParse('reply' + i, 'html', that.data.tiData[i].Content, that);
      if (i === that.data.tiData.length - 1) {
        WxParse.wxParseTemArray("replyTemArray1", 'reply', that.data.tiData.length, that)
      }
    }
    // that.data.tiData.forEach(function (obj, i) {
    //   for (var i = 0; i < obj.Options.length; i++) {
    //     WxParse.wxParse('reply' + i, 'html', obj.Options[i].Content, that);
    //     if (i === obj.Options.length - 1) {

    //       WxParse.wxParseTemArray("replyTemArray2", 'reply', obj.Options.length, that)
    //     }
    //   }
    // })
    // 试题解析转html
    for (var i = 0; i < that.data.tiData.length; i++) {
      WxParse.wxParse('reply' + i, 'html', that.data.tiData[i].TextAnalysis, that);
      if (i === that.data.tiData.length - 1) {
        WxParse.wxParseTemArray("replyTemArray", 'reply', that.data.tiData.length, that)
      }
    }
    if (that.data.swiperData.length > 0) {
      setTimeout(function () {
        wx.hideLoading()
      })
    }
  },
   //选项转html
  optionsChangehtml:function(){
    var that=this,currIndex = that.data.currentbigTab;
    if (that.data.swiperData.length>0){
      var currArr = that.data.swiperData[that.data.currentbigTab - 1];
      currArr.Options.forEach(function (v, i) {
        WxParse.wxParse('reply' + i, 'html', v.Content, that);
        if (i === currArr.Options.length - 1) {
          WxParse.wxParseTemArray("replyTemArray2", 'reply', currArr.Options.length, that)
        }
      })
      that.judgmentErroOptions(currArr.Options)
    }
   
  },
  // 判断易错选项
  judgmentErroOptions: function (optionsArr) {
    var that = this, optionName="", selectCount = 0;
    optionsArr.forEach(function (v, i) {
      // 从错误选项中找出被点击次数最多的
      if (v.IsRight == 0) {
        if (v.SelectCount > selectCount){
          optionName = v.Name;
        }
        selectCount = v.SelectCount > selectCount ? v.SelectCount : selectCount;
      }
      that.setData({
        erroMoreNumber: optionName
      })
    })
  
  },
  // 题型转换---
  tiTypefn:function(num){
    var tiType="";
    // 单项选择题 = 1, 多项选择题 = 2, 不定项选择题 = 3, 判断题 = 4, 填空题 = 6, 简述题 = 7, 报关题 = 8,
    switch (num){
      case 1:
        tiType ="单选题";
      break;
      case 2:
        tiType = "多选题";
        break;
      case 3:
        tiType = "不定项选择题";
      break;
      case 4:
        tiType = "判断题";
        break;
      case 6:
        tiType = "填空题";
        break;
      case 7:
        tiType = "简述题";
        break;
      case 8:
        tiType = "报关题";
        break;

    }
    return tiType;
  },
  /** 
* 滑动切换tab 
*/
  // 触摸开始事件 
  touchStart: function (e) {
    touchDotX= e.touches[0].pageX; // 获取触摸时的原点 
    touchDotY = e.touches[0].pageY;
    
  },

  touchMove:function(){
   
  },
  // 触摸结束事件 
  touchEnd: function (e) {
    var that=this,moveLeft=that.data.moveLeft,
        curr = parseInt(that.data.currentbigTab),
        swiperArr = that.data.swiperData,
        touchMove = e.changedTouches[0].pageX,
        touchMoveY = e.changedTouches[0].pageY;
    if (Math.abs(touchMove - touchDotX) < 80){
      return;
    }
    if (Math.abs(touchMoveY - touchDotY) / Math.abs(touchMove - touchDotX)>0.58){
      return;
    }
    //上下滑动
    // if (Math.abs(touchMove - touchDotX) < Math.abs(touchMoveY - touchDotY)){
    //   return;
    // }
    if (touchMove - touchDotX < 0 && curr < that.data.tiData.length){
      //如果是试卷模式
      // 右滑---改变当前num margin-left值  
      var swiperData = that.data.swiperData;
      // 如果答案为空---直接滑动到下一题 如果答案不为空----第一次显示解析 第二次滑动到下一题
        that.data.tiData.forEach(function (i, v) {
          if (v > (swiperData.length-1)&&v < (2 + parseInt(e.currentTarget.dataset.current))) {
            swiperArr.push(i)
          }
          if (i.rightDaan === i.mySelected) {
            i.doRight = 1;
          } else {
            i.doRight = 0;
          }
        })
        
        that.setData({
          swiperData: swiperArr,
        })
        //考试模式 第一次滑动多选题
        if (count == 0 && that.data.isPaperExame) {
          var currObj = that.data.tiData[curr];
          if (!currObj.ansyShow) {
            selectedName = [];
            selectedOptionId = [];
          }
          that.setData({
            tiType: that.tiTypefn(currObj.QuestionType),
            currentbigTab: curr + 1
          });
          selectedName = [];
          selectedOptionId = [];
          // 选项转html
          that.optionsChangehtml();
          var selectedOptions=app.globalData.tiObj.filter(function(item){
            return item.tiNum == curr
          })[0];
          that.submitOption(selectedOptions);
        }
        if (count == 0 && !that.data.isPaperExame) {
          // 改变当前题解析的显示状态--显示
          swiperData.forEach(function (v, i) {
            if (v.tiNum == curr) {
              that.setData({
                tiId: v.ID
              })
              if (v.mySelected.replace(/(^\s*)|(\s*$)/g, "") !== ""){
                // 如果当前题已被做---显示解析count++ 标记是第一次滑动已完成
                
                if (v.ansyShow){
                  that.setData({
                    tiId: v.ID,
                    tiType: that.tiTypefn(v.QuestionType),
                    currentbigTab: curr + 1,
                  });
                  that.setData({
                    currNoteContent: "请输入笔记"
                  })
                  selectedName=[];
                  selectedOptionId=[];
                  // 选项转html
                  that.optionsChangehtml();
                  return;
                }
                  v.ansyShow = true;
                  v.ansyShow2 = true;
                if (v.rightDaan === v.mySelected) {
                  v.doRight = 1;
                } else {
                  v.doRight = 0;
                }
              
                that.setData({
                  swiperData: swiperData,
                });
                // 显示笔记列表
                that.showNote();
                that.showotherNote();
                that.submitOption();
                setTimeout(function () {
                  count++;
                })

              }else{
                // 如果当前题未被做---滑动到下一题
                that.setData({
                  tiId: v.ID,
                  tiType: that.tiTypefn(v.QuestionType),
                  currentbigTab: curr + 1,
                });
                // 选项转html
                that.optionsChangehtml();
                selectedName = [];
                selectedOptionId=[];
                that.setData({
                  currNoteContent: "请输入笔记"
                })
                
              }
            }
          })
          // 显示笔记列表
          if (that.data.examePatternStatu) {
            var swiperData = that.data.swiperData;
            swiperData.forEach(function (v, i) {
              if (v.tiNum == curr) {
                that.setData({
                  tiId: v.ID
                })
              }
            })
            that.showNote();
            that.showotherNote();
          }                                                             
        }else{
           //第二次滑动--开启滑动事件
          // 改变当前题解析的显示状态---隐藏
          var currObj = that.data.tiData[curr];
          if (!currObj.ansyShow) {
            selectedName = [];
            selectedOptionId = [];
          }
          that.setData({
            tiType: that.tiTypefn(currObj.QuestionType),
            currentbigTab: curr + 1
          });
          that.setData({
            currNoteContent: "请输入笔记"
          })
          selectedName = [];
          selectedOptionId = [];
          // 选项转html
          that.optionsChangehtml();
          // 显示笔记列表
          that.showNote();
          that.showotherNote();
          count = 0;
        }
      
    }
    //右滑 如果是最后一道题-- 如果已选答案--显示解析-跳转页面 如果未选答案--跳转页面
    else if (touchMove - touchDotX < 0  && curr==that.data.swiperData.length){
      rightTinum = 0; totalTinum = 0;count=0;
      var currSelected=that.data.tiData.filter(function(item){
       return item.tiNum==curr
      })
      
      // 正确率弹出框的数据处理
      if (currSelected[0].mySelected !== ""){
        var swiperData = that.data.swiperData;
        swiperData.forEach(function(v,i){
          if (v.tiNum == curr){
            v.ansyShow = true;
            v.ansyShow2 = true;
          }
        })
        that.setData({
          swiperData: swiperData
        })
        // 显示笔记列表
        that.showNote();
        that.showotherNote();
      }else{
        var swiperData = that.data.swiperData;
        swiperData.forEach(function (v, i) {
          if (v.tiNum == curr) {
            v.ansyShow = false;
            v.ansyShow2 = false;
          }
        })
        that.setData({
          swiperData: swiperData
        })  
      } 

        if (typeof that.data.optionsObj.frompage != "undefined" && that.data.optionsObj.frompage == "paperquestionsdetail") {
          wx.navigateTo({
            url: '../evaluationReport/evaluationReport?source=' + that.data.optionsObj.source + "&examePattern=" + that.data.optionsObj.examePattern
          })
          return;
        } else {
          that.setData({
            resaultTistatus: true
          })
          //显示答题结果
          that.rightRatabox();
        } 
      
    } 
    // 左滑
    else{
      // 左滑---改变当前num margin-left值  
      count = 0;
      if (curr==1){
        return;
      }
      var currObj = that.data.tiData[curr-2];
      that.setData({
        tiType: that.tiTypefn(currObj.QuestionType),
        currentbigTab: curr - 1,
      });
      that.setData({
        currNoteContent: "请输入笔记"
      })
      selectedName = [];
      selectedOptionId = [];
      // 滑动到第一题
      if (that.data.currentbigTab==1){
        that.setData({
          swiperLeft:0
        })
      }
      // 选项转html
      that.optionsChangehtml();
      // 显示笔记列表
      that.showNote();
      that.showotherNote();
    }
    // else if (Math.abs(touchMove - touchDotX) < pointcompareX&&Math.abs(touchMoveY - touchDotY) > pointcompareY){
    //   return;
    // }
  },
  // 正确率弹出框数据处理
  rightRatabox:function(){
    var that=this;
    that.setData({
      swiperData: app.globalData.tiObj
    })
    var resaultTi = that.data.resaultTi;
    resaultTi.forEach(function (v, i) {
      v.tiArr = that.data.swiperData.filter(function (item) {
        return item.QuestionType == v.type
      })
      v.rightTinum = that.data.swiperData.filter(function (item) {
        return item.doRight == 1 && item.QuestionType == v.type
      })
      v.wrongTinum = that.data.swiperData.filter(function (item) {
        return item.doRight == 0 && item.QuestionType == v.type
      })
    })
    that.setData({
      resaultTi: resaultTi
    })
    that.data.resaultTi.forEach(function (v, i) {
      totalTinum += v.tiArr.length;
      rightTinum += v.rightTinum.length;
    })
    that.setData({
      rightRate: ((rightTinum / totalTinum) *100).toFixed(2)
    })
  },
  //考试模式 点击提交
  submitPaper:function(){
    var that=this;
    wx.redirectTo({
      url: '../evaluationReport/evaluationReport?source=' + that.data.optionsObj.source + "&examePattern=" + that.data.optionsObj.examePattern
    })
    that.setData({
      isClickDati: true,
      submitPaper:true
    })
   
  },
  // 点击答案 选中状态处理
  selectedDaan: function (e) {
    var that = this, selectedObj=[],
      currData = that.data.swiperData,
      optionName = e.currentTarget.dataset.name,
      optionId = e.currentTarget.dataset.id;
    if (currData[that.data.currentbigTab - 1].ansyShow || currData[that.data.currentbigTab - 1].ansyShow){
        return;
      }
    currData.forEach(function (vobj, j) {
      // 找到当前题
      // 单选
      if (vobj.QuestionType == 1 && !vobj.ansyShow) {
        vobj.Options.forEach(function (v, i) {
          v.isStatus = false;
        })
      }
      
      if (vobj.ID == e.currentTarget.dataset.parentsid && !vobj.ansyShow) {
   
        vobj.Options.forEach(function (v, i) {
          // 当前点击的选项
          if (v.ID === e.currentTarget.dataset.id) {
            if (!v.isStatus){
              v.isStatus =true;
              if (vobj.QuestionType == 1){
                selectedName=[];
                selectedOptionId = [];
              }
              if (!(selectedName.indexOf(optionName)>-1)){
                selectedName.push(optionName);
              }
              if (!(selectedOptionId.indexOf(optionId) > -1)) {
                selectedOptionId.push(optionId);
              }
             
            }else{
              v.isStatus = false;
              // 取消选项 删除数组中的选项
              Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                  if (this[i] == val) return i;
                }
                return -1;
              };
              Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                  this.splice(index, 1);
                }
              };
              selectedName.remove(optionName);
              selectedOptionId.remove(optionId);
            }
            selectedName = selectedName.sort();
            vobj.mySelected = selectedName.join("");
            vobj.selectedOptionId = selectedOptionId.join(",");

            that.setData({
              selectedObj: selectedObj,
              selectedOptionId: selectedOptionId,
            })
            app.globalData.tiObj[j].mySelected = selectedName.join("");
            app.globalData.tiObj[j].mySelectedoptions = selectedName.join(",");
            app.globalData.tiObj[j].selectedOptionId = selectedOptionId.join(","); 
            //如果是试卷的考试模式(单选)---点击答案后跳转下一题并提交答题记录
            if (that.data.isPaperExame && app.globalData.tiObj[j].QuestionType==1){
              setTimeout(function(){
                that.isPaperExameFn(app.globalData.tiObj[j]);
                that.optionsChangehtml();
                selectedName = [];
                selectedOptionId = [];
                that.setData({
                  currNoteContent: "请输入笔记"
                })
              },200)
            
            }
            
          }

        })
      }
     
    })
    that.setData({
      swiperData: currData
    })
  },
  //试卷的考试模式
  isPaperExameFn:function(v){
    var that = this, swiperArr = that.data.swiperData;
    //点击答案--滑动到下一题
    //提交历史记录
    that.submitOption(v);
    that.data.tiData.forEach(function (i, v) {
      if (v > (that.data.swiperData.length - 1)) {
        swiperArr.push(i)
      }
      if (i.rightDaan === i.mySelected) {
        i.doRight = 1;
      } else {
        i.doRight = 0;
      }
    })

    that.setData({
      swiperData: swiperArr,
    })
    that.setData({
      tiId: v.ID,
      tiType: that.tiTypefn(v.QuestionType),
      currentbigTab: v.tiNum + 1,
    });

  },
  //选中答案--提交选项
  submitOption: function (obj) {
    var that=this,
        optionObj = {}, 
        UserOptionsName="",
        UserOptionsID="",
        requestObj={},
        sourse = that.data.sourseFrom,
        isRight=0,
        questionId = "", mySelectedoptions = "", selectedOptionId="",
        currObj = that.data.isPaperExame ? obj:that.data.swiperData[that.data.currentbigTab-1],
        questionId = currObj.ID,
        mySelectedoptions = currObj.mySelectedoptions,
        selectedOptionId = currObj.selectedOptionId,
        doRight = currObj.doRight,
    optionObj={
            Data: {
              Username: app.globalData.userInfo.Username,
              PaperHistoryID: app.globalData.PaperHistoryID,
              QuestionID: questionId,
              Source: that.data.sourceNum,
              IsRight: doRight,//正确1
              UserOptionsName: mySelectedoptions,
              UserOptionsID: selectedOptionId
            }
        };
        requestObj = {
          url: 'https://tikuapi.wangxiao.cn/api/QuestionHistory/UpdateUserQuestionHistory',
          method: 'post',
          dataobj: optionObj,
          callback1: that.submitOptioncallback1,
          callback2: ""
        };
    app.globalData.wxRequestfn(requestObj);

  },
  submitOptioncallback1:function(res){
    if (res.data.ResultCode==0){
      var that=this,UserOptionsName="",
        selectedObj = that.data.selectedObj;
      selectedObj.forEach(function (v, i) {
        UserOptionsName=v.name+" ";
        v.ansyShow=true;
      })
      that.setData({
        selectedObj: selectedObj
      })
    }
  },
  // 点击收藏试题
  collectedfn:function(){
    var that=this,
        currNum=that.data.currentbigTab,//当前题号
      questiobnId = that.data.swiperData.filter(function(vm){
        return vm.tiNum == currNum
      }),
      dataObj={
        Data: {
          QuestionID: questiobnId[0].ID,
          Username: app.globalData.userInfo.Username || "",
        }
      },
      requestUrl = app.globalData.requestUrlobj.tikuapi + '/api/UserCollect/Insert',
      requestObj = {
        url: requestUrl,
        method: 'post',
        dataobj: dataObj,
        callback1: that.getuserCollectcallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);   
  },
  getuserCollectcallback:function(res){
    if (res.data.ResultCode==0){
      wx.showToast({
        title: "收藏成功",
        icon: 'success',
        duration: 2000
      })
    }
  },
  //点击查看答案
  showAny:function(e){
    //根据当前题号显示当前题的答案
    var that=this,currNum = e.currentTarget.dataset.num;
    var tiDataObj = that.data.swiperData;
        tiDataObj.forEach(function (v, i) {
          if (i == parseInt(currNum - 1) && !v.ansyShow){
            v.ansyShow = !v.ansyShow;
          //  根据选项判断是否被做题
            var isDoti=v.Options.filter(function(item){
              return item.isStatus
            })
            if (isDoti.length==0){
              v.mySelected = "mm";
            }
            
          }
          if (i == parseInt(currNum - 1)) {
            v.ansyShow2 = !v.ansyShow2;
          }
        })
        that.setData({
          swiperData: tiDataObj
        })
  },
  //点击试题纠错
  selectedWrong:function(e){
    var that=this,
      changWroArr = that.data.changeWrong;
    changWroArr.map(function(v,i){
      // 查找当前点击的元素
      if (v.id == e.currentTarget.dataset.id){
        v.tag=!v.tag;
      }
      return v;
    })
    that.setData({
      changeWrong: changWroArr
    })
  },
  // 显示试题纠错
  showsubmitWrongFn : function(){
    var that = this;
    that.closeWindow();
  },
  //提交试题纠错
  submitWrongFn:function(e){
    var that = this, returnErroarr=0;
    // 判断是否已选中纠错类型
    that.data.changeWrong.map(function(v,i){
                          if(v.tag){
                            returnErroarr++;
                          }
                        })
    if (returnErroarr==0){
      that.testToast("请选择纠错类型");
      return;
    }
    if (e.detail.value.textarea == "") {
      that.testToast("请输入纠错内容");
      return;
    }
    // 提交纠错记录
    var tiId = that.data.tiData.filter(function (item) {
       return item.tiNum == that.data.currentbigTab;
      }),
      typeName="", 
      dataObj = {
        Data: {
          ChapterID:"",
          SectionID:"",
          ExamID: that.data.optionsObj.exameid,
          SubjectID: that.data.optionsObj.subjectid,
          Username: app.globalData.userInfo.Username || "",
          QuestionID: tiId[0].ID,
          content: e.detail.value.textarea,
          TypeName: that.typeNamefn()
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/QuestionCorrection/Insert',
        method: 'post',
        dataobj: dataObj,
        callback1: that.submitWrongFncall,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  typeNamefn:function(){
    var typenameStr=[];
    this.data.changeWrong.forEach(function (v, i) {
      if (v.tag) {
        typenameStr.push(v.name);
      }
    })
    return JSON.stringify(typenameStr);
  },
  submitWrongFncall:function(res){
    var that=this;
    if (res.data.ResultCode==0){
      wx.showToast({
        title: res.data.Message,
        icon: 'success',
        duration: 2000
      })
    }
    else if (res.data.ResultCode == 3){
      wx.showToast({
        title:"请勿重复添加",
        icon: 'success',
        duration: 2000
      })
    }
    that.setData({
      changeWrongshow:false
    });
  },
  reticloseWindow:function(){
    var that = this;
    that.setData({
      resaultTistatus: false
    })
  },
  // 关闭遮罩层
  closeWindow:function(){
    var that = this;
    that.setData({
      changeWrongshow: !that.data.changeWrongshow
    })
  },
  // 显示答题卡
  showOptionpage:function(){
    var that=this,tiDataArr = this.data.tiData,newDataarr=[];
    tiDataArr.forEach(function(v,i){
      that.data.swiperData.forEach(function(swV,swI){
        //如果两个对象相同 swiper中的元素替换tiData中的元素
        if (v.ID == swV.ID) {
          tiDataArr.splice(i, 1, swV);
          }
      })
      
    })
    app.globalData.tiObj = tiDataArr;

    //跳转到答题卡页面
    that.gotoAnswersheet();
    
  },
  gotoAnswersheet:function(){//跳转到答题卡页面
    var that=this;
    // 如果是每日一练进入的页面
    if (typeof that.data.optionsObj.frompage != "undefined" && that.data.optionsObj.frompage == "everydaylist"){
      wx.redirectTo({
        url: '../answerSheet/answerSheet?exameid=' + that.data.optionsObj.exameid + "&subjectid=" + that.data.optionsObj.subjectid + "&day=" + that.data.optionsObj.day + "&frompage=everydaylist",
      })
      return;
    }
    // 考点练习
    if (typeof that.data.optionsObj.frompage != "undefined" && that.data.optionsObj.frompage == "filterquestion")   {
      
      wx.redirectTo({
        url: '../answerSheet/answerSheet?exameid=' + that.data.optionsObj.exameid + "&subjectid=" + that.data.optionsObj.subjectid + "&frompage=filterquestion",
      })
      return;
    }
    //高频题库
    if (typeof that.data.optionsObj.frompage != "undefined" && that.data.optionsObj.frompage == "highfrequencytiku") {
      var that = this,
        optionsObj = that.data.optionsObj,
        IsEmpty = optionsObj.isempty,//如果已做题大于总题数则为1
        DifficultType = optionsObj.difficulttype,//区别高频考点 高频易错
        DifficultyRate = optionsObj.difficultyrate,//高频考点的考点频率
        DifficultError = optionsObj.difficulterror;//高频易错的考点频率
      wx.redirectTo({
          url: '../answerSheet/answerSheet?exameid=' + that.data.optionsObj.exameid + "&subjectid=" + that.data.optionsObj.subjectid + "&frompage=highfrequencytiku&tinum=1&isempty=" + IsEmpty + "&difficulttype=" + DifficultType + "&difficultyrate=" + DifficultyRate + "&difficulterror=" + DifficultError
        })
        return;
      }
      //历年真题
    if (typeof that.data.optionsObj.frompage != "undefined" && that.data.optionsObj.frompage == "paperquestionsdetail") {
     wx.redirectTo({
        url: '../answerSheet/answerSheet?exameid=' + that.data.optionsObj.exameid + '&subjectid='+ that.data.optionsObj.subjectid + '&frompage=paperquestionsdetail&examePattern=' + that.data.optionsObj.examePattern,
      })
      return;
    } 
  } ,
  
  // 隐藏答题卡
  closeAnsersheet:function(){
    var that=this;
    that.setData({
      answerSheet: false
    })
  },
  // 显示自己笔记列表  显示热门解析
  showNote:function(){
    var that=this,
     tiId = that.data.tiData.filter(function (item) {
        return item.tiNum == that.data.currentbigTab
    });
    if (tiId.length==0)return;
    var dataObj = {
      Data: {
        Username: app.globalData.userInfo.Username || "",
        QuestionID: tiId[0].ID,
      }
    },
      requestObj = {
      url: 'https://tikuapi.wangxiao.cn/api/QuestionAnalysis/GetHotQuestionAnalysis',
        method: 'post',
        dataobj: dataObj,
        callback1: that.showNotecallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  showNotecallback:function(res){
    var that=this;
    if (res.data.ResultCode==0){
      var resArr = res.data.Data;
      // v.ApproveStatus的状态判断 修改赞和踩的状态
      resArr.forEach(function (v, i) {
        that.approveStatus(v);
      })
      that.setData({
        myNotelist: resArr,
        anysId: res.data.Data[0].ID
      })
    }else{
      that.setData({
        myNotelist: []
      })
    }
  },
  // 记一笔
  doNotefn: function (e) {
    var that = this,
      currTargetObj = e.currentTarget.dataset;
    currTiid = currTargetObj.tiid;
    that.setData({
      doNote: !that.data.doNote,
      tiId: currTiid
    })
    if (currTargetObj.status == "re-do") {//=->==  20180519 lxw
      that.setData({
        currNoteContent: currTargetObj.content
      })
    }
  },
  // 记笔记
  bindFormSubmit: function (e) {
    // 提交笔记
    var that = this;
    if (e.detail.value.textarea == "请输入笔记"){
      that.testToast("请填写笔记");
      return;
    }
    if (e.detail.value.textarea == "") {
      that.testToast("笔记不能为空");
      return;
    }
    
    // 如果已经提交过笔记 传解析id 如果没有提交过笔记---传题id 
     var  dataObj = that.data.myNotelist.length>0?{
        Data: {
          Username: app.globalData.userInfo.Username,
          ID: that.data.anysId ,
          content: e.detail.value.textarea
        }
      }:{
          Data: {
            Username: app.globalData.userInfo.Username,
            QuestionID: currTiid,
            content: e.detail.value.textarea
          }
      },
      requestObj = {
        url: that.data.myNotelist.length > 0 ?"https://tikuapi.wangxiao.cn/api/QuestionAnalysis/Update" : 'https://tikuapi.wangxiao.cn/api/QuestionAnalysis/Insert',
        method: 'post',
        dataobj: dataObj,
        callback1: function (res) {
          if (res.data.ResultCode == 0) {
            wx.showToast({
              title: "笔记提交" + res.data.Message,
              icon: 'success',
              duration: 2000
            })
            that.showNote();
            that.setData({
              currNoteContent: e.detail.value.textarea
            })

          }
          else if (res.data.ResultCode == 2) {
            wx.showToast({
              title: "请勿重复添加",
              icon: 'success',
              duration: 2000
            })
          }
          else if (res.data.ResultCode == 3) {
            wx.showModal({
              title: '',
              content: res.data.Message,
              showCancel:false,
              confirmColor:"#58a6f8",
              success: function (res) {
                if (res.confirm) {
                } else if (res.cancel) {
                }
              }
            })
          }
          that.closeWindowcur();
        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },

  // 删除笔记
  deleatNotefn:function(e){
    var that=this, ansyID = e.currentTarget.dataset.id,
    // 删除笔记---传解析id 
    dataObj = {
      Data: {
        Username: app.globalData.userInfo.Username || "",
        ID: ansyID,
      }
    },
      requestObj = {
      url:'https://tikuapi.wangxiao.cn/api/QuestionAnalysis/Delete',
        method: 'post',
        dataobj: dataObj,
        callback1: that.deleatNoteCallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  deleatNoteCallback:function(res){
    if (res.data.ResultCode==0){
      wx.showToast({
        title: "删除成功",
        icon: 'success',
        duration: 2000
      })
    }
    this.setData({
      myNotelist:[]
    })
  },
  // 显示其他人的笔记列表
  showotherNote: function () {
    var that = this,
      tiId = that.data.tiData.filter(function (item) {
        return item.tiNum == that.data.currentbigTab
      }),
      dataObj = {
        Data: {
          PageInfo:1,
          PageCount:0,
          PageSize:100,
          Query:{
            Username: app.globalData.userInfo.Username||"",
            QuestionID: tiId[0].ID,
          }
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/QuestionAnalysis/GetPage',
        method: 'post',
        dataobj: dataObj,
        callback1: that.showotherNotecallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  showotherNotecallback: function (res) {
    var that = this;
    if (res.data.ResultCode == 0) {
      var resArr = res.data.Data;
      // v.ApproveStatus的状态判断 修改赞和踩的状态
      resArr.forEach(function(v,i){
        that.approveStatus(v);
      })
      that.setData({
        otherNotelist: resArr
      })
    } else {
      that.setData({
        otherNotelist: []
      })
    }
  },
  // v.ApproveStatus的状态判断 修改赞和踩的状态
  approveStatus:function(v){
    switch (v.ApproveStatus){
      case 2:
        v.zanSatatus = 0;
        v.caiSatatus = 0
      break;
      case 0:
        v.zanSatatus = 0;
        v.caiSatatus = 1;
      break;
      case 1:
        v.zanSatatus = 1;
        v.caiSatatus = 0;
      break;
    }
  },
  // 关闭笔记弹出框
  closeWindowcur:function(e){
    var that = this;
    that.setData({
      doNote: false
    })
  },
// 点赞功能
  proveFn : function(e){
    var that = this, eObj = e.currentTarget.dataset,
      // 解析ID
      ansyID = eObj.id,
      // 区分点赞1 还是踩0
      approveStatus = eObj.approvestatus,
      // action区分当前点击的状态---首次状态通过修改点赞列表的数组----
      //获取笔记列表后添加action ApproveStatus=2时 点赞和踩都为灰action都为=0
      //              1时 点赞亮起,赞的action为1踩的action为0 
      //               0时 踩亮起,赞的action为0踩的action为1
      actionNum = eObj.action,
      //  来自于自己的笔记 还是其他人的笔记
      personObj = eObj.person,
      // 删除笔记---传解析id 
      dataObj = {
        Data: {
          AnalysisID : ansyID,
          ApproveStatus: approveStatus,
          action: 0,
          Username: app.globalData.userInfo.Username||"",
        }
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/Approve/Approve',
        method: 'post',
        dataobj: dataObj,
        callback1: function (res) {
          if (res.data.Data.ResultCode == 0) {
            if (personObj=="my"){
            // 自己的笔记
              var myNotelist = that.data.myNotelist;
              myNotelist.forEach(function(v,i){
                if (v.ID == ansyID){
                  // 当前点击的是赞
                  if (approveStatus==1){
                    v.zanSatatus = v.zanSatatus==0?1:0;
                  }else{
                    v.zanSatatus = v.caiSatatus == 0 ? 1 : 0;
                  }
                }
                that.setData({
                  myNotelist: myNotelist
                })
              })
            }else{
              // 其它人的笔记
              var otherNotelist = that.data.otherNotelist;
              otherNotelist.forEach(function (v, i) {
                if (v.ID == ansyID) {
                  // 当前点击的是赞
                  if (approveStatus == 1) {
                    v.zanSatatus = v.zanSatatus == 0 ? 1 : 0;
                  } else {
                    v.zanSatatus = v.caiSatatus == 0 ? 1 : 0;
                  }
                }
                that.setData({
                  otherNotelist: otherNotelist
                })
              })
            }
          }
        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  // tab标签切换
  /** 
   * 点击tab切换 
   */
  videoPlay:function(){

  },
// 暂停视频
  pauseVideo: function () {
    this.ansyPplayer.api.pauseVideo();
  
  },
  //恢复视频
  resumeVideo: function () {
   
    this.ansyPplayer.api.resumeVideo()
  },
  swichNav: function (e) {
    var that = this;
   // that.getRectHeight('.analysis-list-item');
    // 点击视频解析---添加播放器
    // 根据题号找到当前题的对象
    // var currTiarr = that.data.tiData.filter(function (item) {
    //   return item.tiNum == that.data.currentbigTab
    // })
    // var playerConf = {
    //   uu: e.target.dataset.uu,
    //   vu: e.target.dataset.vu,
    //   controls: '1',
    //   autoplay: "1",
    // }
    var playerConf = {
      uu: e.target.dataset.uu,
      vu: e.target.dataset.vu,
      controls: '1',
      autoplay: "1",
    }
    if (e.target.dataset.current=="0" ) {
    
      that.setData({
        showfontAnsylist: true,
        showvideoAnsylist:false
      })
      that.pauseVideo();
      return false;
    } else {
      that.setData({
        showfontAnsylist: false,
        showvideoAnsylist: true,
        showVideoModel:true
      })
      that.ansyPplayer = VodVideo(playerConf, "BLV", this);
      that.resumeVideo(); 
    }
  },
  hiddenVideoModel(){
    this.setData({
      showVideoModel: false
    })
    this.ansyPplayer.api.pauseVideo();
  },
  //获取列表的宽度
  getRectWidth: function () {
    var that = this;
    that.setData({
      swiperitemWidth: (wx.getSystemInfoSync().windowWidth)
    })
    
  },
// 提示框
  testToast: function (titletext) {
     feedbackApi.showToast({ title: titletext})//调用  
  }, 
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {

  },
  onReady: function () {
   var that=this;
   that.countDown();
   //if (typeof that.data.optionsObj.frompage != "undefined" && that.data.optionsObj.frompage == "paperquestionsdetail") {
  //  if (that.data.isPaperExame){
  //    var that = this, currTime, datiTotaltime;
  //    //考试剩余时间（分钟）app.globalData.datiTotaltime
  //    currTime = app.globalData.usedSeconds;
  //   datiTotaltime = app.globalData.datiTotaltime*60;
  //   settimmer = setInterval(function () {
  //     that.setData({
  //       timeSecond: currTime++,//答题已用时间
  //       timeEnd: parseInt(that.data.optionsObj.examePattern) == 1 && datiTotaltime - (currTime++)!=0 ? tikuCommonObj.paperExameObj.changeTime(datiTotaltime - (currTime++)) : 0
  //     })
  //   }, 1000)
  // }
},
countDown:function(){
  var that = this;
  //if (typeof that.data.optionsObj.frompage != "undefined" && that.data.optionsObj.frompage == "paperquestionsdetail") {
  if (that.data.isPaperExame) {
    var that = this, currTime, datiTotaltime;
    //考试剩余时间（分钟）app.globalData.datiTotaltime
    currTime = app.globalData.usedSeconds;
    datiTotaltime = app.globalData.datiTotaltime * 60;
    settimmer = setInterval(function () {
      currTime++;
      that.setData({
        timeSecond: currTime,//答题已用时间
        timeEnd: parseInt(that.data.optionsObj.examePattern) == 1 && datiTotaltime - (currTime) != 0 ? tikuCommonObj.paperExameObj.changeTime(datiTotaltime - (currTime)) : 0
      })
    }, 1000)
  }
},
submitTiDetail:function(){
  var that = this, fromPage = that.data.optionsObj.frompage, havedotiCount = 0, sortCount = 0, xuanzeTotal = 0;

  that.data.swiperData.forEach(function (v, i) {
    if (v.mySelected !== "") {
      havedotiCount += 1;

    }
    //选择题总分
    if (v.QuestionType == 1 || v.QuestionType == 2) {
      xuanzeTotal += parseFloat(v.QuestionsScore)
    }
    //单选分数计算
    if (v.doRight == 1 && v.QuestionType == 1) {
      sortCount += parseFloat(v.QuestionsScore);
    }
    //多选
    if (v.doRight == 1 && v.QuestionType == 2) {
      sortCount += parseFloat(v.QuestionsScore);
    }

    if (that.data.isPaperExame) {
      //试卷分数
      app.globalData.isPaperExameStatus = true;
      //得分
      app.globalData.examSortCount = xuanzeTotal / app.globalData.totalScore * sortCount;
    } else {
      app.globalData.isPaperExameStatus = false;
    }

  });
  var tikuparmObj = {
    frompage: fromPage,
    paperHistoryid: app.globalData.PaperHistoryID,
    currentTinum: that.data.currentbigTab,
    havedotiCount: havedotiCount,
    source: that.data.optionsObj.source,
    paperId: that.data.paperid,
    userScore: sortCount,
    usedSeconds: that.data.timeSecond
  };
  if (that.data.isPaperExame) {
    //如果是考试模式 退出考场时记录已用时长
    tikuCommonObj.paperExameObj.haveUsedTimne(tikuparmObj);
    if (fromPage && fromPage == "paperquestionsdetail" && !that.data.isClickDati) {
      tikuCommonObj.tikuObj.backPage(tikuparmObj);
    }

    return;

  }
  //如果是试卷相关题库--点击返回页面按钮---弹出框
  if (fromPage && fromPage == "paperquestionsdetail" && !that.data.isClickDati && !that.data.examePatternStatu) {
    tikuCommonObj.tikuObj.backPage(tikuparmObj);
  }
},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this, fromPage = that.data.optionsObj.frompage, havedotiCount=0,sortCount=0,xuanzeTotal=0;
   
    that.data.swiperData.forEach(function(v,i){
      if(v.mySelected!==""){
        havedotiCount+=1;
        
      }
      //选择题总分
      if (v.QuestionType == 1 || v.QuestionType == 2){
        xuanzeTotal += parseFloat(v.QuestionsScore)
      }
    //单选分数计算
      if (v.doRight==1&&v.QuestionType==1){
        sortCount += parseFloat(v.QuestionsScore);
      }
      //多选
      if (v.doRight == 1 &&v.QuestionType == 2) {
        sortCount += parseFloat(v.QuestionsScore);
      }
      
      if (that.data.isPaperExame){
        //试卷分数
        app.globalData.isPaperExameStatus=true;
        //得分
        app.globalData.examSortCount = xuanzeTotal / app.globalData.totalScore * sortCount;
      }else{
        app.globalData.isPaperExameStatus = false;
      }
    });
    var tikuparmObj = {
      frompage: fromPage,
      paperHistoryid: app.globalData.PaperHistoryID,
      currentTinum: that.data.currentbigTab,
      havedotiCount: havedotiCount,
      source:that.data.optionsObj.source,
      paperId: that.data.paperid,
      userScore: sortCount,
      usedSeconds:that.data.timeSecond
    };
    clearInterval(settimmer);
    if (that.data.isPaperExame && !that.data.allanalyze) {
      //如果是考试模式 退出考场时记录已用时长
      tikuCommonObj.paperExameObj.haveUsedTimne(tikuparmObj);
      if (fromPage && fromPage == "paperquestionsdetail"){
        if (that.data.examePatternStatu && that.data.submitPaper) {
          tikuparmObj.havedotiCount = 0
        }
        tikuCommonObj.tikuObj.backPage(tikuparmObj);
      }
     
      return;
      
    }
    //如果是试卷相关题库--点击返回页面按钮---弹出框
    if (fromPage && fromPage == "paperquestionsdetail" && !that.data.isClickDati && !that.data.allanalyze) {
      tikuCommonObj.tikuObj.backPage(tikuparmObj);
    }
  },
  stopDati:function(){
    //tikuCommonObj.paperExameObj.stopDati();//点击倒计时 停止答题
    var that=this;
    clearInterval(settimmer);
    var currTimeSecond = that.data.timeSecond;
    wx.showModal({
      title: '',
      content: "已用时" + tikuCommonObj.paperExameObj.changeTime(currTimeSecond)+"请休息一下",
      showCancel: false,
      confirmColor: "#58a6f8",
      confirmText:"继续做题",
      success: function (res) {
        if (res.confirm) {
          var currTime, datiTotaltime;
          datiTotaltime = app.globalData.datiTotaltime;
          settimmer = setInterval(function () {
            that.setData({
              timeSecond: currTimeSecond++,//答题已用时间,
              timeEnd: tikuCommonObj.paperExameObj.changeTime((datiTotaltime * 60 - (currTimeSecond++)) ? datiTotaltime * 60 - (currTimeSecond++):0)
            })
          }, 1000)
        } else if (res.cancel) {
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    return {
      title:"我正在准题库刷题，一起来看看这道题吧！",
      path: utils.getCurrentPageUrlWithArgs() + "&exameid=" + app.globalData.exameId + "&subjectId=" + app.globalData.subjectId + "&tinum=" + that.data.tinum,
    }
  }
})