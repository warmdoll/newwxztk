var app = new getApp(),
    gdataObj={
      QuestionCount: 30,
    };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapterId:"",
    sectionId:"",
    subjectId:"",
    typeObj:{
      tiType:[{id:0,QuestionType:-1,status:true,title:"全部"},
              {id: 1,QuestionType: 1,status: false,title:"单选题"},
              {id: 2,QuestionType: 2,status: false,title:"多选题"}
      ],
      tiStatus: [{ id: 3, DoState: -1, status:false , title: "全部" },
                  { id: 0, DoState: 1, status: false, title: "已答题" },
                  { id: 1, DoState: 0, status: true, title: "未答题" },
                  { id: 2, DoState: 2, status: false, title: "错题" },
      ],
      tiNum: [{ id: 0, QuestionCount: 30, status: true, title: "30道" },
              { id: 1, QuestionCount: 50, status: false, title: "50道" },
              { id: 2, QuestionCount: 100, status: false, title: "100道" }
      ],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that=this;
    // 获取章试题 只传ChapterID+其它
    if (typeof options.chapterid != "undefined"){
      gdataObj.ChapterID = options.chapterid;
    }
     // 获取节题 只传SectionID+其它
    if (typeof options.sectionid != "undefined") {
      gdataObj.SectionID = options.sectionid;
    }
    gdataObj.DoState=0;
    gdataObj.SubjectID=app.globalData.subjectId;
    gdataObj.Username=app.globalData.userInfo.Username || "";
  },
  // 获取筛选后的题目
  getTilist: function () {
    // 题型为全部时不传QuestionType 选择为为答题不传DoState 如果是章只传ChapterID 如果是节只传
    var that = this,
      username = app.globalData.userInfo,
      dataObj = {
        Data: gdataObj
      },
      requestObj = {
        url: 'https://tikuapi.wangxiao.cn/api/Question/GetsRandomByChapterOrSection',
        method: 'post',
        dataobj: dataObj,
        callback1: that.getTilistcallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  getTilistcallback1: function (res) {
    var that = this, resArr;
    app.globalData.hideMyLoading();
    if (res.data.ResultCode == 0 && res.data.Data) {
      resArr = res.data.Data;
      
      if (resArr.length > 0) {
          app.globalData.tiObj = resArr;
          wx.navigateTo({
            url: '../tikupaper/tikupaper?frompage=filterquestion&tinum=1'
          })
        that.setData({
          dataArr: resArr
        })
      }
    }
    else if (res.data.ResultCode == 9) {
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        duration: 2000
      })
    }
   
  },
  // 点击按钮
  clickType:function(e){
    var that=this,
        eObj = e.currentTarget.dataset,
        eType=eObj.type,//题型 选择 题量
         index = eObj.item;

    that.typeFn(eObj);
  },
  typeFn: function (eObj){
    var that=this,
        eType = eObj.type,//题型 选择 题量
        index = eObj.item,
        typeObj = that.data.typeObj;
    switch (eObj.type){
      // 题型
      case "tiType":
        (typeObj.tiType).forEach(function(v,i){
          v.status=false;
        });
        (typeObj.tiType)[index].status = !(typeObj.tiType)[index].status;
        if (eObj.questiontype != -1) {
          gdataObj.QuestionType = eObj.questiontype;
        }
      break;
      // 选择
      case "tiStatus":
        (typeObj.tiStatus).forEach(function (v, i) {
          v.status = false;
        });
        (typeObj.tiStatus)[index].status = !(typeObj.tiStatus)[index].status;
        gdataObj.DoState = eObj.dostate;
        if (parseInt(eObj.dostate) == -1){
          if (gdataObj.DoState){
            delete gdataObj.DoState;
          }
          
        }
      break;
      // 题量
      case "tiNum":
        (typeObj.tiNum).forEach(function (v, i) {
          v.status = false;
        });
        (typeObj.tiNum)[index].status = !(typeObj.tiNum)[index].status;
        gdataObj.QuestionCount = eObj.questioncount;         
      break;
    }
    that.setData({
      typeObj: typeObj
    })

  },
  jumpDatipage:function(){
    var that=this;
    app.globalData.myLoading();
    that.getTilist();
  },
  onUnload:function(){
    gdataObj={
      QuestionCount: 30,
    };
  }
})
