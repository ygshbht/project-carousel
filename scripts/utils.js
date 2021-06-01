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
    let bdrLeft = elmntStyle.borderLeft === "" ? 0 : elmntStyle.borderLeft;
    let bdrRight = elmntStyle.borderRight === "" ? 0 : elmntStyle.borderRight;
    let pdngLeft = elmntStyle.paddingLeft === "" ? 0 : elmntStyle.paddingLeft;
    let pdngRight = elmntStyle.paddingLeft === "" ? 0 : elmntStyle.paddingRight;
    width += parseFloat(pdngLeft);
    width += parseFloat(pdngRight);
    width += parseFloat(bdrLeft);
    width += parseFloat(bdrRight);
  }

  if (includeMargin) {
    let mrgnLeft = elmntStyle.marginLeft === "" ? 0 : elmntStyle.marginLeft;
    let mrgnRight = elmntStyle.marginRight === "" ? 0 : elmntStyle.marginRight;
    width += parseFloat(mrgnLeft);
    width += parseFloat(mrgnRight);
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
