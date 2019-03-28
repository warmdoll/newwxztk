// pages/orderList/orderList.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentType: 0,
    signList: [],
    noSingList: [],
    isSignList: false,
    isNoSignList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    //this.initData();
  },
  initData: function () {
    let that = this;
    if (that.data.currentType == 0 && that.data.isNoSignList) {
      return;
    }
    if (that.data.currentType == 1 && that.data.isSignList) {
      return
    }
    let dataobj = {
      "status": that.data.currentType,//转换orderType值
      "username":app.globalData.userInfo.Username
    }

    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/Protocol/UserProtocol`,
      method: 'post',
      dataobj: dataobj
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      that.setData({
        noSingList: [],
        isNoSignList: false
      })
      if (res.data.ResultCode == 0) {
        if (that.data.currentType == 0) {
          that.setData({
            noSingList: res.data.Data,
            isNoSignList: true
          })
        }
        if (that.data.currentType == 1) {
          that.setData({
            signList: res.data.Data,
            isSignList: true
          })
        }
      } else {
        if (that.data.currentType == 0) {
          that.setData({
            isNoSignList: true
          })
        }
        if (that.data.currentType == 1) {
          that.setData({
            isSignList: true
          })
        }
      }
      // else if (res.data.ResultCode == 9) {
      //   that.setData({
      //     isNoSignList: true,
      //     isSignList: true
      //   })
      // }
      app.globalData.hideMyLoading();

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onkeyAgreement: function () {
    wx.navigateTo({
      url: `../signagreement/signagreement?isAll=1`
    })
    // this.setData({
    //   isSignList: false,
    //   isNoSignList: false
    // })
    // this.initData();
  },
  toPdfDetal: function (e) {
    if (!e.currentTarget.dataset.url) { //没有url未签署
      wx.navigateTo({
        url: '../agreementDetail/agreementDetail?id=' + e.currentTarget.dataset.id
      })
    } else { //已签署，直接预览
      wx.downloadFile({
        url: e.currentTarget.dataset.url,
        success: function (res) {
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
            }
          })
        }
      })
    }

  },
  onBottomTabTap: function (e) {
    this.setData({
      currentType: e.currentTarget.dataset.index
    })
    this.initData();
  },
  goOrderDetailPage: function (e) {
    let orderId = e.currentTarget.dataset.ordernumber;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderId=' + orderId
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isSignList: false,
      isNoSignList: false
    })
    this.initData();
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