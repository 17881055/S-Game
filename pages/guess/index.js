var websocket = require("../../socket/connect.js");
var msgReceived = require("../../socket/msgGuessHandler.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClear: false,
    color: "#000000",
    pen: 5,
    items: [
      {value: '狗', name: 'dog'},
      {value: '猫', name: 'cat', checked: 'true'},
      {value: '羊', name: 'sheep'},
      {value: '猪', name: 'pig'}
    ]
  },

  draw: function(obj) {
    if (this.data.isClear) {
      //是否启用的橡皮擦功能
      this.context.setStrokeStyle("#ffffff");
      this.context.setLineCap("round"); //设置线条端点的样式
      this.context.setLineJoin("round"); //设置两线相交处的样式
      this.context.setLineWidth(30); //设置线条宽度
      this.context.save(); //保存当前坐标轴的缩放、旋转、平移信息
      this.context.beginPath(); //开始一个路径
      this.context.fill(); //对当前路径进行填充
      this.context.restore(); //恢复之前保存过的坐标轴的缩放、旋转、平移信息
    } else {
      this.context.setStrokeStyle(this.data.color);
      this.context.setLineWidth(this.data.pen);
      this.context.setLineCap("round"); // 让线条圆润
      this.context.beginPath();
    }
    //判断是否启用的橡皮擦功能
    this.context.moveTo(obj.startX, obj.startY);
    this.context.lineTo(obj.endX, obj.endY);
    this.context.stroke();
    this.context.closePath();
    this.context.draw(true);
  },

  changeRubber: function(obj) {
    this.setData({
      isClear: obj.value
    });
  },

  changeSize: function(obj) {
    this.setData({
      pen: obj.value
    });
  },
  changeColor: function(obj) {
    this.setData({
      color: obj.value
    });
  },
  clearCanvas: function() {
    if (!this.context) return;
    this.context.draw();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!websocket.socketOpened) {
      websocket.setReceiveCallback(msgReceived, this);
      websocket.connect(options.room);
      websocket.send({
        type: "create-guess"
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (!this.context) this.context = wx.createCanvasContext("guessCanvas");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

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
