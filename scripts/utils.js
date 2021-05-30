export function get_rotationY(element) {
  let elmnt_tranform = new WebKitCSSMatrix(getComputedStyle(element).transform);
  let radians = Math.atan2(-elmnt_tranform.m13, elmnt_tranform.m11);
  let degrees = (radians * 180) / Math.PI;
  return degrees;
}

export function getVisibleWidth(element, includeMargin = false) {
  let width = 0;
  let elmntStyle = getComputedStyle(element);

  width += parseFloat(elmntStyle.width);

  if (elmntStyle.boxSizing === "content-box") {
    width += parseFloat(elmntStyle.paddingLeft);
    width += parseFloat(elmntStyle.paddingRight);
    width += parseFloat(elmntStyle.borderLeft);
    width += parseFloat(elmntStyle.borderRight);
  }

  if (includeMargin) {
    width += parseFloat(elmntStyle.marginLeft);
    width += parseFloat(elmntStyle.marginRight);
  }

  return width;
}

export function mouseHoldAtEnd(mouseXpositions, hold_threshold) {
  if (mouseXpositions.length <= 1) return false;
  let current_time = new Date().getTime();
  let last_move_time = mouseXpositions[mouseXpositions.length - 1][1];
  let difference = current_time - last_move_time;

  if (difference > hold_threshold) return true;
  return false;
}

export function calc_zIndex(total_rotation, extra_degress) {
  let z_index = Math.floor(
    Math.abs(180 - (Math.abs((total_rotation + extra_degress) % 360) % 360))
  );
  return parseInt(z_index);
}

export function calc_opacity(total_rotation, extra_degress) {
  let opacity;
  let rotationToApply = (total_rotation + extra_degress) % 360;
  if (rotationToApply >= 60 && rotationToApply <= 300) opacity = 0;
  else if (rotationToApply <= -60 && rotationToApply >= -300) opacity = 0;
  else opacity = 1;
  return opacity;
}
