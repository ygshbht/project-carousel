export function setContainerStyles(container, isOrthographic) {
  container.style.userSelect = "none";
  container.style.position = "relative";
  container.style.display = "flex";

  let maxHeight = 0;
  let children = Array.from(container.children);
  children.forEach((child) => {
    let childHeight = child.offsetHeight;
    if (childHeight > maxHeight) maxHeight = childHeight;
  });
  container.style.minHeight = maxHeight + "px";

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
