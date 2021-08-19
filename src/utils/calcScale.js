export default function calcScaleFromAngle(angleInDeg, radius, index) {
  let angleInRad = angleInDeg / (180 / Math.PI);
  radius = Math.abs(radius);
  let circumCovered = angleInRad * radius;

  //if angle is negative, circumCovered is negative
  //if angle is postive then circumCovered is postive

  let radAngleinMath = angleInRad - Math.PI / 2;
  let lenX = Math.cos(radAngleinMath) * radius;

  if (circumCovered > Math.PI * radius) {
    // this is for cases when the angle is a large negative (more than -180, and -181, -182 so on) and lenX is very small, in this case, teh scale factor gets very big and causes elements to disappear
    circumCovered = -(2 * Math.PI * radius - circumCovered);
  }

  let scaleFactor = circumCovered / lenX;

  return scaleFactor;
}
