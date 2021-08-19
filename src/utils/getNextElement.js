import { getRotationY } from "../utils.js";

export default function getNextElement(elements) {
  let leastNegativeRotation = -361;
  let leastNegativeRotationElem = null;

  let mostPostiveRotation = 0;
  let mostPostiveRotationElem = null;

  elements.forEach((elem) => {
    let elemRotationY = getRotationY(elem);

    if (elemRotationY > 0) {
      if (elemRotationY > mostPostiveRotation) {
        mostPostiveRotation = elemRotationY;
        mostPostiveRotationElem = elem;
      }
    }
    if (elemRotationY < 0) {
      if (elemRotationY > leastNegativeRotation) {
        leastNegativeRotation = elemRotationY;
        leastNegativeRotationElem = elem;
      }
    }
  });
  let valueClosestToZero = 361;
  let elemClosestToZero = null;
  if (mostPostiveRotation < valueClosestToZero) {
    valueClosestToZero = mostPostiveRotation;
    elemClosestToZero = mostPostiveRotationElem;
  }

  if (Math.abs(leastNegativeRotation) < valueClosestToZero) {
    valueClosestToZero = leastNegativeRotation;
    elemClosestToZero = leastNegativeRotationElem;
  }

  return elemClosestToZero;
}
