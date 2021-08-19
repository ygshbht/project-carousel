import { getRotationY } from "../utils.js";

export function getPreviousElement(elements) {
  let mostNegativeRotation = 0;
  let mostNegativeRotationElem = null;

  let leastPostiveRotation = 361;
  let leastPostiveRotationElem = null;

  elements.forEach((elem) => {
    let elemRotationY = getRotationY(elem);

    if (elemRotationY > 0) {
      if (elemRotationY < leastPostiveRotation) {
        leastPostiveRotation = elemRotationY;
        leastPostiveRotationElem = elem;
      }
    }
    if (elemRotationY < 0) {
      if (elemRotationY < mostNegativeRotation) {
        mostNegativeRotation = elemRotationY;
        mostNegativeRotationElem = elem;
      }
    }
  });
  let valueClosestToZero = 361;
  let elemClosestToZero = null;

  if (leastPostiveRotation < valueClosestToZero) {
    valueClosestToZero = leastPostiveRotation;
    elemClosestToZero = leastPostiveRotationElem;
  }

  if (Math.abs(mostNegativeRotation) < valueClosestToZero) {
    valueClosestToZero = mostNegativeRotation;
    elemClosestToZero = mostNegativeRotationElem;
  }

  return elemClosestToZero;
}
