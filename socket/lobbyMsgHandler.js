module.exports = function(msg, page) {
  var app = getApp();
  var obj = JSON.parse(msg);
  switch (obj.type) {
    case "UPDATE_LOBBY_INFO":
      console.log("%c %s %o", "color: #0000a3", obj.type, obj);
      page.getLobbyInfoSuccess(obj.roomList);
      break;
    default:
      break;
  }
};
