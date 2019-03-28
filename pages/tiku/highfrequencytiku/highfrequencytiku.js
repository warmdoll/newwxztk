var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr:[],
    clickBuy:false,
    ProductsType: 11,
    subjectId:"",
    typename:'' ,
    optionsObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      subjectId: options.subjectid,
      optionsObj: options
    })
    this.getTilist();
  },
  // 获取高频考点 易错数据 必传科目id和用户名
  getTilist: function () {
    var that = this,
      username = app.globalData.userInfo.Username,
      dataObj = {
        Data: {
          SubjectID: that.data.subjectId,
          Username: username
        }
      },
      buyObj={
        Data: {
          Id: that.data.subjectId,
          username: username,
          OrderFromType: 5,
          ProductsType: that.data.ProductsType
        }
      },
      requestUrl = app.globalData.requestUrlobj.tikuapi,
      requestObj = {
        url: that.data.clickBuy ? requestUrl + "/api/TestPaper/ProductsBuy" : requestUrl+'/api/Question/GetDifficult',
        method: 'post',
        dataobj: that.data.clickBuy ? buyObj : dataObj,

        callback1: that.data.clickBuy ? that.getTilistcallbackbuy:that.getTilistcallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  getTilistcallback1: function (res) {
    var that = this,
      resArr = res.data.Data;
    if (res.statusCode ==200) {
      if (resArr!=null&&resArr.length > 0) {
        that.setData({
          dataArr: resArr
        })
      }
    }
  },
  // 购买数据
  getTilistcallbackbuy : function(res) {
    var that = this,
      resArr = res.data;
      if (resArr.ResultCode == 0) {
        if (resArr.Data != null) {
          app.globalData.buyTi = resArr.Data;
          wx.navigateTo({
            url: '../../pay/tipay/tipay?typename=' + that.data.typename + "&subjectid=" +that.data. optionsObj.subjectid + "&productstype=" + that.data.ProductsType,
          })
        }
     }
  },
  // 点击去购买
  gotoBuy:function(e){
    //如果是苹果需要显示不支持购买
    app.iosBuyShowInfo();
    if (app.globalData.systemInfo.isIOS) return;
    
    var that = this, subjectId = e,
        datasetObj = e.currentTarget.dataset;
    that.setData({
      typename: datasetObj.typename,
      clickBuy: true,
      ProductsType: datasetObj.productstype
    })
    that.getTilist();
  },
  // 点击去做题
  gototikupaper:function(e){
    var that = this, currObj = e.currentTarget.dataset,
        optionsObj = that.data.optionsObj,
        IsEmpty = currObj.HasStudyCount >= currObj.QuestionCount?1:0,//如果已做题大于总题数则为1
        DifficultType = currObj.typeid,//区别高频考点 高频易错
        DifficultyRate = currObj.typeid == 1 ? currObj.id:"",//高频考点的考点频率
        DifficultError = currObj.typeid == 2 ? currObj.id : "";//高频易错的考点频率
        wx.navigateTo({
          url: '../tikupaper/tikupaper?exameid=' + optionsObj.exameid + "&subjectid=" + optionsObj.subjectid + "&tinum=1" + "&isempty=" + IsEmpty + "&difficulttype=" + DifficultType + "&difficultyrate=" + DifficultyRate + "&difficulterror=" + DifficultError +"&frompage=highfrequencytiku"
        })
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