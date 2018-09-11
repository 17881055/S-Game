const CONFIG = require("./config/base");
const socket = require("./socket/connect.js");
//app.js
App({
  onLaunch: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.globalData.hasAuth = true;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  login: function(name = `游客${Math.floor(Math.random() * 999 + 100)}`, url = `http://${CONFIG.URL}/images/def_user_bg.jpg`) {
    var defUser = {
      avatarUrl: url,
      nickName: name
    };
    this.globalData.userInfo = defUser;
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback({
        userInfo: defUser
      });
    }
    wx.login({
      success: res => {
        console.log("1");
        if (res.code) {
          if (!socket.socketOpened) {
            socket.connect({
              code: res.code,
              name: name,
              url: url
            });
          }
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    hasAuth: false
  }
});
