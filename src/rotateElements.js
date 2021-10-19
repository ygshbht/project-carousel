import getDegToRotate from "./utils/getDegToRotate.js";
import {
  calcZindex,
  getRotationY,
  hideBackface,
  rotateChild,
} from "./utils.js";
import setNewRadius from "./utils/setNewRadius.js";

export default function rotateElements(
  carousel,
  rotationCausingElem,
  rotationDirection,
  numOfElementsToRotateBy
) {
  if (carousel.shifting && carousel.shiftingInterval) {
    clearInterval(carousel.shiftingInterval);
  }
  let { minRotationStepDist, radius } = carousel;
  numOfElementsToRotateBy = numOfElementsToRotateBy ?? 1;

  let degreeToRotate = getDegToRotate(rotationCausingElem, rotationDirection);

  let rotationInRadian = (degreeToRotate * Math.PI) / 180;
  let cirumToRotate = radius * rotationInRadian;

  if (Math.abs(cirumToRotate) < minRotationStepDist) {
    if (rotationDirection === "right") {
      rotationCausingElem = rotationCausingElem.previousElem;
    } else {
      rotationCausingElem = rotationCausingElem.nextElem;
    }
    degreeToRotate = getDegToRotate(rotationCausingElem, rotationDirection);
  }

  while (numOfElementsToRotateBy > 1) {
    if (rotationDirection === "left") {
      rotationCausingElem = rotationCausingElem.nextElem;
    } else {
      rotationCausingElem = rotationCausingElem.previousElem;
    }

    numOfElementsToRotateBy--;
  }

  degreeToRotate = getDegToRotate(rotationCausingElem, rotationDirection);

  animateClickRotaion(
    carousel,
    degreeToRotate,
    rotationCausingElem,
    rotationDirection
  );
}

function animateClickRotaion(carousel, rotationAmount) {
  let { clickRotationDuration: rotationDuration } = carousel;
  let { accelerateInterval: intervalTime } = carousel;

  let { equidistantElements, elements } = carousel;

  let numOfTimeToRotate = rotationDuration / intervalTime;
  let rotationPerInterval = rotationAmount / numOfTimeToRotate;

  let remainingRotation = rotationAmount;

  let interval = setInterval(
    () => animationIntervalFunction(interval),
    intervalTime
  );
  carousel.shifting = true;
  carousel.shiftingInterval = interval;

  let numOfRemainingRotations = numOfTimeToRotate;

  function animationIntervalFunction(interval) {
    numOfRemainingRotations--;

    let firstElemRotation = getRotationY(elements[0]);
    let degreeToRotate = rotationPerInterval;

    elements.forEach((elem) => {
      let extraDegress = elem.extraDegress;

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
    if (numOfRemainingRotations === 0) {
      carousel.shifting = false;
      carousel.shiftingInterval = null;
      clearInterval(interval);
    }
    if (rotationAmount > 0) {
      if (remainingRotation <= 0) {
        carousel.shifting = false;
        carousel.shiftingInterval = null;
        clearInterval(interval);
      }
    } else {
      if (remainingRotation >= 0) {
        this.shifting = false;
        this.shiftingInterval = null;
        clearInterval(interval);
      }
    }
    remainingRotation = remainingRotation - rotationPerInterval;
  }
}
