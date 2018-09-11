module.exports = function(msg, page) {
  var app = getApp();
  var obj = JSON.parse(msg);

  switch (obj.type) {
    case "UPDATE_ONLINE":
      console.log("%c %s %o", "color: #0000ff", obj.type, obj);
      page.updateOnline(obj);
      break;
    case "UPDATE_LOBBY":
      console.log("%c %s %o", "color: #0000ff", obj.type, obj);
      page.updateGameOnline(obj);
      break;
    default:
      break;
  }
};
