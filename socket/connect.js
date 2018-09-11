module.exports = (function() {
  var ip1 = "192.168.7.110:8624";
  var ip2 = "192.168.13.39:8624";
  var ip3 = "192.168.1.222:8624";
  var ip4 = "119.29.11.137:8624";
  var ip5 = "www.wellwell.wang";

  //var webSocketUrl = "wss://" + ip5 + "/login",
  var webSocketUrl = "ws://" + ip1 + "/login",
    //var webSocketUrl = "ws://" + ip4 + "/login",
    socketOpened = false, // 标记websocket是否已经打开
    socketMsgQueue = [],
    connCallback = null,
    msgReceivedMap = new Map();

  /**
   * Socket
   * @param {Object} data
   * {
   *  code
   *  name
   *  url
   * }
   * @param {Function} callback
   */
  function connect(data, callback) {
    // 发起链接
    wx.connectSocket({
      url: `${webSocketUrl}?name=${data.name}&code=${data.code}&url=${data.url}`
    });
    connCallback = callback;
  }

  function initEvent() {
    wx.onSocketOpen(function(res) {
      // webSocket打开事件处理
      socketOpened = true;
      console.log("%c socket connect success", "color: #00ff00");
      // 处理一下没发出去的消息
      while (socketMsgQueue.length > 0) {
        var msg = socketMsgQueue.pop();
        sendSocketMessage(msg);
      }
      connCallback && connCallback.call(null);
    });
    // 收到服务器消息时的处理
    wx.onSocketMessage(function(res) {
      //console.log("received msg: " + res.data, msgReceivedMap);
      for (var [key, value] of msgReceivedMap) {
        var msgReceived = value;
        msgReceived.callback && msgReceived.callback.call(null, res.data, ...msgReceived.params);
      }
    });
    // 链接出错时的处理
    wx.onSocketError(function(res) {
      console.log("%c socket connect fail", "color: #ff0000");
    });
  }

  function sendSocketMessage(msg) {
    if (typeof msg === "object") {
      msg = JSON.stringify(msg);
    }
    if (socketOpened) {
      wx.sendSocketMessage({
        data: msg
      });
    } else {
      // 发送的时候，链接还没建立
      socketMsgQueue.push(msg);
    }
  }

  /**
   *
   * @param {String} name
   * @param {Function} callback
   * @param {*} params
   */
  function setReceiveCallback(name, callback, ...params) {
    if (callback) {
      var msgReceived = {};
      msgReceived.callback = callback;
      msgReceived.params = params;
      msgReceivedMap.set(name, msgReceived);
    }
  }

  function init() {
    initEvent();
  }

  init();
  return {
    connect: connect,
    send: sendSocketMessage,
    setReceiveCallback: setReceiveCallback,
    socketOpened: socketOpened
  };
})();
