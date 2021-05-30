let log = console.log;
import { getVisibleWidth } from "./utils.js";

export function calcTotalWidth(
  project_list,
  modifiers = { gap: 0, includeMargin: false }
) {
  let { gap, includeMargin, limitWidth } = modifiers;
  return new Promise((resolve, reject) => {
    let elementsToConsider = project_list.length;

    project_list.forEach((project) => {
      let img = project.querySelector("img");
      if (!img) return;
      if (img.complete) {
        addWidthPostLoading();
      } else {
        img.addEventListener("load", () => {
          addWidthPostLoading();
        });
      }
    });

    function addWidthPostLoading() {
      elementsToConsider--;
      if (elementsToConsider === 0) {
        let counter = 0;
        project_list.forEach((project) => {
          counter += getVisibleWidth(project, includeMargin);
          counter += gap;
        });
        if (limitWidth) {
          project_list.forEach((project) => {
            setMaxWidthforElement(project, project_list.length, counter, gap);
          });
        }

        resolve(counter);
      }
    }
  });
}

function setMaxWidthforElement(element, totalElements, total_width, gap) {
  let maxWidth = (total_width - gap * totalElements) / totalElements;
  element.style.maxWidth = `${maxWidth}px`;
}
