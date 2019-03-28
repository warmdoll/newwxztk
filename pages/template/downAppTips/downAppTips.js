/*
显示toast提示
title:    提示的内容 必填
icon:     图标，//请指定正确的路径，选填
duration: 提示的延迟时间，单位毫秒，默认：1500, 10000永远存在除非手动清除 选填
mask:     是否显示透明蒙层，防止触摸穿透，默认：true 选填
cb:       接口调用成功的回调函数 选填
 */
var app = new getApp();
function showDownAppTips(downAppObj) {
  var that = getCurrentPages()[getCurrentPages().length - 1];//获取当前page实例
    appNamefn(downAppObj);
 
} 
function appNamefn(downAppObj){
  var that = getCurrentPages()[getCurrentPages().length - 1],//获取当前page实例
  returnObj={},
    requestObj = {
      //url: 'https://appconfig2.wangxiao.cn/Service/GetAdviertisement?sign=' + downAppObj.appSign+'&DeviceType=0',
      url: `${app.globalData.requestUrlobj.appconfig}/Service/GetAdviertisement?sign=${downAppObj.appSign}&DeviceType=0`,
      method: 'get',
      dataobj: {},
      callback1:function(res){
        if (res.data.ResultCode==0){
          returnObj= res.data.Data;
          that.setData({
            downAppShowToast: downAppObj.downAppShowToast,
            appName: returnObj.Title,
            logoImg: returnObj.LogoUrl
          });
        }
       
      },
      callback2: ""
    };
  app.globalData.wxRequestfn(requestObj);

} 
module.exports = {
  showDownAppTips: showDownAppTips
}