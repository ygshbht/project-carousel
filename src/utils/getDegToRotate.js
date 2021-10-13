import { getRotationY } from "../utils.js";

export default function getDegToRotate(rotationCausingElem, rotationDirection) {
  let elemRotation = getRotationY(rotationCausingElem);

  let degreeToRotate;
  if (rotationDirection === "left") {
    if (elemRotation < 0) {
      degreeToRotate = -(360 + elemRotation);
    } else if (elemRotation > 0) {
      degreeToRotate = -elemRotation;
    }
  } else if (rotationDirection === "right") {
    if (elemRotation > 0) {
      degreeToRotate = 360 - elemRotation;
    } else if (elemRotation < 0) {
      degreeToRotate = -elemRotation;
    }
  }
  return degreeToRotate ?? elemRotation;
}
