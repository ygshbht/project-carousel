export function calc_transform_origin(project_list, circumference) {
  let radius = circumference / (Math.PI * 2);
  radius = -radius;
  project_list.forEach((project) => {
    let project_transformOrigin =
      getComputedStyle(project).transformOrigin.split(" ");
    project.style.transformOrigin = `${parseFloat(
      project_transformOrigin[0]
    )}px ${parseFloat(project_transformOrigin[1])}px ${parseFloat(radius)}px `;
  });
  return radius;
}
