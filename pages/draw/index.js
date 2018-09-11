var websocket = require("../../socket/connect.js");
var msgReceived = require("../../socket/msgDrawHandler.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClear: false,
    color: "#000000",
    pen: 5
  },

  bindViewTap: function(e) {
    switch (e.target.dataset.name) {
      case "red":
        this.setData({
          color: "#FF3030"
        });
        websocket.send({
          type: "changeColor",
          value: "#FF3030"
        });
        break;
      case "black":
        this.setData({
          color: "#000000"
        });
        websocket.send({
          type: "changeColor",
          value: "#000000"
        });
        break;
      case "blue":
        this.setData({
          color: "#1C86EE"
        });
        websocket.send({
          type: "changeColor",
          value: "#1C86EE"
        });
        break;
      case "size5":
        this.setData({
          pen: 5
        });
        websocket.send({
          type: "changeSize",
          value: 5
        });
        break;
      case "size10":
        this.setData({
          pen: 10
        });
        websocket.send({
          type: "changeSize",
          value: 10
        });
        break;
      case "rubber":
        let value = !this.data.isClear;
        this.setData({
          isClear: value
        });
        websocket.send({
          type: "changeRubber",
          value: value
        });
        break;
      case "clear":
        this.clearCanvas();
        break;
    }
  },
  clearCanvas: function() {
    if (!this.context) return;
    this.context.draw();
    websocket.send({
      type: "clearCanvas",
      value: "clearCanvas"
    });
  },
  touchStart: function(e) {
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x;
    this.startY = e.changedTouches[0].y;
    this.context = wx.createCanvasContext("drawCanvas");
    if (this.data.isClear) {
      //是否启用的橡皮擦功能
      this.context.setStrokeStyle("#ffffff");
      this.context.setLineCap("round"); //设置线条端点的样式
      this.context.setLineJoin("round"); //设置两线相交处的样式
      this.context.setLineWidth(30); //设置线条宽度
      this.context.save(); //保存当前坐标轴的缩放、旋转、平移信息
      this.context.beginPath(); //开始一个路径
      this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true); //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形
      this.context.fill(); //对当前路径进行填充
      this.context.restore(); //恢复之前保存过的坐标轴的缩放、旋转、平移信息
    } else {
      this.context.setStrokeStyle(this.data.color);
      this.context.setLineWidth(this.data.pen);
      this.context.setLineCap("round"); // 让线条圆润
      this.context.beginPath();
    }
  },
  //手指触摸后移动
  touchMove: function(e) {
    var endX = e.changedTouches[0].x;
    var endY = e.changedTouches[0].y;
    if (this.data.isClear) {
      //判断是否启用的橡皮擦功能
      this.context.save(); //保存当前坐标轴的缩放、旋转、平移信息
      this.context.moveTo(this.startX, this.startY); //把路径移动到画布中的指定点，但不创建线条
      this.context.lineTo(endX, endY); //添加一个新点，然后在画布中创建从该点到最后指定点的线条
      this.context.stroke(); //对当前路径进行描边
      this.context.restore();
      websocket.send({
        type: "draw",
        startX: this.startX,
        startY: this.startY,
        endX: endX,
        endY: endY
      });
      this.startX = endX;
      this.startY = endY;
    } else {
      this.context.moveTo(this.startX, this.startY);
      this.context.lineTo(endX, endY);
      this.context.stroke();
      websocket.send({
        type: "draw",
        startX: this.startX,
        startY: this.startY,
        endX: endX,
        endY: endY
      });
      this.startX = endX;
      this.startY = endY;
    }
    this.context.closePath();
    this.context.draw(true);
  },

  touchEnd: function(e) {},
  //禁止滑动
  disMove: function() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!websocket.socketOpened) {
      websocket.setReceiveCallback(msgReceived, this);
      websocket.connect(options.room);
      websocket.send({
        type: "create-draw"
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
