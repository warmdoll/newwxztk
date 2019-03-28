var common = require('../commonjs/common.js');//引入公共代码
import utils from '../../utils/util.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ulHeight: "1rpx",
    title: "初级会计职称",
    currentTab: 0,
    livelistArr: [1, 2],
    status: {
      0: '播放',
      1: '购买',
      2: '直播中',
      3: '去预约',
      4: '已预约',
      5: '回放',
      6: '正在准备视频',
      7: '分享解锁',
      8: '好评解锁',
      9: '已下线'
    },
    statusClass: {
      0: 'play-icon-paly',
      1: 'play-icon-pay',
      2: 'play-icon-live',
      3: 'play-icon-bespeak',
      4: 'play-icon-hasbespeak',
      5: 'play-icon-playback',
      6: 'play-icon-noplay',
      7: 'play-icon-noplay',
      8: 'play-icon-noplay',
      9: 'play-icon-noplay'
    }
    // status: {
    //   0: '播放',
    //   1: '购买',
    //   2: '正在直播',
    //   3: '直播未预约',
    //   4: '直播已预约',
    //   5: '查看回放',
    //   6: '正在准备视频',
    //   7: '分享解锁',
    //   8: '好评解锁',
    //   9: '已下线'
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;    
    //that.getRect();
    app.changeGlobalData(options);//统一处理扫码及直接进入的参数
    that.setData({
      item: {
        showModal: false
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.getLivelist();//获取直播列表
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
    let _this = this;
    let shareData = app.getShareData(3, 1);
    return {
      title: _this.data.ProductsTitle,
      path: `${utils.getCurrentPageUrlWithArgs()}&${app.getLocationStorage()}`,
      imageUrl: shareData.ImageUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取列表的高度
  // getRect: function () {
  //   var that=this,recHeight,
  //       listLength =2*that.data.livelistArr.length;
  //   wx.createSelectorQuery().select('.live-ul').boundingClientRect(function (rect) {
  //       recHeight = rect.height;
  //       that.setData({
  //         ulHeight: (listLength * recHeight) +"rpx"
  //       })
  //   }).exec()
  // },
  /** 
 * 点击tab切换 
 */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /** 
 * 滑动切换tab 
 */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 获取直播列表
  getLivelist: function () {
    let that = this;
    let requestObj = {
      url: `${app.globalData.requestUrlobj.apimvc}/api/XcxApi/GetXcxLiveList`,
      //url: "https://apimvc2.wangxiao.cn/api/XcxApi/GetXcxLiveList",
      method: 'post',
      dataobj: {
        "ExamID": app.globalData.exameId,
        "subjectId": app.globalData.subjectId,
        //"username": app.globalData.userInfo.Username,
      }
    };
    app.globalData.myLoading('努力加载中...');
    app.globalData.wxRequestPromise(requestObj).then((res) => {
      if (res.data.ResultCode == 0) {
        //console.log(res);
        that.setData({
          courseListObj: res.data.Data
        })
      }
      app.globalData.hideMyLoading();
    }).catch((errMsg) => {
      that.setData({
        courseListObj: []
      })
      app.globalData.hideMyLoading();
      console.log(errMsg);//错误提示信息
    });
  },
  liveTapHander: function (e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    let productsid = e.currentTarget.dataset.productsid;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    if (status == 0 || status == 5) { //去播放
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        wx.navigateTo({
          url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
        })
      } else {
        // that.checkUserLogin(function () {
        //   wx.navigateTo({
        //     url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
        //   })
        // });
        that.setData({
          item: {
            showModal: true
          }
        });
      }
    }
    else if (status == 1) { //去购买
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        //如果是苹果需要显示不支持购买
        app.iosBuyShowInfo();
        if (app.globalData.systemInfo.isIOS) return;

        wx.showModal({
          title: '提示',
          content: '未购买，是否去购买该课程？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../courseDetail/courseDetail?productId=' + productsid
              })
            }
          }
        })
      } else {
        // that.checkUserLogin(function () {
        //   wx.showModal({
        //     title: '提示',
        //     content: '未购买，是否去购买该课程？',
        //     success: function (res) {
        //       if (res.confirm) {
        //         wx.navigateTo({
        //           url: '../courseDetail/courseDetail?productId=' + productsid
        //         })
        //       }
        //     }
        //   })
        // });
        that.setData({
          item: {
            showModal: true
          }
        });
      }
      
    }
    else if (status == 2) { //去直播
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        wx.navigateTo({
          url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
        })
      } else {
        // that.checkUserLogin(function () {
        //   wx.navigateTo({
        //     url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
        //   })
        // });
        that.setData({
          item: {
            showModal: true
          }
        });
      }
    }
    else if (status == 3) { //去预约
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        let requestObj = {
          //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
          url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=add&ActivityID=${id}&username=${app.globalData.userInfo.Username}`,
          method: 'post',
          dataobj: {
            "ActivityID": id,
            "username": app.globalData.userInfo.Username
          }
        };
        app.globalData.myLoading('努力加载中...');
        app.globalData.wxRequestPromise(requestObj).then((res) => {
          app.globalData.hideMyLoading();
          if (res.data.State == 1) {
            wx.showToast({
              title: '已预约',
              icon: 'success',
              duration: 2000,
              complete: function () {
                let courseListObj = that.data.courseListObj;
                courseListObj.live[index].Status = 4;
                that.setData({
                  courseListObj: courseListObj
                })
              }
            })
          }
          
        }).catch((errMsg) => {
          app.globalData.hideMyLoading();
          console.log(errMsg);//错误提示信息
        });
      } else {
        that.setData({
          item: {
            showModal: true
          }
        });
        return;//以下部分先注释
        that.checkUserLogin(function () {
          let requestObj = {
            url: `${app.globalData.requestUrlobj.apimvc}/api/XcxApi/GetXcxLiveList`,
            //url: "https://apimvc2.wangxiao.cn/api/XcxApi/GetXcxLiveList",
            method: 'post',
            dataobj: {
              "ExamID": app.globalData.exameId,
              "subjectId": app.globalData.subjectId,
              //"username": app.globalData.userInfo.Username,
            }
          };
          app.globalData.myLoading('努力加载中...');
          app.globalData.wxRequestPromise(requestObj).then((res) => {
            if (res.data.ResultCode == 0) {
              //console.log(res);
              that.setData({
                courseListObj: res.data.Data
              })

            }
            let requestObj = {
              //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
              url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=add&ActivityID=${id}&username=${app.globalData.userInfo.Username}`,
              method: 'post',
              dataobj: {
                "ActivityID": id,
                "username": app.globalData.userInfo.Username
              }
            };
            return app.globalData.wxRequestPromise(requestObj)
          }).then((res) => {
            app.globalData.hideMyLoading();
            if (res.data.State == 1) {
              wx.showToast({
                title: '已预约',
                icon: 'success',
                duration: 2000,
                complete: function () {
                  let courseListObj = that.data.courseListObj;
                  courseListObj.live[index].Status = 4;
                  that.setData({
                    courseListObj: courseListObj
                  })
                }
              })
            }
          }).
          catch((errMsg) => {
            app.globalData.hideMyLoading();
            console.log(errMsg);//错误提示信息
          });
          
          // app.globalData.myLoading('努力加载中...');
          // app.globalData.wxRequestPromise(requestObj).then((res) => {
          //   app.globalData.hideMyLoading();
          //   if (res.data.State == 1) {
          //     wx.showToast({
          //       title: '已预约',
          //       icon: 'success',
          //       duration: 2000,
          //       complete:function(){
          //         let courseListObj = that.data.courseListObj;
          //         courseListObj.live[index].Status = 4;
          //         that.setData({
          //           courseListObj: courseListObj
          //         })
          //       }
          //     })
          //   }
          // }).catch((errMsg) => {
          //   app.globalData.hideMyLoading();
          //   console.log(errMsg);//错误提示信息
          // });
        });
      }
      
    } 
    else if (status == 4) { //取消预约
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        let requestObj = {
          //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
          url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=delete&ActivityID=${id}&username=${app.globalData.userInfo.Username}`,
          method: 'post',
          dataobj: {
          }
        };
        app.globalData.myLoading('努力加载中...');
        app.globalData.wxRequestPromise(requestObj).then((res) => {
          app.globalData.hideMyLoading();
          if (res.data.State == 1) {
            wx.showToast({
              title: '已取消预约',
              icon: 'success',
              duration: 2000,
              complete: function () {
                let courseListObj = that.data.courseListObj;
                courseListObj.live[index].Status = 3;
                that.setData({
                  courseListObj: courseListObj
                })
              }
            })
          }
          
        }).catch((errMsg) => {
          app.globalData.hideMyLoading();
          console.log(errMsg);//错误提示信息
        });
      } else {
        that.setData({
          item: {
            showModal: true
          }
        });
        return;//以下部分先注释
        that.checkUserLogin(function () {
          let requestObj = {
            //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
            url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=delete&ActivityID=${id}&username=${app.globalData.userInfo.Username}`,
            method: 'post',
            dataobj: {
            }
          };
          app.globalData.myLoading('努力加载中...');
          app.globalData.wxRequestPromise(requestObj).then((res) => {
            app.globalData.hideMyLoading();
            if (res.data.State == 1) {
              wx.showToast({
                title: '已取消预约',
                icon: 'success',
                duration: 2000,
                complete: function () {
                  let courseListObj = that.data.courseListObj;
                  courseListObj.live[index].Status = 3;
                  that.setData({
                    courseListObj: courseListObj
                  })
                }
              })
            }
          }).catch((errMsg) => {
            app.globalData.hideMyLoading();
            console.log(errMsg);//错误提示信息
          });
        });
      }
    } 
    else {
      wx.showModal({
        title: '提示',
        content: this.data.status[status]
      })
    }
  },
  vodTapHander: function (e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    let productsid = e.currentTarget.dataset.productsid;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    if (status == 0 || status == 5) { //去播放
      wx.navigateTo({
        url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
      })
      // if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        
      // } else {
      //   that.checkUserLogin(function () {
      //     wx.navigateTo({
      //       url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
      //     })
      //   });
      // }
    }
    else if (status == 1) { //去购买
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        //如果是苹果需要显示不支持购买
        app.iosBuyShowInfo();
        if (app.globalData.systemInfo.isIOS) return;
        
        wx.showModal({
          title: '提示',
          content: '未购买，是否去购买该课程？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../courseDetail/courseDetail?productId=' + productsid
              })
            }
          }
        })
      } else {
        that.setData({
          item: {
            showModal: true
          }
        });
        // that.checkUserLogin(function () {
        //   wx.showModal({
        //     title: '提示',
        //     content: '未购买，是否去购买该课程？',
        //     success: function (res) {
        //       if (res.confirm) {
        //         wx.navigateTo({
        //           url: '../courseDetail/courseDetail?productId=' + productsid
        //         })
        //       }
        //     }
        //   })
        // });
      }

    }
    else if (status == 2) { //去直播
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        wx.navigateTo({
          url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
        })
      } else {
        // that.checkUserLogin(function () {
        //   wx.navigateTo({
        //     url: '../coursePlay/coursePlay?productId=' + productsid + '&id=' + id
        //   })
        // });
        that.setData({
          item: {
            showModal: true
          }
        });
      }
    }
    else if (status == 3) { //去预约
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        let requestObj = {
          //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
          url: "https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=add",
          method: 'post',
          dataobj: {
            "ActivityID": id,
            "username": app.globalData.userInfo.Username
          }
        };
        app.globalData.myLoading('努力加载中...');
        app.globalData.wxRequestPromise(requestObj).then((res) => {
          app.globalData.hideMyLoading();
          if (res.data.State == 0) {
            wx.showToast({
              title: res.data.WeixinShowInfo.Info,
              icon: 'success',
              duration: 2000,
              complete: function () {
                let courseListObj = that.data.courseListObj;
                courseListObj.vod[index].Status = 4;
                that.setData({
                  courseListObj: courseListObj
                })
              }
            })
          }

        }).catch((errMsg) => {
          app.globalData.hideMyLoading();
          console.log(errMsg);//错误提示信息
        });
      } else {
        that.setData({
          item: {
            showModal: true
          }
        });
        return;//以下部分先注释
        that.checkUserLogin(function () {
          let requestObj = {
            //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
            url: "https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=add",
            method: 'post',
            dataobj: {
              "ActivityID": id,
              "username": app.globalData.userInfo.Username
            }
          };
          app.globalData.myLoading('努力加载中...');
          app.globalData.wxRequestPromise(requestObj).then((res) => {
            app.globalData.hideMyLoading();
            if (res.data.State == 0) {
              wx.showToast({
                title: res.data.WeixinShowInfo.Info,
                icon: 'success',
                duration: 2000,
                complete: function () {
                  let courseListObj = that.data.courseListObj;
                  courseListObj.vod[index].Status = 4;
                  that.setData({
                    courseListObj: courseListObj
                  })
                }
              })
            }
          }).catch((errMsg) => {
            app.globalData.hideMyLoading();
            console.log(errMsg);//错误提示信息
          });
        });
      }

    }
    else if (status == 4) { //取消预约
      if (app.globalData.userInfo && app.globalData.userInfo.Username) {
        let requestObj = {
          //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
          url: "https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=delete",
          method: 'post',
          dataobj: {
            "ActivityID": id,
            "username": app.globalData.userInfo.Username
          }
        };
        app.globalData.myLoading('努力加载中...');
        app.globalData.wxRequestPromise(requestObj).then((res) => {
          app.globalData.hideMyLoading();
          if (res.data.State == 0) {
            wx.showToast({
              title: res.data.WeixinShowInfo.Info,
              icon: 'success',
              duration: 2000,
              complete: function () {
                let courseListObj = that.data.courseListObj;
                courseListObj.vod[index].Status = 3;
                that.setData({
                  courseListObj: courseListObj
                })
              }
            })
          }

        }).catch((errMsg) => {
          app.globalData.hideMyLoading();
          console.log(errMsg);//错误提示信息
        });
      } else {
        that.setData({
          item: {
            showModal: true
          }
        });
        return;//以下部分先注释
        that.checkUserLogin(function () {
          let requestObj = {
            //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
            url: "https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=delete",
            method: 'post',
            dataobj: {
              "ActivityID": id,
              "username": app.globalData.userInfo.Username
            }
          };
          app.globalData.myLoading('努力加载中...');
          app.globalData.wxRequestPromise(requestObj).then((res) => {
            app.globalData.hideMyLoading();
            if (res.data.State == 0) {
              wx.showToast({
                title: res.data.WeixinShowInfo.Info,
                icon: 'success',
                duration: 2000,
                complete: function () {
                  let courseListObj = that.data.courseListObj;
                  courseListObj.vod[index].Status = 3;
                  that.setData({
                    courseListObj: courseListObj
                  })
                }
              })
            }
          }).catch((errMsg) => {
            app.globalData.hideMyLoading();
            console.log(errMsg);//错误提示信息
          });
        });
      }
    }
    else {
      wx.showModal({
        title: '提示',
        content: this.data.status[status]
      })
    }
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
  //获取微信用户信息
  getWxUserInfo: function (result) {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          app.updateUserInfo({
            data: result,
            succ: function () {
              that.setData({
                isShowVideo: true
              })
            },
            error: function (resData) {
              app.globalData.callbackPageUrl = utils.getCurrentPageUrlWithArgs()
              wx.redirectTo({
                url: `/pages/login/quickLogin/quickLogin?IsShowValidatecode=${resData.IsShowValidatecode}&validatekey=${resData.validatekey}`
              });
              that.setData({
                item: {
                  showModal: false
                }
              });
            },
            canShowLogin: true
          });
        } else {
          that.setData({
            item: {
              showModal: false
            }
          });
          wx.showModal({
            title: '提示',
            content: '拒绝获取用户信息权限，您将无法获取完整用户体验，可通过我的-->权限设置进行授权。',
            confirmText: '知道了',
            showCancel: false
          });
        }
      }
    });
  }
  ,
  /**
   * 取消
   */
  onDialogCancel: function () {
    this.setData({
      item: {
        showModal: false
      }
    });
  }
})