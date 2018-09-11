//index.js
//获取应用实例
const app = getApp();
const socket = require("../../socket/connect.js");
const msg = require("../../socket/indexMsgHandler.js");

Page({
  data: {
    online: 0,
    num: 0, //游戏人数
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },
  //事件处理函数
  bindViewTap: function(e) {
    switch (e.currentTarget.dataset.name) {
      case "lobby":
        wx.navigateTo({
          url: "../lobby/index"
        });
        break;
    }
  },
  onLoad: function() {
    console.log(2);
    socket.setReceiveCallback("index", msg, this);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: app.globalData.hasAuth
      });
      app.login(app.globalData.userInfo.nickName, app.globalData.userInfo.avatarUrl);
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: app.globalData.hasAuth
        });
      };
      app.login();
    }
  },
  updateOnline: function(obj) {
    this.setData({
      online: obj.total
    });
  },
  updateGameOnline: function(obj) {
    this.setData({
      num: obj.total
    });
  },
  getUserInfo: function(e) {
    if (!e.detail.userInfo) return;
    app.globalData.userInfo = e.detail.userInfo;
    app.globalData.hasAuth = true;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: app.globalData.hasAuth
    });
  }
});
