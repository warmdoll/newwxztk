// pages/setmeallist/setmeallist.js
var app = getApp();
import utils from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    setmeallist: [], //套餐列表数据
    isHasMore: false, // 是否还有更多数据
    pageInfo: { "PageCount": 0, "PageSize": 20, "CurrentPage": 0, "RowCount": 0 }, // 分页所需参数
    canShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData(options)
    var that = this;
    that.getCourseList();
  },
  /**
   * 获取套餐列表数据接口
   */
  getCourseList: function () {
    let that = this;
    // wx.showLoading({ title: "努力加载中..." });
    app.globalData.myLoading('努力加载中...');
    let requestObj = {
      url: app.globalData.requestUrlobj.apimvc + '/api/Course/GetUserCourse',
      method: 'post',
      dataobj: {
        "username": app.globalData.userInfo.Username
      }
    };
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      let resData = res.data.Data;
      if (res.data.ResultCode == 0) {
        if (that.data.pageInfo.CurrentPage == 0) {
          that.setData({
            setmeallist: resData,
            pageInfo: res.data.PageInfo
          })
        } else {
          let addData = resData;
          that.setData({
            setmeallist: [...that.data.setmeallist, ...addData],
            pageInfo: res.data.PageInfo
          })
        }
        app.globalData.hideMyLoading();
      }else{
        app.globalData.hideMyLoading();
        // wx.showModal({
        //   title: '提示',
        //   content: res.data.Message,
        //   showCancel: false
        // })
      }
      
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
  },
  getCourseListCallback1: function (res) {
    var that = this;



  },
  checkHasMore: function (pageInfo) {
    let that = this;
    if (pageInfo.PageSize * pageInfo.CurrentPage >= pageInfo.RowCount) {
      that.setData({
        isHasMore: false
      })
    } else {
      that.setData({
        isHasMore: true
      })
    }
    //return that.data.isHasMore;
    //console.log(that.data.isHasMore)
  },
  goCourseDetailPage(e) {
    let productId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../courseDetail/courseDetail?productId=' + productId
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
    //重置分页属性值
    let that = this;
    that.setData({
      pageInfo: { "PageCount": 0, "PageSize": 20, "CurrentPage": 0, "RowCount": 0 }
    })
    this.getCourseList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //设置分页参数获取数据
    if (!this.data.isHasMore) {//如果没有更多数据
      return;
    }
    this.getCourseList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})