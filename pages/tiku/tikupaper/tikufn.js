var app = new getApp();
var tikuObj = {
  //点击下次继续---请求接口
  backPageRequest: function (tikuparmObj) {
    var that = this,

      dataObj = {
        Data: {
          ID: tikuparmObj.paperHistoryid,//试卷历史记录id
          LastQuestionIndex: tikuparmObj.currentTinum,
          UserTestCount: tikuparmObj.havedotiCount
        },
      },
      requestObj = {
        url: app.globalData.requestUrlobj.tikuapi + '/api/PaperHistory/Update',
        method: 'post',
        dataobj: dataObj,
        callback1: that.backPageRequestcallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  backPageRequestcallback: function (res) {
  },
  // 点击提交--请求接口
  submitPageRequest: function (tikuparmObj) {
    var that = this,

      dataObj = {
        Data: {
          ID: tikuparmObj.paperHistoryid,
          Username: app.globalData.userInfo.Username,
          PaperID: tikuparmObj.paperId,
          UserScore: tikuparmObj.userScore,
          Source: 1,
          Status: 1
        },
      },
      requestObj = {
        url: app.globalData.requestUrlobj.tikuapi + '/api/PaperHistory/Submit',
        method: 'post',
        dataobj: dataObj,
        callback1: that.submitRequestcallback,
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
  submitRequestcallback: function (res) {
  
  },
  //退出试题题库页面弹出框
  backPage: function (tikuparmObj) {
    var that = this;
    //如果是试卷相关题库--返回弹出框  http://tikuapi.wangxiao.cn/api/PaperHistory/Update
    if (tikuparmObj.havedotiCount>0){
      // 如果上次最后一道题大于0 弹框显示 是否继续
      wx.showModal({
        title: '提示',
        content: '您还有题目尚未完成确定要退出吗',
        cancelText: "下次继续",
        cancelColor: '#58a6f8',
        confirmText: '提交',
        confirmColor: '#58a6f8',
        success: function (resbtn) {
          if (resbtn.confirm) {
            //点击提交
            that.submitPageRequest(tikuparmObj);
            wx.navigateTo({
              url: '../evaluationReport/evaluationReport?source=' + tikuparmObj.source
            })
            //点击提交
          } else if (resbtn.cancel) {
            //点击下次继续
            that.backPageRequest(tikuparmObj);
          }

        }
      })
    }else{
      that.submitPageRequest(tikuparmObj);
    }
   
  },


}
// 试卷考试模式
var paperExameObj={
  //秒转小时分钟00:00:00
  changeTime:function(s){
    var that=this,t;
    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour < 10) {
        t = '0' + hour + ":";
      } else {
        t = hour + ":";
      }

      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += parseInt(sec);
    }
    return t;

  },
  stopDati:function(){
    
  },
  //答题已用时长
  haveUsedTimne: function (tikuparmObj) {
    var that = this,
      dataObj = {
        Data: {
          ID: tikuparmObj.paperHistoryid,//试卷历史记录id
          LastQuestionIndex: tikuparmObj.currentTinum,
          UserTestCount: tikuparmObj.havedotiCount,
          UsedSeconds: tikuparmObj.usedSeconds,

        },
      },
      requestObj = {
        url: app.globalData.requestUrlobj.tikuapi + '/api/PaperHistory/Update',
        method: 'post',
        dataobj: dataObj,
        callback1: function(res){

        },
        callback2: ""
      };
    app.globalData.wxRequestfn(requestObj);
  },
}
module.exports.tikuObj = tikuObj;
module.exports.paperExameObj = paperExameObj;