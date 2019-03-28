var app = new getApp();
import utils from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frompage: "practiceList",
    isShowCom:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.globalData.isShowCom = true;
    that.changeGlobalIsshowCom();
    // that.setData({
    //   item: {
    //     showModal: false
    //   }
    // });
  },
  changeGlobalIsshowCom: function () {
    var that = this;
    that.setData({
      isShowCom: true
    })
    app.globalData.isShowCom = true;
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
  onShareAppMessage: function (res) {
    var that = this,title;
    if (res.from === 'button') {
      var resOnj = res.target.dataset;
      // 来自页面内转发按钮
      title = resOnj.title;
      if (!app.globalData.Username) {
        //需要提示登录
      }
    }else{
      title = "快来一起学习" + app.globalData.exameName + "了~";
    }
   
      let shareData = app.getShareData(1, 2);
      return {
        title: shareData.Title ||title ,
        path: `${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorage()}`,
        imageUrl: shareData.ImageUrl,
        success: function (res) {
          // 转发成功
          app.shareRequest(resOnj.id);

      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})