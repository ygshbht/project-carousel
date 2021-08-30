export function removeMouseEvents(obj) {
  obj.container.onmouseenter = null;
  obj.container.onmouseup = null;
  obj.container.onmouseleave = null;
  obj.container.onmousemove = null;
  obj.container.onmouseenter = null;
}
export function removeTouchEvents(obj) {
  obj.container.ontouchstart = null;
  obj.container.ontouchend = null;
  obj.container.ontouchmove = null;
  obj.container.ontouchcancel = null;
}
