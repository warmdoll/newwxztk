// pages/payment/payment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    abilityValue: 0,
    mienValue: 0,
    datumValue: 0,
    textareaValue: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  setTextareaValue(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  setAbilityValue(e) {
    this.setData({
      abilityValue: e.detail.starValue
    })
  },
  setMienValue(e) {
    this.setData({
      mienValue: e.detail.starValue
    })
  },
  setDatumValue(e) {
    this.setData({
      datumValue: e.detail.starValue
    })
  },
  onLoad: function (options) {
    app.globalData.myLoading('努力加载中...');
    this.setData(options);
    this.getEvaluteElement();
  },
  // 根据商品类型获取ModuleId--请求接口 获取评价名称 that.data.productsType==9是章节课 其它是课程
getEvaluteElement(){
  let that=this;
  console.log(that.data.productsType)
  let ajaxData={
      "Data": that.data.productsType == 9 ? 1 : 3
  };
  let requestObj = {
    url: `${app.globalData.requestUrlobj.tikuapi}/api/Comment/GetCommentScoreItem`,
    method: 'post',
    dataType: 'application/json',
    dataobj: ajaxData
  };
  
  app.globalData.wxRequestPromise(requestObj).then((res) => {
    app.globalData.hideMyLoading();
    let resData = res.data.Data;
    if (res.data.ResultCode == 0) { // 成功获取useInfo保存起来。
      console.log(res.data)
      if (res.data.Data && res.data.Data.length>0){
        that.setData({
          evaElmentArr: res.data.Data
        })
      }
    } else {
      app.globalData.hideMyLoading();
      wx.showModal({
        title: '提示',
        content: res.data.Message,
        showCancel: false
      })
    }

  }).catch((errMsg) => {
    app.globalData.hideMyLoading();
    console.log(errMsg);//错误提示信息
  });

},

  comitEvaluate() {
    let that = this;
    let Comment = {
      "Data": {        
        "CommentDetail": {
          "CategoryID": app.globalData.subjectId,
          "CommentContent": that.data.textareaValue,
          "FKID": that.data.ProductsId,
          "RemarkSource": 1,
          "UserName": app.globalData.userInfo.Username,
          "ModuleId": that.data.productsType == 9 ? 1 : 3
        },
        "CommentItemDetails": [{
          "Score": that.data.abilityValue,
          "ScoreItemID": that.data.evaElmentArr[0].ID
        }, {
            "Score": that.data.mienValue,
            "ScoreItemID": that.data.evaElmentArr[1].ID
        }, {
            "Score": that.data.datumValue,
            "ScoreItemID": that.data.evaElmentArr[2].ID
        }]
      }
    };
    let requestObj = {
      url: `${app.globalData.requestUrlobj.tikuapi}/api/Comment/InserteChapterSectionComments`,
      method: 'post',
      dataobj: Comment
    }
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      app.globalData.hideMyLoading();
      let resData = res.data.Data;
      //app.globalData.openid = resData.OpenId
      if (res.data.ResultCode == 0) { // 成功获取useInfo保存起来。
        wx.showModal({
          title: '提示',
          content: '评论成功，谢谢参与！',
          showCancel: false,
          complete:function(){
            wx.navigateBack();
          }
        })
      } else {
        app.globalData.hideMyLoading();
        wx.showModal({
          title: '提示',
          content: res.data.Message,
          showCancel: false
        })
      }

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  initData() {

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