var common = require('../../commonjs/common.js');//引入公共代码
import utils from '../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    titypeArr:[
      { id: 1, value: '每日一练', checked: 'true' },
      { id: 2, value: '考点练习', checked: 'true'},
      { id:3, value: '历年真题' },
      { id:4, value: '模拟试题' }
    ],
    SubjectObj:{},
    SingleSubject:[],//单科
    WholeSubject:[],//全科
    ulHeight:0,
    oldPrice:0,
    CurrentPrice:0,
    productsId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({ });
    var that = this;
    that.getLivelist();
    that.getRect();
    app.globalData.myLoading();
  },
  // 点击商品
  clickSubjectlist:function(e){
    // 选中当前的商品--状态 价格
    var that = this, subjectType = e.currentTarget.dataset.type,//1单科2全科
      productsId = e.currentTarget.dataset.productsid,//商品id
        currProductsObj = {}, currArr;
    if (subjectType==1){
      currArr = that.data.SingleSubject;//单科数组中的数据
      currArr.forEach(function (v, i) {
        v.IsSelected = false;
        if (v.ProductsId == productsId){
          if (v.IsSelected) {
            v.IsSelected = false;
            
          } else {
            v.IsSelected = true;
            that.setData({
              oldPrice: v.Price,
              CurrentPrice: v.CurrentPrice,
              productsId: v.ProductsId
            })
            
          }
        }
        
      })
      that.setData({
        SingleSubject: currArr
      })
      that.showPrice(that.data.SingleSubject)
    }else{
      currArr = that.data.WholeSubject;//单科数组中的数据
      currArr.forEach(function (v, i) {
        v.IsSelected = false;
        v.IsSelected = !v.IsSelected;
        if (v.IsSelected) {
          that.setData({
            oldPrice: v.Price,
            CurrentPrice: v.CurrentPrice,
            productsId: v.ProductsId
          })
        }
      })
      that.setData({
        WholeSubject: currArr
      })
      that.showPrice(that.data.WholeSubject)
    }
  },
  
  onShareAppMessage: function () {

  },
  /** 
 * 点击tab切换 
 */
  swichNav: function (e) {
    var that = this, currentNum = e.detail.current;
    that.changePrice(currentNum);
    if (this.data.currentTab === currentNum) {
      return false;
    } else {
      that.setData({
        currentTab: currentNum
      })
    }
  },
   //获取列表的高度
  getRect: function () {
    var that=this,recHeight,
    windowHeight = 0, footerHeight = 0, tabHeight=0;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
       windowHeight=res.windowHeight;
      }
    })
    if (that.data.SingleSubject.lenght > 0 && that.data.WholeSubject.length > 0){
      wx.createSelectorQuery().select('.tab-box').boundingClientRect(function (rect) {
        tabHeight = rect.height;
      }).exec()
    }
    wx.createSelectorQuery().select('.footer').boundingClientRect(function (rect) {
      footerHeight = rect.height;
    }).exec()
    that.setData({
      ulHeight: windowHeight - (tabHeight + footerHeight)
    })
  },
  /** 
 * 滑动切换tab 
 */
  bindChange: function (e) {
    var that = this, currentNum = e.detail.current;
    that.setData({ currentTab: currentNum });
    that.changePrice(currentNum);
  },
  // 单 全科 切换改变底部价格
  changePrice: function (currentNum){
    var that=this;
    if (currentNum == 0) {
      // 单科---改变价格
      var subjectObj = that.data.SingleSubject;//单科相关数据
      that.showPrice(subjectObj);
    } else {
      // 全科--改变价格
      var subjectObj = that.data.WholeSubject;//全科相关数据
      that.showPrice(wholeArr);
    }
  },
  // 获取商品信息
  getLivelist: function () {
    var that = this,
      requestData = {
        ExamId: app.globalData.exameId,//"e9fd5aa8-48a8-406d-bfc6-5728a9c6a131",
        SubjectId: app.globalData.subjectId,//"867b9cbd-93b7-4d97-bb82-102b3358c7a2",
        Type: 1,
        username: app.globalData.userInfo.Username||""//"ceshi_4"
      },
      requestObj = {
        url: app.globalData.requestUrlobj.apimvc+"/api/Confidentiality/Index",
        method: 'POST',
        dataobj: requestData,
        callback1: that.getUpgradelistcallback1,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  // 获取数据成功的函数
  getUpgradelistcallback1: function (res) {
    app.globalData.hideMyLoading();
    var that = this;
    var result = res.data;
    if (result.ResultCode == 0) {
      var singSubjectData = result.Data.SingleSubject,
        wholeSubjectData = result.Data.WholeSubject;
      that.setData({
        SubjectObj: result.Data,
        SingleSubjectText: singSubjectData !== null ? singSubjectData.IncreasedPricesTips : "",//单科倒计时说明
        wholeSubjectText: wholeSubjectData !== null ? wholeSubjectData.IncreasedPricesTips : "",
        SingleSubject: singSubjectData !== null ? singSubjectData.List:[],//单科
        WholeSubject: wholeSubjectData !== null ? wholeSubjectData.List:[],//全科
      })
      var subjectObj = that.data.SingleSubject,
          singleArr = subjectObj!== null ? subjectObj : [];//单科相关数据
      that.showPrice(singleArr);
    }
  },
  // 价格显示
  showPrice:function(productsArr){
    var that = this,currObj={};
        // 筛选当前被选中的对象
        currObj = productsArr.filter(function(item){
          return item.IsSelected
        })[0]
        that.setData({
          oldPrice: currObj.Price,
          CurrentPrice: currObj.CurrentPrice,
          productsId: currObj.ProductsId
        
        })
  },
  // 去购买
  buyProducts:function(){    
    app.globalData.myLoading();
    var that=this,
    productsIdArr=[];
    productsIdArr.push(that.data.productsId)
    that.getOrderId(productsIdArr);
  },
  // 下单
  getOrderId: function (productsIdArr){
    app.globalData.hideMyLoading();
    if (app.globalData.userInfo && app.globalData.userInfo.Username) {
      //如果是苹果需要显示不支持购买
      app.iosBuyShowInfo();
      if (app.globalData.systemInfo.isIOS) return;
      this.getOrderId2(productsIdArr)
    } else {
      this.checkUserLogin(() => {
        //如果是苹果需要显示不支持购买
        app.iosBuyShowInfo();
        if (app.globalData.systemInfo.isIOS) return;        
        this.getOrderId2(productsIdArr)
      });
    }
  },
  getOrderId2: function (productsIdArr){
    var that = this,
    mvcUrl = app.globalData.requestUrlobj.apimvc,
     dataObj = {
        username: app.globalData.userInfo.Username,
        ProductsIdList: productsIdArr,
        OrderFromType: app.globalData.OrderFromType,
        AppSysClassID: app.globalData.exameId,
        AppSign: app.globalData.sign
      },
      requestObj = {
        url: mvcUrl +"/api/Course/BuyProducts",
        method: 'post',
        dataobj: dataObj ,
        callback1: function(res){
          app.globalData.hideMyLoading();
          if (res.data.ResultCode==0){
            var orderObj = res.data.Data;
            wx.navigateTo({
              url: '../../payment/payment?orderId=' + orderObj.OrderNumber + "&NeedMoney=" + orderObj.NeedMoney + "&Hasmoney=" + orderObj.Hasmoney,
            })
          }
        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  checkUserLogin: function (cb) {
    app.upDataUserInfo(() => {
      typeof cb == "function" && cb()
    }, (resData) => {
      app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
      wx.navigateTo({
        url: `../login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
      })
    });
  },
})