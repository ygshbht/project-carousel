import { calc_zIndex, get_rotationY } from "./utils.js";

export function calc_velocity(mouseXpositions, factor = 1) {
  let arr_len = mouseXpositions.length;
  let second_last_index = arr_len - 2;
  if (arr_len >= 4) {
    second_last_index = arr_len - 4;
  }
  let time_taken =
    mouseXpositions[arr_len - 1][1] - mouseXpositions[second_last_index][1];
  let distance_travelled =
    mouseXpositions[arr_len - 1][0] - mouseXpositions[second_last_index][0];

  if (distance_travelled === 0) return 0;
  let velocity = distance_travelled / time_taken;
  velocity = velocity / (Math.PI * 2);
  return velocity * factor;
}

export function add_force(force_interval, carousel) {
  let {
    elements,
    friction,
    getVelocity,
    changeVelocity,
    nullifyMouseXpositions,
    extraDegressList
  } = carousel;

  let projectYrotation = get_rotationY(elements[0]);
  let velocity = getVelocity();

  if (Math.abs(velocity) <= friction) {
    changeVelocity(-velocity);
    clearInterval(force_interval);
    return;
  }

  nullifyMouseXpositions();
  elements.forEach((project, index) => {
    let extra_degress = extraDegressList[index]
  
    project.style.transform = `rotateY(${
      (projectYrotation + velocity + extra_degress) % 360
    }deg)`;

    let total_rotation = projectYrotation + velocity;
    project.style.zIndex = `${calc_zIndex(total_rotation, extra_degress)}`;
  });

  if (velocity > 0) changeVelocity(-(friction * velocity * 0.1));
  else if (velocity < 0) changeVelocity(-(friction * velocity * 0.1));
  else clearInterval(force_interval);
}
