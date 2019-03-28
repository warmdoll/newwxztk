// pages/buynow/buynow.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isVoucher: false,
    regionData: [],
    radioData: [
      { value: 0, label: '个人', checked: 'true' },
      { value: 1, label: '单位' }
    ],
    radioValue: 0,
    invoiceValue: '',
    address: '',
    name: '',
    phone: '',
    mailcode: '',
    SysAreaId:'',
    isAgreement: true,
    region: [0,0],
    provinceData: [],
    cityData: [],
    countyData: [],
    totalPrice: 0,
    useCouponId: '',
    registerValue: '',
    couponValue: 0, //初始优惠价格
    showProtocol:false,
    protocolTitle:'',
    protocolUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({ ...options });
    this.setData({
      protocolTitle: app.globalData.protocolData.title,
      protocolUrl: app.globalData.protocolData.url
    })
    this.initData();
  },
  formatRegionData: function (regionData) { // 性能，耗时150毫秒左右。
  // console.log(regionData instanceof Array);
  // console.log(typeof regionData);
  // console.log(regionData instanceof Array);
    let arr0 = [];
    let arr1 = [];
    let arr2 = [];
    for (let i = 0; i < regionData.length; i++) {
      let obj = {}
      obj.id = regionData[i].Id;
      obj.name = regionData[i].Name;
      arr0.push(obj)
      if (regionData[i].Children instanceof Array) {
        let arr1fu = regionData[i].Children;
        if (arr1fu && arr1fu.length) {
          for (let j = 0; j < arr1fu.length; j++) {
            let obj1 = {}
            obj1.id = arr1fu[j].Id;
            obj1.name = arr1fu[j].Name;
            obj1.parentId = arr1fu[j].ParentId;
            arr1.push(obj1)
            if (arr1fu[j].Children instanceof Array) {
              let arr2fu = arr1fu[j].Children;
              if (arr2fu && arr2fu.length){
                for (let k = 0; k < arr2fu.length; k++) {
                  let obj2 = {}
                  obj2.id = arr2fu[k].Id;
                  obj2.name = arr2fu[k].Name;
                  obj2.parentId = arr2fu[k].ParentId;
                  arr2.push(obj2)
                }
              }
              
            }
          }
        }

      }
    }
    let arr = [];
    arr.push(arr0);
    arr.push(arr1.filter(function (item, index, array) {
      return item.parentId == arr0[0].id;
    }));
    arr.push(arr2.filter(function (item, index, array) {
      return item.parentId == arr1[0].id;
    }));
    this.setData({
      regionData: arr,
      provinceData: arr0,
      cityData: arr1,
      countyData: arr2
    })
    return arr;
  },
  setDefaultRegionData: function () {//函数性能，大概耗时10-15毫秒
    let UserAddress = this.data.UserAddress;
    let regionData = this.data.regionData;
    let provinceData = this.data.provinceData;
    let cityData = this.data.cityData;
    let countyData = this.data.countyData;
    let region = this.data.region;
    let firstIndex = -1;
    let firstId = -1;
    let secondIndex = -1;
    let secondId = -1;
    let thirdIndex = -1;
    let thirdId = -1;
    if (!UserAddress || !UserAddress.SysAreaId) {//如果没有默认地址
      //获取二级下拉框内容
      let cityData2 = cityData.filter(function (item, index) {
        return item.parentId == 1;
      })
      // cityData2.forEach(function (item, index) { //设置下拉框一级值
      //   if (1 == item.id) {
      //     secondId = item.id;
      //     secondIndex = index;
      //   }
      // })
      region[0] = 0;
      region[1] = 0;
      regionData[1] = cityData2;
      this.setData({
        regionData: regionData,
        region: region,
        SysAreaId: regionData[1][0].id
      })
      return;
    }
    let defaultRegion = countyData.filter(function (item, index) {
      return item.id == UserAddress.SysAreaId;
    })
    if (defaultRegion.length == 0) { //默认地址是市级时
      let SysAreaPath = this.data.UserAddress.SysAreaPath;
      //1获取一级菜单value
      provinceData.forEach(function (item, index) {
        if (SysAreaPath[0].Id == item.id) {
          firstId = item.id;
          firstIndex = index;
        }
      })
      //获取二级下拉框内容
      let cityData2 = cityData.filter(function (item, index) {
        return item.parentId == firstId;
      })
      cityData2.forEach(function (item, index) {
        if (SysAreaPath[1].Id == item.id) {
          secondId = item.id;
          secondIndex = index;
        }
      })
      region[0] = firstIndex;
      region[1] = secondIndex;
      regionData[1] = cityData2;
      regionData[2] = [];
      this.setData({
        regionData: regionData,
        region: region,
        SysAreaId: UserAddress.SysAreaId
      })
    } else {////默认地址是县级时
      let SysAreaPath = this.data.UserAddress.SysAreaPath;
      //1获取一级菜单value
      provinceData.forEach(function (item, index) { 
        if (SysAreaPath[0].Id == item.id) {
          firstId = item.id;
          firstIndex = index;
        }
      })
      //获取二级下拉框内容
      let cityData2 = cityData.filter(function (item, index) {
        return item.parentId == firstId;
      })
      cityData2.forEach(function (item, index) { 
        if (SysAreaPath[1].Id == item.id) {
          secondId = item.id;
          secondIndex = index;
        }
      })
      //获取三级下拉框内容
      let countyData2 = countyData.filter(function (item, index) {
        return item.parentId == secondId;
      })
      countyData2.forEach(function (item, index) { //设置下拉框一级值
        if (SysAreaPath[2].Id == item.id) {
          thirdId = item.id;
          thirdIndex = index;
        }
      })
      region[0] = firstIndex;
      region[1] = secondIndex;
      region[2] = thirdIndex;

      regionData[1] = cityData2;
      regionData[2] = countyData2;
      this.setData({
        regionData: regionData,
        region: region,
        SysAreaId: UserAddress.SysAreaId
      })
    }
  },
  initData: function () {
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/Course/GetProducts`,
      method: 'post',
      dataobj: {
        // "Id": that.data.productId,
        "Id": that.data.productId,
        "username": app.globalData.userInfo.Username
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      if (res.data.ResultCode == 0) {
        that.setData({ ...res.data.Data });
        that.computeTotalPrice();
        // if (that.data.IsHasReal) {
        //   let totalPrice = (parseFloat(res.data.Data.Price) + parseFloat(res.data.Data.SysExpressPrice)).toFixed(2);
        //   that.setData({
        //     totalPrice: totalPrice
        //   })
        // }else{
        //   that.setData({
        //     totalPrice: that.data.Price
        //   })
        // }

        if (res.data.Data.UserAddress) {
          that.setData({
            address: res.data.Data.UserAddress.Address || '',
            name: res.data.Data.UserAddress.Consignee || '',
            mailcode: res.data.Data.UserAddress.Postcode || '',
            phone: res.data.Data.UserAddress.Mobile || '',
          })
        }
        if (res.data.Data.UserAddress && res.data.Data.UserAddress.SysAreaId != 0) {
          that.setData({
            UserAddress: res.data.Data.UserAddress
          })
        }
      }
      return app.globalData.wxRequestPromise({
        url: 'https://tikuapi.wangxiao.cn/api/SysArea/GetsArea',
        method: 'post'
      })
    })
      .then((res) => { //获取地址联动信息
      //console.log(res);
        let regionData = that.formatRegionData(res.data.Data);
        that.setData({
          regionData: regionData,
        })
        that.setDefaultRegionData();
        app.globalData.hideMyLoading();
      })
      .catch((errMsg) => {
        app.globalData.hideMyLoading();
        console.log(errMsg);//错误提示信息
      });
  },
  bindMultiPickerChange: function () {

  },
  bindMultiPickerColumnChange: function (e) {
    let region = this.data.region;
    region[e.detail.column] = e.detail.value
    let regionData = this.data.regionData;
    let currentRegion = regionData[e.detail.column][e.detail.value];
    let cityData = this.data.cityData;
    let countyData = this.data.countyData;
    let SysAreaId = '';
    if (e.detail.column == 0) {
      regionData[1] = cityData.filter(function (item, index, array) {
        return item.parentId == currentRegion.id;
      });
      regionData[2] = countyData.filter(function (item, index, array) {
        return item.parentId == regionData[1][0].id;
      });
      region[1] = 0;
      region[2] = 0;
      
      if (regionData[2].length == 0){
        SysAreaId = regionData[1][0].id
      }else{
        SysAreaId = regionData[2][0].id
      }
      
      this.setData({
        regionData: regionData,
        region: region,
        SysAreaId: SysAreaId
      })
    } else if (e.detail.column == 1) {
      regionData[2] = countyData.filter(function (item, index, array) {
        return item.parentId == currentRegion.id;
      });
      region[2] = 0;
      if (regionData[2].length == 0) {
        SysAreaId = regionData[1][e.detail.value].id
      } else {
        SysAreaId = regionData[2][0].id
      }
      this.setData({
        regionData: regionData,
        region: region,
        SysAreaId: SysAreaId
      })
    } else {
      region[3] = e.detail.value;
      SysAreaId = this.data.regionData[2][e.detail.value].id;
      this.setData({
        region: region,
        SysAreaId: SysAreaId
      })
    }
  },
  isVoucherChange: function (e) {
    this.setData({
      isVoucher: e.detail.value
    })
    this.computeTotalPrice();
  },
  computeTotalPrice: function (discountPrice) {
    discountPrice = discountPrice || this.data.couponValue;
    if (this.data.IsHasReal || this.data.isVoucher) {
      let totalPrice = (parseFloat(this.data.Price) + parseFloat(this.data.SysExpressPrice) - parseFloat(discountPrice)).toFixed(2);
      this.setData({
        totalPrice: totalPrice
      })
    } else {
      let totalPrice = (parseFloat(this.data.Price) - parseFloat(discountPrice)).toFixed(2);
      this.setData({
        totalPrice: totalPrice
      })
    }
  },
  radioChange: function (e) {
    this.setData({
      radioValue: e.detail.value
    })
  },
  bindInvoiceValue: function (e) {
    this.setData({
      invoiceValue: e.detail.value
    })
  },
  bindAddressValue: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindNameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindCodeValue: function (e) {
    this.setData({
      mailcode: e.detail.value
    })
  },
  bindRegisterValue: function (e) {
    this.setData({
      registerValue: e.detail.value
    })
  },
  useCoupon: function (e) {
    if (!e.currentTarget.dataset.item.CanUse) {
      wx.showModal({
        content: `该优惠券暂不可用！`,
        showCancel: false
      })
      return;
    }
    if (e.currentTarget.dataset.item.YhNumber == this.data.useCouponId) {
      this.setData({
        useCouponId: '',
        couponValue: 0
      })
      this.computeTotalPrice()
      return;
    }
    let Price = parseFloat(this.data.Price);
    let YhLimit = parseFloat(e.currentTarget.dataset.item.YhLimit);
    if (Price < YhLimit) {
      wx.showModal({
        content: `价格未满${YhLimit}${e.currentTarget.dataset.item.Unit},不可使用！`,
        showCancel: false
      })
      return;
    }
    else {
      this.setData({
        useCouponId: e.currentTarget.dataset.item.YhNumber,
        couponValue: e.currentTarget.dataset.item.YhMoney
      })
      this.computeTotalPrice(e.currentTarget.dataset.item.YhMoney)
      // if (this.data.IsHasReal || that.data.isVoucher) {
      //   let totalPrice = (parseFloat(this.data.Price) + parseFloat(this.data.SysExpressPrice) - parseFloat(e.currentTarget.dataset.item.YhMoney)).toFixed(2);
      //   this.setData({
      //     totalPrice: totalPrice,
      //     useCouponId: e.currentTarget.dataset.item.YhNumber
      //   })
      // }else{
      //   let totalPrice = (parseFloat(this.data.Price) - parseFloat(e.currentTarget.dataset.item.YhMoney)).toFixed(2);
      //   this.setData({
      //     totalPrice: totalPrice,
      //     useCouponId: e.currentTarget.dataset.item.YhNumber
      //   })
      // }
      // let totalPrice = (parseFloat(this.data.Price) + parseFloat(this.data.SysExpressPrice) - parseFloat(e.currentTarget.dataset.item.YhMoney)).toFixed(2);
      // this.setData({
      //   totalPrice: totalPrice,
      //   useCouponId: e.currentTarget.dataset.item.YhNumber
      // })
    }
  },
  validationData: function () {
    let that = this;
    //调用确认生成订单接口。然后判断订单类型，跳转到对应页面。
    if (that.data.IsHasReal || that.data.isVoucher) { //如果商品包含书籍或需要寄送发票需要填写信息
      if (that.data.isVoucher) {
        if (!that.data.invoiceValue) {
          wx.showModal({
            content: '请输入发票抬头！',
            showCancel: false
          })
          return false;
        }
        if (that.data.radioValue == 1) {
          if (!that.data.registerValue) {
            wx.showModal({
              content: '请输入税务登记号！',
              showCancel: false
            })
            return false;
          }
        }
      }
      if (that.data.region[0] == -1) {
        wx.showModal({
          content: '请选择收货地区！',
          showCancel: false
        })
        return false;
      }
      if (!that.data.address) {
        wx.showModal({
          content: '请输入详细地址！',
          showCancel: false
        })
        return false;
      }
      if (!that.data.name) {
        wx.showModal({
          content: '请输入收件人姓名！',
          showCancel: false
        })
        return false;
      }
      if (!that.data.phone) {
        wx.showModal({
          content: '请输入收件人电话！',
          showCancel: false
        })
        return false;
      }
      if (!that.data.mailcode) {
        wx.showModal({
          content: '请输入邮编！',
          showCancel: false
        })
        return false;
      }
    }
    return true;
  },
  checkboxChange:function(e){
    let isAgreement = e.detail.value[0] ? true:false;
    //console.log(isAgreement)
    //console.log(e.detail.value[0])
    this.setData({
      isAgreement: isAgreement
    })
  },
  confirmOrder: function () {
    let that = this;
    if (!this.data.isAgreement){
      wx.showModal({
        title: '提示',
        content: '请先阅读并同意协议',
        showCancel:false
      })
      return;
    }
    //先检验数据输入合法性
    if (!this.validationData()) {
      return;
    }
    //创建订单
    let dataobj = {
      "ProductsId": that.data.Id,
      "OrderFromType": app.globalData.OrderFromType,
      "AppSign": app.globalData.Sign,//
      "AppSysClassID": app.globalData.SysClassID, //
      "UserAddress": {
        "Consignee": that.data.name, //收货人姓名
        "SysAreaId": that.data.SysAreaId,  //选中的地区的Id
        "Address": that.data.address,   // 收获详细地址
        "Postcode": that.data.mailcode,  //邮编
        "Mobile": that.data.phone    //手机号
      },
      "YhNumber": that.data.useCouponId, //优惠券号
      "username": app.globalData.userInfo.Username,  //用户名
      "Receipt":{
        IsReceiptDemand:0,
        ReceiptType:'',
        ReceiptTitle:'',
        TAXID:''
      }
      //"username": app.globalData.userInfo         
    }
    if (that.data.isVoucher) {
      dataobj.Receipt.IsReceiptDemand = 1;
      dataobj.Receipt.ReceiptType = that.data.radioValue;
      dataobj.Receipt.ReceiptTitle = that.data.invoiceValue;
      dataobj.Receipt.TAXID = that.data.registerValue;
    } else {
      dataobj.Receipt.IsReceiptDemand = 0;
    }
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/Course/BuyProducts`,
      method: 'post',
      dataobj: dataobj
    };
    //console.log(dataobj);
    app.globalData.myLoading('创建订单中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => { //获取订单详情信息
      app.globalData.hideMyLoading(() => {
        if (res.data.ResultCode == 0) {
          if (res.data.Data.IsBuy) {//0元自动开通 直接跳转
            wx.navigateBack({
              delta: 1
            })
            return;
          }
          if (that.data.paymentType == 1) { //如果不是众筹支付
            wx.redirectTo({
              // url: '../orderDetail/orderDetail?orderId=' + res.data.Data.OrderNumber + '&NeedMoney=' + that.data.totalPrice
              url: '../orderDetail/orderDetail?orderId=' + res.data.Data.OrderNumber + '&NeedMoney=' + res.data.Data.NeedMoney
            })
            // wx.redirectTo({
            //   url: '../payment/payment?orderId=' + res.data.Data.OrderNumber + '&NeedMoney=' + res.data.Data.NeedMoney
            // })
          } else {
            wx.redirectTo({
              url: '../crowdfundingPayment/crowdfundingPayment?orderId=' + res.data.Data.OrderNumber + '&NeedMoney=' + that.data.totalPrice + '&Hasmoney=' + res.data.Data.Hasmoney + '&productId' + that.data.productId
            })
          }
        }
      });

    }).catch((errMsg) => {
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  goCourseDetailPage(){

  },
  hideProtocol:function(){
    that.setData({
      showProtocol: false
    })
  },
  productAgreement:function(){
    let that = this;
    wx.navigateTo({
      url: './protocol/protocol?url=' + encodeURIComponent(that.data.Protocol.Url)
    })
    // wx.navigateTo({
    //   url: '../agreementDetail/agreementDetail?url=' + that.data.Protocol.Url
    // })
    // wx.downloadFile({
    //   url: that.data.Protocol.Url,
    //   success: function (res) {
    //     var filePath = res.tempFilePath
    //     wx.openDocument({
    //       filePath: filePath,
    //       success: function (res) {
    //       }
    //     })
    //   }
    // })
  },
  toProtocalDetail:function(){
    wx.navigateTo({
      url: './protocol/protocol?url=' + encodeURIComponent(this.data.protocolUrl)
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