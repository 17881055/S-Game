module.exports = function(msg, page) {
  var app = getApp();
  var obj = JSON.parse(msg);
  //console.log(obj);
  switch (obj.type) {
    case "draw":
      page.draw(obj);
      break;
    case "changeColor":
      page.changeColor(obj);
      break;
    case "changeSize":
      page.changeSize(obj);
      break;
    case "changeRubber":
      page.changeRubber(obj);
      break;
    case "clearCanvas":
      page.clearCanvas(obj);
      break;
    default:
      break;
  }
};
