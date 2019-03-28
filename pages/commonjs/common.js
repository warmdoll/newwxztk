var commonObj={
  wxRequestfn: function (requestObj) {
    wx.request({
      url: requestObj.url,
      method: requestObj.method,
      header: {
        "SysClassId": requestObj.sysclassId,
        'from': 'xcx'
      },
      data: requestObj.dataobj,
      success: function (res) {
        requestObj.callbackk1(res);
      },
      fail: function () {
        requestObj.callback2();
      }
    });
  },
  /**************************************时间格式化处理************************************/
  dateFtt: function (fmt, date) { 
    var o = {
      "M+": date.getMonth() + 1,                 //月份   
      "d+": date.getDate(),                    //日   
      "h+": date.getHours(),                   //小时   
      "m+": date.getMinutes(),                 //分   
      "s+": date.getSeconds(),                 //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt)){
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
  }
}
module.exports.commonObj = commonObj