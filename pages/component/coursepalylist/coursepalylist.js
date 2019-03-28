// pages/component/coursepalylist/coursepalylist.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productsId: {
      type: String,
      value: ''
    },
    playId: {
      type: String,
      value: ''
    },
    defaultuu: {
      type: String,
      value: ''
    },
    defaultvu: {
      type: String,
      value: ''
    },
    defaultActivityId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    coursePlaylist: [],
    activeTabData: {
      subjectId: '',
      coursesId: '',
      classesId: '',
      activityId:''
    },
    currentSubjectIndex: 0,
    currentCourseIndex: 0,
    currentClassIndex: 0,
    isStopPlay: false,
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
      // 0: '播放',
      // 1: '购买',
      // 2: '正在直播',
      // 3: '直播未开始',
      // 4: '直播已结束不可播放',
      // 5: '直播已结束可播放',
      // 6: '无课时可播放',
      // 7: '视频暂时不支持播放',
      // 8: '商品无课时敬请期待',
      // 9: '正在直播未购买',
      // 10: '全部课程已过期',
      // 11: '课时所在课程已过期',
      // 12: '商品已停售',
      // 13: '商品已售罄'
    },
    statusClass: {
      0: 'classes-content-item-right',
      1: 'classes-content-item-right-buy',
      2: 'classes-content-item-right-live',
      3: 'classes-content-item-right-bespeak',
      4: 'classes-content-item-right-hasbespeak',
      5: 'classes-content-item-right',
      6: 'classes-content-item-right-noplay',
      7: 'classes-content-item-right-noplay',
      8: 'classes-content-item-right-noplay',
      9: 'classes-content-item-right-noplay'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData: function () {
      let that = this;
      let requestObj = {
        url: `${app.globalData.requestUrlobj.apimvc}/api/XcxApi/GetProductSubjects`,
        //url: 'https://apimvc2.wangxiao.cn/api/XcxApi/GetProductSubjects',
        method: 'post',
        dataobj: {
          "ExamID": app.globalData.exameId,
          "ProductsId": that.data.productsId,
          "username": app.globalData.userInfo.Username,
          "Id": that.data.playId
        }
      };
      if (that.data.playId) {
        requestObj.dataobj.Id = that.data.playId
      }
      //app.globalData.myLoading('努力加载中...');
      app.globalData.wxRequestPromise(requestObj).then((res) => {
        if (res.data.ResultCode == 0) {
          //数据处理函数
          that.setData({ coursePlaylist: res.data.Data });
          // that.setData({
          //   defaultuu: res.data.Data.CoursePlayClassHours.UserUnique,
          //   defaultvu: res.data.Data.CoursePlayClassHours.VideoUnique,
          //   defaultActivityId: res.data.Data.CoursePlayClassHours.activityId
          // });
          let activeTabData = {
            subjectId: '',
            coursesId: '',
            classesId: '',
            activityId:''
          }
          that.data.coursePlaylist.forEach(function (subjects, subjectsindex) {
            if (subjects.Courses && subjects.Courses.length != 0) {
              subjects.Courses.forEach(function (courses, coursesindex) {
                if (courses.RecentClassHours && courses.RecentClassHours.length != 0) {
                  courses.RecentClassHours.forEach(function (classes, classesindex) {
                    if (classes.UserUnique == that.data.defaultuu && classes.VideoUnique == that.data.defaultvu) {
                      activeTabData.subjectId = subjects.Id;
                      activeTabData.coursesId = courses.Id;
                      activeTabData.classesId = classes.Id;
                      that.setData({
                        currentSubjectIndex: subjectsindex,
                        currentCourseIndex: coursesindex,
                        currentClassIndex: classesindex
                      });
                    }
                    if (classes.activityId && classes.activityId == that.data.defaultActivityId) {
                      activeTabData.activityId = classes.activityId;
                      that.setData({
                        currentSubjectIndex: subjectsindex,
                        currentCourseIndex: coursesindex,
                        currentClassIndex: classesindex
                      });
                    }
                  })
                }
              })
            }
          })
          that.setData({ activeTabData: activeTabData });
          //console.log(that.data.currentSubjectIndex);
          //console.log(that.data.currentCourseIndex);
          //console.log(that.data.currentClassIndex);
          //app.globalData.hideMyLoading();
          // let options = {
          //   uu:'',
          //   vu:'',
          //   isbuy:true,
          //   switchType:true,
          //   isStopPlay:false
          // }
          // options.uu = that.data.defaultuu;
          // options.vu = that.data.defaultvu;
          // that.triggerEvent('playevent', options, {})
          //that.setVideoData(that.data.CoursePlayClassHours.UserUnique, that.data.CoursePlayClassHours.VideoUnique)
        }
      }).catch((errMsg) => {
        //app.globalData.hideMyLoading();
        console.log(errMsg);//错误提示信息
      });
    },
    tapSubjectsItem: function (e) {
      let subjectIndex = e.currentTarget.dataset.subjectsindex;
      if (this.data.currentSubjectIndex == subjectIndex) { //  已展开的合上
        this.setData({
          currentSubjectIndex: -1
        })
      } else {
        this.setData({ //未展开的展开
          currentSubjectIndex: subjectIndex,
          currentCourseIndex: -1,
          currentClassIndex: -1
        })
      }

    },
    tapCourseItem: function (e) {
      let that = this;
      let subjectIndex = e.currentTarget.dataset.subjectsindex;
      let CourseIndex = e.currentTarget.dataset.coursesindex;
      let CourseId = e.currentTarget.dataset.coursesid;
      // console.log(this.data.coursePlaylist);
      // console.log(subjectIndex + '' + CourseIndex);
      if (that.data.currentSubjectIndex == subjectIndex && that.data.currentCourseIndex == CourseIndex) { //  已展开的合上
        that.setData({
          currentCourseIndex: -1
        })
      } else {
        if (that.data.coursePlaylist[subjectIndex]['Courses'][CourseIndex].RecentClassHours && that.data.coursePlaylist[subjectIndex]['Courses'][CourseIndex].RecentClassHours.length == 0) {
          let requestObj = {
            url: `${app.globalData.requestUrlobj.apimvc}/api/Course/GetClassHoursList`,
            //url: 'https://apimvc2.wangxiao.cn/api/Course/GetClassHoursList',
            method: 'post',
            dataobj: {
              "Id": CourseId,
              "username": app.globalData.userInfo.Username,
            }
          };
          app.globalData.myLoading('努力加载中...');
          app.globalData.wxRequestPromise(requestObj).then((res) => {
            if (res.data.ResultCode == 0) {
              //数据处理函数
              console.log(res)
              let coursePlaylist = that.data.coursePlaylist;
              coursePlaylist[subjectIndex]['Courses'][CourseIndex].RecentClassHours = res.data.Data.RecentClassHours;
              that.setData({ coursePlaylist: coursePlaylist });
              app.globalData.hideMyLoading();
            }
          }).catch((errMsg) => {
            app.globalData.hideMyLoading();
            console.log(errMsg);//错误提示信息
          });
        }


        that.setData({
          currentSubjectIndex: subjectIndex,
          currentCourseIndex: CourseIndex,
          currentClassIndex: -1
        })
      }

    },
    toSwitchPlay: function (e) {
      let that = this;
      //console.log(e)
      //var myEventDetail = {a:1} // detail对象，提供给事件监听函数
      // 0: '播放',
      //   1: '购买',
      //     2: '直播中',
      //       3: '去预约',
      //         4: '已预约',
      //           5: '回放',
      //             6: '正在准备视频',
      //               7: '分享解锁',
      //                 8: '好评解锁',
      //                   9: '已下线'
      let classid = e.currentTarget.dataset.classesid;
      let status = e.currentTarget.dataset.status;
      let subjectsindex = e.currentTarget.dataset.subjectsindex;
      let coursesindex = e.currentTarget.dataset.coursesindex;
      let classesindex = e.currentTarget.dataset.classesindex;
      //console.log(subjectsindex + '' + coursesindex + "" + classesindex);
      //console.log(that.data.coursePlaylist[subjectsindex][coursesindex][classesindex]);
      if (status == 3) { //预约
        if (app.globalData.userInfo && app.globalData.userInfo.Username) {
          let requestObj = {
            //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
            url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=add&ActivityID=${classid}&username=${app.globalData.userInfo.Username}`,
            method: 'post',
            dataobj: {
              "ActivityID": classid,
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
                  let coursePlaylist = that.data.coursePlaylist;
                  coursePlaylist[subjectsindex].Courses[coursesindex].RecentClassHours[classesindex].ClassHoursStatus = 4;
                  that.setData({
                    coursePlaylist: coursePlaylist
                  })
                }
              })
            }

          }).catch((errMsg) => {
            app.globalData.hideMyLoading();
            console.log(errMsg);//错误提示信息
          });
        } else {
          that.checkUserLogin(function () {
            let requestObj = {
              url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
              //url: 'https://apimvc2.wangxiao.cn/api/Course/Detail',
              method: 'post',
              dataobj: {
                "ExamID": app.globalData.exameId,
                "ProductsId": that.data.productsId,
                "username": app.globalData.userInfo.Username,
              }
            };
            if (that.data.playId) {
              requestObj.dataobj.Id = that.data.playId
            }
            app.globalData.myLoading('努力加载中...');
            app.globalData.wxRequestPromise(requestObj).then((res) => {
              if (res.data.ResultCode == 0) {
                //数据处理函数
                that.setData({ coursePlaylist: res.data.Data.Subjects });
                that.setData({
                  defaultuu: res.data.Data.CoursePlayClassHours.UserUnique,
                  defaultvu: res.data.Data.CoursePlayClassHours.VideoUnique
                });
                let activeTabData = {
                  subjectId: '',
                  coursesId: '',
                  classesId: ''
                }
                that.data.coursePlaylist.forEach(function (subjects, subjectsindex) {
                  if (subjects.Courses && subjects.Courses.length != 0) {
                    subjects.Courses.forEach(function (courses, coursesindex) {
                      if (courses.RecentClassHours && courses.RecentClassHours.length != 0) {
                        courses.RecentClassHours.forEach(function (classes, classesindex) {
                          if (classes.UserUnique == that.data.defaultuu && classes.VideoUnique == that.data.defaultvu) {
                            activeTabData.subjectId = subjects.Id;
                            activeTabData.coursesId = courses.Id;
                            activeTabData.classesId = classes.Id;
                            that.setData({
                              currentSubjectIndex: subjectsindex,
                              currentCourseIndex: coursesindex,
                              currentClassIndex: classesindex
                            });
                          }
                        })
                      }
                    })
                  }
                })
                that.setData({ activeTabData: activeTabData });
                app.globalData.hideMyLoading();
              }
              let requestObj = {
                //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
                url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=add&ActivityID=${classid}&username=${app.globalData.userInfo.Username}`,
                method: 'post',
                dataobj: {
                  "ActivityID": classid,
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
                    let coursePlaylist = that.data.coursePlaylist;
                    coursePlaylist[subjectsindex].Courses[coursesindex].RecentClassHours[classesindex].ClassHoursStatus = 4;
                    that.setData({
                      coursePlaylist: coursePlaylist
                    })
                  }
                })
              }
            }).
              catch((errMsg) => {
                app.globalData.hideMyLoading();
                console.log(errMsg);//错误提示信息
              });
          });
        }
        return;
      } else if (status == 4) {//取消预约
        if (app.globalData.userInfo && app.globalData.userInfo.Username) {
          let requestObj = {
            //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
            url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=delete&ActivityID=${classid}&username=${app.globalData.userInfo.Username}`,
            method: 'post',
            dataobj: {
              "ActivityID": classid,
              "username": app.globalData.userInfo.Username
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
                  let coursePlaylist = that.data.coursePlaylist;
                  coursePlaylist[subjectsindex].Courses[coursesindex].RecentClassHours[classesindex].ClassHoursStatus = 3;
                  that.setData({
                    coursePlaylist: coursePlaylist
                  })
                }
              })
            }

          }).catch((errMsg) => {
            app.globalData.hideMyLoading();
            console.log(errMsg);//错误提示信息
          });
        } else {
          that.checkUserLogin(function () {
            let requestObj = {
              url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
              //url: 'https://apimvc2.wangxiao.cn/api/Course/Detail',
              method: 'post',
              dataobj: {
                "ExamID": app.globalData.exameId,
                "ProductsId": that.data.productsId,
                "username": app.globalData.userInfo.Username,
              }
            };
            if (that.data.playId) {
              requestObj.dataobj.Id = that.data.playId
            }
            app.globalData.myLoading('努力加载中...');
            app.globalData.wxRequestPromise(requestObj).then((res) => {
              if (res.data.ResultCode == 0) {
                //数据处理函数
                that.setData({ coursePlaylist: res.data.Data.Subjects });
                that.setData({
                  defaultuu: res.data.Data.CoursePlayClassHours.UserUnique,
                  defaultvu: res.data.Data.CoursePlayClassHours.VideoUnique
                });
                let activeTabData = {
                  subjectId: '',
                  coursesId: '',
                  classesId: ''
                }
                that.data.coursePlaylist.forEach(function (subjects, subjectsindex) {
                  if (subjects.Courses && subjects.Courses.length != 0) {
                    subjects.Courses.forEach(function (courses, coursesindex) {
                      if (courses.RecentClassHours && courses.RecentClassHours.length != 0) {
                        courses.RecentClassHours.forEach(function (classes, classesindex) {
                          if (classes.UserUnique == that.data.defaultuu && classes.VideoUnique == that.data.defaultvu) {
                            activeTabData.subjectId = subjects.Id;
                            activeTabData.coursesId = courses.Id;
                            activeTabData.classesId = classes.Id;
                            that.setData({
                              currentSubjectIndex: subjectsindex,
                              currentCourseIndex: coursesindex,
                              currentClassIndex: classesindex
                            });
                          }
                        })
                      }
                    })
                  }
                })
                that.setData({ activeTabData: activeTabData });
                app.globalData.hideMyLoading();
              }
              let requestObj = {
                //url: `${app.globalData.requestUrlobj.apimvc}/api/Course/Detail`,
                url: `https://api.wangxiao.cn/live/LiveActivityAppointment.ashx?t=delete&ActivityID=${classid}&username=${app.globalData.userInfo.Username}`,
                method: 'post',
                dataobj: {
                  "ActivityID": classid,
                  "username": app.globalData.userInfo.Username
                }
              };
              return app.globalData.wxRequestPromise(requestObj)
            }).then((res) => {
              app.globalData.hideMyLoading();
              if (res.data.State == 1) {
                wx.showToast({
                  title: '已取消预约',
                  icon: 'success',
                  duration: 2000,
                  complete: function () {
                    let coursePlaylist = that.data.coursePlaylist;
                    coursePlaylist[subjectsindex].Courses[coursesindex].RecentClassHours[classesindex].ClassHoursStatus = 3;
                    that.setData({
                      coursePlaylist: coursePlaylist
                    })
                  }
                })
              }
            }).
              catch((errMsg) => {
                app.globalData.hideMyLoading();
                console.log(errMsg);//错误提示信息
              });
          });
        }
        return;
      } else if (status == 1) {
        let playeventOptions = e.currentTarget.dataset;
        that.triggerEvent('playevent', playeventOptions, {})
        return;
      } else if (status == 0 || status == 5){
        let playeventOptions = e.currentTarget.dataset;
        let activeTabData = this.data.activeTabData;
        if (activeTabData.classesId == classid) {//暂停或执行播放。
          if (this.data.isStopPlay) {
            this.setData({
              isStopPlay: true
            })
            playeventOptions.switchType = false;
            playeventOptions.isStopPlay = true;
          } else {
            this.setData({
              isStopPlay: false
            })
            playeventOptions.switchType = false;
            playeventOptions.isStopPlay = false;
          }
          this.triggerEvent('playevent', playeventOptions, {})
        } else { //切换视频
          activeTabData.classesId = classid;
          playeventOptions.switchType = true;
          this.setData({
            activeTabData: activeTabData
          });
          this.triggerEvent('playevent', playeventOptions, {})
        }
      }


    }
  },
  ready: function () {
    this.initData()
  }
})
