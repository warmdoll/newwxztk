var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ModulesObj:[],
    childrenObj:[],
    closeBox: false,//控制两处：是否显示弹窗和页面滚动状态
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
    var that = this;
    //首先获取code获取openid获取userInfo
    let exameId = wx.getStorageSync('exameId');
    let signName = wx.getStorageSync('signName');
    let exameName = wx.getStorageSync('exameName');
    let subjectName = wx.getStorageSync('subjectName');
    let subjectId = wx.getStorageSync('subjectId');
    if (!app.globalData.canSelectSubject && exameId && signName && exameName && subjectName && subjectId){ //如果已经有考试id直接跳转到首页去
      app.globalData.exameId = exameId;
      app.globalData.signName = signName;
      app.globalData.exameName = exameName;
      app.globalData.subjectName = subjectName;
      app.globalData.subjectId = subjectId;
      app.globalData.canSelectSubject = true;
      wx.switchTab({
        url: '../study/study'
      })
    }else{
      app.globalData.myLoading();//加载中动画
      that.getexameName();
      app.hideGetUserInfo();
    }
  },

  // 获取考试名称的接口
  getexameName: function () {
    var that = this,
      classId = app.globalData.SysClassID,
      requestObj = {
        url: 'https://wap.wangxiao.cn/weixin/Wap/GetExamList?ClassId=' + classId + '&DeviceType=0&VersionNo=100',
        method: 'get',
        sysclassId: "e8a38467-6064-4684-be0c-f500b42f8238",
        dataobj: {},
        callback1: that.getExamenamecallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  //获取考试名称接口成功的回调函数
  getExamenamecallback1:function(res){
    var that=this;
    if (res.data.ResultCode == 0) {
      //请求成功修改moduleArray模块对象
      var index = 0;
      var examenameArray = res.data.Data;
      var newArray = [];
     //考试名称的数组
      that.setData({
        ModulesObj: examenameArray
      })
      app.globalData.hideMyLoading();
    } 
  },
  //点击考试名称--跳转页面
  clickExamename:function(e){
    var that=this,
        newModulesObj = that.data.ModulesObj,
        eObj = e.currentTarget.dataset,
        //大类id
        parentsId = eObj.parentsid,
        //考试id
        dataId = eObj.id,
        //选中状态
        selectStatus = eObj.selectstatus;
    //点击考试后---改变全局的signName
    newModulesObj.forEach(function(i,v){
      //大类id==父级id
      if (i.Id == parentsId){
        //如果没有子考试----不再执行
        if ( i.Children == null){
          return;
        }
      // 如果有考试---渲染到页面
        i.Children.forEach(function(o,v){
         //所有状态置为0---并重新渲染试图
          o.SelectStatus=0;
          that.setData({
            ModulesObj: newModulesObj
          })
          //添加当前点击按钮的状态 通过id找到点击的元素--对象
          if (o.Id == dataId) {
            //如果有子考试数组部位空+数组长度大于0
            if (o.Children !== null && o.Children.length!=0) {
              var childNameArr = o.Children;
              that.setData({
                childrenObj: childNameArr,
                closeBox: true
              })
              return;
            }
            var selected = o.SelectStatus;
            o.SelectStatus = selectStatus == 0 ?1:0;
            that.setData({
                ModulesObj: newModulesObj
           })
           //存储数据--跳转页面
            // tha
            that.exameMessage(o);
            // 考试id 考试名称存入全局变量
            app.globalData.exameId = dataId;
            app.globalData.signName = eObj.sign;
            app.globalData.sign = eObj.sign;
            app.globalData.exameName = eObj.signname;
            wx.redirectTo({
              url: '../subject/subject?exameid=' + dataId + "&frompage=selectedexame" 
            })
            
      
          }
        })
      }
    })
  },
  //点击子考试
  clickChild:function(e){
    var that=this,
    childrenObj = that.data.childrenObj,
    eObj = e.currentTarget.dataset,
      //考试id
    dataId = eObj.id,
      //选中状态
    selectStatus = eObj.selectstatus;
    childrenObj.forEach(function (o, v) {
      //所有状态置为0---并重新渲染试图
      o.SelectStatus = 0;
      that.setData({
        childrenObj: childrenObj
      })
      //添加当前点击按钮的状态 通过id找到点击的元素--对象
      if (o.Id == dataId) {
        var selected = o.SelectStatus;
        o.SelectStatus = selectStatus == 0 ? 1 : 0;
        that.setData({
          childrenObj: childrenObj
        })
        that.exameMessage(o);
        that.setData({
          closeBox: false
        })
        // 考试id 考试名称存入全局变量
        app.globalData.exameId = dataId;
        app.globalData.exameName = eObj.signname;
        app.globalData.signName = eObj.sign;
        app.globalData.sign = eObj.sign;

        wx.redirectTo({
          url: '../subject/subject?exameid=' + dataId + "&frompage=selectedexame"
        })
        
      }
    })
  },
  //点击考试--存储考试id sign。跳转相关处理
  exameMessage:function(o){
    //存储考试id sign值 
    try {
      wx.setStorageSync('exameId', o.Id);
      wx.setStorageSync('signName', o.sign);
      wx.setStorageSync('exameName', o.Title);
    } catch (e) {
      // wx.showLoading({
      //   title: '加载失败',
      // })
      // setTimeout(function () {
      //   wx.hideLoading()
      // }, 1000)
    }
    // wx.redirectTo({
    //   url: '../subject/subject?id=' + o.Id + "&frompage=selectedexame"
    // })
    

  },
  closeBox:function(e){
    var that=this;
      
      that.setData({
        closeBox: false
      })
  },
  
})