import calcScaleFromAngle from "./calcScale.js";

export default function setNewRadius(elem, elemRotation, index) {
  if (elemRotation > 90 && elemRotation < 270) return;
  if (elemRotation < -90 && elemRotation > -270) return;

  let toScale = calcScaleFromAngle(elemRotation, elem.initialRadius, index);

  let elemStyle = getComputedStyle(elem);
  let transformOrigin = elemStyle.transformOrigin.split(" ");

  let newRadius = elem.initialRadius * toScale;
  newRadius = -Math.abs(newRadius);

  let newTransformOrigin = `${transformOrigin[0]} ${transformOrigin[1]} ${newRadius}px`;

  elem.style.transformOrigin = newTransformOrigin;
}
