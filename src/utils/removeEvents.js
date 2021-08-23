export function removeMouseEvents(obj) {
  // obj.container.removeEventListener("mousedown", obj.mousedownHandler);
  // obj.container.removeEventListener("mouseup", obj.mouseupHandler);
  // obj.container.removeEventListener("mouseleave", obj.mouseleaveHandler);
  // obj.container.removeEventListener("mousemove", obj.mousemoveHandler);
  // obj.container.removeEventListener("mouseenter", obj.mouseenterHandler);

  obj.container.onmouseenter = null;
  obj.container.onmouseup = null;
  obj.container.onmouseleave = null;
  obj.container.onmousemove = null;
  obj.container.onmouseenter = null;
}
export function removeTouchEvents(obj) {
  // obj.container.removeEventListener("touchstart", obj.touchstartHandler);
  // obj.container.removeEventListener("touchend", obj.touchendHandler);
  // obj.container.removeEventListener("touchmove", obj.touchmoveHandler);
  // obj.container.removeEventListener("touchcancel", obj.touchcancelHandler);

  obj.container.ontouchstart = null;
  obj.container.ontouchend = null;
  obj.container.ontouchmove = null;
  obj.container.ontouchcancel = null;
}
