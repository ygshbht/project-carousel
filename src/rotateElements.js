import {
  calcZindex,
  getRotationY,
  hideBackface,
  rotateChild,
} from "./utils.js";
import setNewRadius from "./utils/setNewRadius.js";

export default function rotateElements(
  carousel,
  degreeToRotate,
  rotationCausingElem,
  direction
) {
  let { minimumClickRotationDist, radius } = carousel;
  let { numOfElemToMovePerClick } = carousel;

  let cirumToRotate = radius * degreeToRotate;
  if (Math.abs(cirumToRotate) < minimumClickRotationDist) {
    if (direction > 0) {
      rotationCausingElem = rotationCausingElem.previousElem;
      degreeToRotate = -getRotationY(rotationCausingElem);
    } else {
      rotationCausingElem = rotationCausingElem.nextElem;
      degreeToRotate = -getRotationY(rotationCausingElem);
    }
  }

  while (numOfElemToMovePerClick > 1) {
    if (direction > 0) {
      rotationCausingElem = rotationCausingElem.previousElem;
      degreeToRotate = -getRotationY(rotationCausingElem);
    } else {
      rotationCausingElem = rotationCausingElem.nextElem;
      degreeToRotate = -getRotationY(rotationCausingElem);
    }
    numOfElemToMovePerClick--;
  }

  animateClickRotaion(carousel, degreeToRotate);
}

function animateClickRotaion(carousel, rotationAmount) {
  let { clickRotationDuration: duration } = carousel;
  let { accelerateInterval: intervalTime } = carousel;
  let { equidistantElements, elements } = carousel;

  let rotationPerIntervalPercent = intervalTime / duration;
  let rotationPerIntervalAmount = rotationAmount * rotationPerIntervalPercent;

  let remainingRotaion = rotationAmount;

  let interval = setInterval(
    () => animationIntervalFunction(interval),
    intervalTime
  );

  function animationIntervalFunction(interval) {
    let firstElemRotation = getRotationY(elements[0]);

    elements.forEach((elem) => {
      let extraDegress = elem.extraDegress;

      let degreeToRotate = rotationPerIntervalAmount;

      let toRotate = (firstElemRotation + extraDegress + degreeToRotate) % 360;

      elem.style.transform = `rotateY(${toRotate}deg)`;

      let totalRotation = firstElemRotation + degreeToRotate;
      elem.style.zIndex = `${calcZindex(totalRotation, extraDegress)}`;

      if (carousel.isOrthographic) {
        rotateChild(elem.querySelector("*"), -toRotate);
        hideBackface(elem.querySelector("*"));
        if (equidistantElements) setNewRadius(elem, toRotate);
      }
    });
    if (remainingRotaion > 0) {
      remainingRotaion = remainingRotaion - rotationPerIntervalAmount;
      if (remainingRotaion <= 0) clearInterval(interval);
    } else {
      remainingRotaion = remainingRotaion - rotationPerIntervalAmount;
      if (remainingRotaion >= 0) clearInterval(interval);
    }
  }
}
