import { calcZindex, rotateChild } from "./utils.js";
import { hideBackface, getRotationY } from "./utils.js";

export function calcVelocity(mouseXpositions, radius, factor = 1) {
  let totalPositions = mouseXpositions.length;
  let positionTwo = mouseXpositions[totalPositions - 1];

  // Using the fourth last position results in unabrupt movement
  let positionOne = mouseXpositions[totalPositions - 4] ?? mouseXpositions[totalPositions - 2];
  let timeTaken = positionTwo.time - positionOne.time;
  let distTravelled = positionTwo.pos - positionOne.pos;

  if (distTravelled === 0) return 0;
  let velocity = distTravelled / timeTaken;
  velocity = velocity / (Math.PI * 2);
  return velocity * factor;
}

export function addForce(force_interval, carousel) {
  let { elements, friction, getVelocity, changeVelocity, nullifyMouseXpositions, isOrthographic } = carousel;
  nullifyMouseXpositions();

  let projectYrotation = getRotationY(elements[0]);
  let velocity = getVelocity();

  if (Math.abs(velocity) <= friction) {
    changeVelocity(-velocity);
    clearInterval(force_interval);
    return;
  }

  elements.forEach((elem, index) => {
    let extra_degress = elem.extraDegress;
    let toRotate = (projectYrotation + velocity + extra_degress) % 360;

    elem.style.transform = `rotateY(${toRotate}deg)`;

    let total_rotation = projectYrotation + velocity;
    elem.style.zIndex = `${calcZindex(total_rotation, extra_degress)}`;
    //
    if (carousel.isOrthographic) {
      rotateChild(elem.querySelector("*"), -toRotate);
      hideBackface(elem.querySelector("*"));
    }
  });

  if (velocity > 0) changeVelocity(-(friction * velocity * 0.1));
  else if (velocity < 0) changeVelocity(-(friction * velocity * 0.1));
  else clearInterval(force_interval);
}
