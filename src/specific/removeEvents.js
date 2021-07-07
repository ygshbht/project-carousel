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

export function setContainerStyles(container, isOrthographic) {
  container.style.userSelect = "none";
  container.style.position = "relative";
  container.style.display = "flex";

  container.style.justifyContent = "center";
  if (!isOrthographic) container.style.perspective = "1000px";
}

export function setWrapperStyles(wrapper, isOrthographic) {
  wrapper.style.userSelect = "none";
  wrapper.style.position = "absolute";
  wrapper.style.transform = "rotateY(1deg)";
  wrapper.style.backfaceVisibility = "hidden";
  wrapper.style.pointerEvents = "none";

  let kids = wrapper.querySelectorAll("*");
  kids.forEach((kid) => {
    kid.style.pointerEvents = "auto";
  });

  if (isOrthographic) wrapper.style.transformStyle = "preserve-3d";
}
