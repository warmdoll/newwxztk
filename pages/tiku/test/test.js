var app = new getApp();
var touchDot = 0;//触摸时的原点
var time = 0;//  时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理 时间记录
var nth = 0;// 设置活动菜单的index
var nthMax = 5;//活动菜单的最大个数
var tmpFlag = true;// 判断左右华东超出菜单最大值时不再执行滑动事件

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tiData: [],
    swiperData: [],
    totalTi: 0,//总题数
    currTinum: 1,
    selectedObj:[],
    sourseFrom:'',
    stopSwiper:false,
    menu:[{active:false}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getTilist();
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件
  bindChange: function (e) {
    var that = this,swiperArr = [],touchMove = e.touches[0].pageX;
      // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10) {
      var current=0;
      if (tmpFlag && nth < nthMax) { //每次移动中且滑动时不超过最大值 只执行一次
        var tmp = this.data.tiData.map(function (arr, index) {
          tmpFlag = false;
          if (arr.active) { // 当前的状态更改
            nth = index;
            ++nth;
            arr.active = nth > nthMax ? true : false;
          }
          if (nth == index) { // 下一个的状态更改
            arr.active = true;
            name = arr.value;
          }

          
          // 如果当前滑动到第3道题---渲染之后的三道题 
          if (index% 2 == 0) {
            that.data.tiData.forEach(function (i, v) {
              if (v < (3 + parseInt(index))) {
                swiperArr.push(i)
              }
            })
            that.setData({
              swiperData: swiperArr,
            })
          }
          // 提交用户点击的选项
          that.submitOption(e);

          that.setData({
            currTinum: (index + 1),
            selectedObj: [],
            stopSwiper: false
          })
          return arr;
        })
        //当前滑动的题号
        that.setData({
          currTinum: e.currentTarget.dataset.num
        })
        this.getTilist(); // 获取新闻列表
        this.setData({ menu: tmp }); // 更新菜单
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 40 && time < 10) {
   
      if (tmpFlag && nth > 0) {
        nth = --nth < 0 ? 0 : nth;
        var tmp = this.data.menu.map(function (arr, index) {
          tmpFlag = false;
          arr.active = false;
          // 上一个的状态更改
          if (nth == index) {
            arr.active = true;
            name = arr.value;
          }
          return arr;
        })
        this.getTilist(); // 获取新闻列表
        this.setData({ menu: tmp }); // 更新菜单
      }
    }
    // touchDot = touchMove; //每移动一次把上一次的点作为原点（好像没啥用）
  },
  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
  },
  // 获取题目
  getTilist: function () {
    var that = this,
      classId = "11111111-1111-1111-1111-111111111111",
      dataObj = {
        Data: {
          Username: app.globalData.userInfo,
          SysClassId: "11111111-1111-1111-1111-111111111111",
          ExamID: wx.getStorageSync('exameId'),
          SubjectID: wx.getStorageSync('subjectId'),
          Day: 20180223
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
  square: function (arr) {
    var chanArr = [];
    if (arr.length > 0) { 
      arr.forEach(function (item, v) {
        if (item.QuestionType < 5) {
          chanArr.push(item)
        }
      });
      return chanArr;
    }
  },
  getTilistcallback1: function (res) {
    var that = this,
      result = res.data,
      dataArr = result.Data,//请求的所有数据
      swiperArr = [],//前三条数据
      lastdataArr = that.square(dataArr);//筛选后的题型
    if (result.ResultCode == 0) {
      //数据添加题号
      if (lastdataArr.length > 0) {
        lastdataArr.forEach(function (i, v) {
          i.tiNum = (v + 1);
          i.Options.forEach(function (v, i) {
            v.isStatus = false;
          })
          if (v < 3) {
            swiperArr.push(i);
          }
        })
      }
      that.setData({
        tiData: lastdataArr,
        swiperData: swiperArr,
        totalTi: lastdataArr.length
      })
    }
  },
  // 点击答案 选中状态处理
  selectedDaan: function (e) {
    var that = this, selectedObj=[],
      currData = that.data.tiData;
    currData.forEach(function (v, i) {
      if (v.ID == e.currentTarget.dataset.parentsid) {
        v.Options.forEach(function (v, i) {
          v.isStatus = false;
          if (v.ID === e.currentTarget.dataset.id) {
            v.isStatus = !v.isStatus;
            if(v.isStatus){
              selectedObj.push({ name: v.Name, Id: v.ID, questionId: v.QuestionID,ansyShow:false });
              that.setData({
                selectedObj:selectedObj
              })

              

            }
          
          }
        })
      }
      that.setData({
        swiperData: currData
      })
    })
  
   
  },
  //选中答案--提交选项
  submitOption: function (e) {
    var that=this,
        optionObj = {},
        UserOptionsName="",
        UserOptionsID="",
        requestObj={},
        sourse = that.data.sourseFrom,
        questionId="";
    that.data.selectedObj.forEach(function(v,i){
      UserOptionsName += v.name;
      UserOptionsID+=v.Id;
      questionId = v.questionId;
    })
    optionObj={
            Data: {
              ExamID: "55c5321f-ee46-421e-b793-e53ec4f7e5f8",
              SubjectID: "0ddeec5b-7d2f-4df6-af43-7910850b7aaf",
              ChapterID: "",
              SectionID: "",
              Username: app.globalData.userInfo,
              PaperHistoryID: "",
              QuestionID: questionId,
              Source: 3 ,
              IsRight: 0,
              UserOptionsName: UserOptionsName,
              UserOptionsID: UserOptionsID
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})