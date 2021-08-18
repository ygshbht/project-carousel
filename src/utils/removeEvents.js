export function removeMouseEvents(obj) {
  obj.container.removeEventListener("mousedown", obj.mousedownHandler);
  obj.container.removeEventListener("mouseup", obj.mouseupHandler);
  obj.container.removeEventListener("mouseleave", obj.mouseleaveHandler);
  obj.container.removeEventListener("mousemove", obj.mousemoveHandler);
  obj.container.removeEventListener("mouseenter", obj.mouseenterHandler);
}
export function removeTouchEvents(obj) {
  obj.container.removeEventListener("touchstart", obj.touchstartHandler);
  obj.container.removeEventListener("touchend", obj.touchendHandler);
  obj.container.removeEventListener("touchmove", obj.touchmoveHandler);
  obj.container.removeEventListener("touchcancel", obj.touchcancelHandler);
}


