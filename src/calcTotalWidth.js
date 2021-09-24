import { getVisibleWidth } from "./utils.js";

export function calcTotalWidth(
  project_list,
  modifiers = { gap: 0, includeMargin: false }
) {
  let { gap, includeMargin } = modifiers;
  return new Promise((resolve) => {
    let elementsToConsider = 0;

    project_list.forEach((project) => {
      let imgs = project.querySelectorAll("img");
      imgs.forEach((img) => {
        elementsToConsider++;
      });
    });

    project_list.forEach((project) => {
      let imgs = project.querySelectorAll("img");
      imgs.forEach((img) => {
        if (!img) return addWidthPostLoading();

        if (img.complete) return addWidthPostLoading();

        img.addEventListener("load", () => {
          addWidthPostLoading();
        });
        img.addEventListener("error", () => {
          addWidthPostLoading();
        });
      });
    });

    function addWidthPostLoading() {
      elementsToConsider--;

      if (elementsToConsider === 0) {
        let counter = 0;
        project_list.forEach((project) => {
          counter += getVisibleWidth(project, includeMargin);
          counter += gap;
        });
        resolve(counter);
      }
    }
  });
}

export function getWidhtUpto(project_list, upto, gap, includeMargin) {
  let counter = 0;
  if (upto === 0) return 0;
  project_list.forEach((project, index) => {
    if (index === 0) {
      let first_half_widht = parseInt(getComputedStyle(project).width) / 2;
      counter += first_half_widht;
      counter += gap;
      return;
    }

    if (index === upto) {
      let last_half_width = parseInt(getComputedStyle(project).width) / 2;
      counter += last_half_width;
      return;
    }

    if (index > upto) return;

    counter += getVisibleWidth(project, includeMargin);
    counter += gap;
  });
  return counter;
}

//max radius = sqrt of (container width/ 2 ^2 + radius ^2)
