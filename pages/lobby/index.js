//获取应用实例
const app = getApp();
const socket = require("../../socket/connect.js");
const msg = require("../../socket/lobbyMsgHandler.js");
Page({
  /**
   * 页面的初始数据
   * {
   * gameName:"你画我猜",
   * gameState:"",
   * member:[],
   * name:"room-1",
   * num:1
   * }
   */
  data: {
    userInfo: {},
    rooms: []
  },
  //事件处理函数
  bindViewTap: function(e) {
    wx.navigateTo({
      url: `../room/index?room=${e.currentTarget.dataset.num}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad");
    socket.setReceiveCallback("lobby", msg, this);
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    });
  },

  getLobbyInfoSuccess: function(data) {
    this.setData({
      rooms: data
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow");
    socket.send({
      type: "joinLobby"
    });
    socket.send({
      type: "getLobbyInfo"
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
