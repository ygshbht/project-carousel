import { calcTotalWidth, getWidhtUpto } from "./calcTotalWidth.js";
import { calc_transform_origin } from "./calc_transform_origin.js";
import { calc_velocity, add_force } from "./calc_velocity.js";
import { get_rotationY, mouseHoldAtEnd } from "./utils.js";
import { calc_zIndex } from "./utils.js";

export default class Carousel {
  mouse_down = false;
  mouse_in = true;

  extraDegressList = [];

  hold_threshold = 120;
  friction = 0.15;
  velocity = 0;
  accelerateInterval = 10;

  mouse_X_coord = 0;
  totalRotation = 0;
  total_width = 0;

  mouseVelMultiplier = 1;
  touchVelMultiplier = 1;

  mouseXpositions = [];

  getVelocity = () => this.velocity;

  changeVelocity = (value) => (this.velocity += value);

  nullifyMouseXpositions = () => (this.mouseXpositions = []);

  constructor(
    elements,
    container,
    modifiers = { gap: 10, includeMargin: false, limitWidth: true }
  ) {
    container.ondragstart = () => false;
    this.gap = modifiers.gap ?? 10;
    this.includeMargin = modifiers.includeMargin ?? false;
    this.limitWidth = modifiers.limitWidth ?? true;
    this.project = elements[0];
    this.projectStyle = getComputedStyle(elements[0]);
    this.elements = elements;
    this.container = container;

    this.project_rotateY = get_rotationY(this.project);
    this.totalProjects = elements.length;

    calcTotalWidth(this.elements, {
      gap: this.gap,
      includeMargin: this.includeMargin,
      limitWidth: this.limitWidth,
    }).then((width) => {
      this.total_width = width;
      this.rotation_radius = calc_transform_origin(
        this.elements,
        this.total_width
      );
      this.circumference = Math.abs(2 * Math.PI * this.rotation_radius);
      this.degreesPerCircum = 360 / this.circumference;

      this.elements.forEach((elem, index) => {
        let widthUpto = getWidhtUpto(
          this.elements,
          index,
          this.gap,
          this.includeMargin
        );
        let extraDegress = (widthUpto / this.total_width) * 360;

        this.extraDegressList.push(extraDegress);

        elem.style.transform = `rotateY(${
          (this.totalRotation + extraDegress) % 360
        }deg)`;

        elem.style.zIndex = `${calc_zIndex(this.totalRotation, extraDegress)}`;
      });
    });

    this.mousedownHandler = (e) => {
      this.mouse_down = true;
      this.mouse_X_coord = e.clientX;
      this.project_rotateY = get_rotationY(this.project);
      this.velocity = 0;
      this.mouseXpositions = [];
    };

    this.container.addEventListener("mousedown", this.mousedownHandler);

    this.mouseupHandler = () => {
      this.mouse_down = false;

      if (this.mouseXpositions.length >= 2)
        this.velocity = calc_velocity(
          this.mouseXpositions,
          this.mouseVelMultiplier
        );
      else this.velocity = 0;

      if (!mouseHoldAtEnd(this.mouseXpositions, this.hold_threshold)) {
        let force_interval = setInterval(() => {
          add_force(force_interval, this);
        }, this.accelerateInterval);
      }
      this.mouseXpositions = [];
    };

    this.container.addEventListener("mouseup", this.mouseupHandler);

    this.mouseleaveHandler = () => {
      this.mouse_in = false;
      this.mouse_down = false;
      if (this.velocity !== 0) return;

      if (this.mouseXpositions.length >= 2)
        this.velocity = calc_velocity(
          this.mouseXpositions,
          this.mouseVelMultiplier
        );
      else return (this.velocity = 0);

      if (!mouseHoldAtEnd(this.mouseXpositions, this.hold_threshold)) {
        let force_interval = setInterval(() => {
          add_force(force_interval, this);
        }, this.accelerateInterval);
      }
      this.mouseXpositions = [];
    };

    this.container.addEventListener("mouseleave", this.mouseleaveHandler);

    this.mouseenterHandler = () => {
      this.mouse_in = true;
    };

    this.container.addEventListener("mouseenter", this.mouseenterHandler);

    this.mousemoveHandler = (e) => {
      if (!(this.mouse_down && this.mouse_in)) return;

      let horizontalDistMoved = e.clientX - this.mouse_X_coord;
      let degress_to_rotate = horizontalDistMoved * this.degreesPerCircum;

      this.totalRotation = this.project_rotateY + degress_to_rotate;

      this.elements.forEach((project, index) => {
        let extraDegress = this.extraDegressList[index];

        project.style.transform = `rotateY(${
          (this.totalRotation + extraDegress) % 360
        }deg)`;

        project.style.zIndex = `${calc_zIndex(
          this.totalRotation,
          extraDegress
        )}`;
      });

      this.mouseXpositions.push([e.clientX, new Date().getTime()]);
      if (this.mouseXpositions.length >= 15) this.mouseXpositions.shift();
    };

    this.container.addEventListener("mousemove", this.mousemoveHandler);

    this.removeMouseEvents = () => {
      this.container.removeEventListener("mousedown", this.mousedownHandler);
      this.container.removeEventListener("mouseup", this.mouseupHandler);
      this.container.removeEventListener("mouseleave", this.mouseleaveHandler);
      this.container.removeEventListener("mousemove", this.mousemoveHandler);
      this.container.removeEventListener("mouseenter", this.mouseenterHandler);
    };

    this.touchstartHandler = (e) => {
      this.velocity = 0;
      this.mouse_X_coord = e.targetTouches[0].pageX;
      this.mouseXpositions = [];
      this.project_rotateY = get_rotationY(this.project);
    };

    this.container.addEventListener("touchstart", this.touchstartHandler);

    this.touchendHandler = () => {
      if (this.mouseXpositions.length >= 2)
        this.velocity = calc_velocity(
          this.mouseXpositions,
          this.touchVelMultiplier
        );
      else this.velocity = 0;

      if (!mouseHoldAtEnd(this.mouseXpositions, this.hold_threshold)) {
        let force_interval = setInterval(() => {
          add_force(force_interval, this);
        }, this.accelerateInterval);
      }
      this.mouseXpositions = [];
    };

    this.container.addEventListener("touchend", this.touchendHandler);

    this.touchmoveHandler = (e) => {
      let horizontalDistMoved = e.targetTouches[0].pageX - this.mouse_X_coord;

      let degress_to_rotate = horizontalDistMoved * this.degreesPerCircum;
      this.totalRotation = this.project_rotateY + degress_to_rotate;

      this.elements.forEach((project, index) => {
        let extraDegress = this.extraDegressList[index];

        project.style.transform = `rotateY(${
          (this.totalRotation + extraDegress) % 360
        }deg)`;

        project.style.zIndex = `${calc_zIndex(
          this.totalRotation,
          extraDegress
        )}`;
      });

      this.mouseXpositions.push([
        e.targetTouches[0].pageX,
        new Date().getTime(),
      ]);
      if (this.mouseXpositions.length >= 15) this.mouseXpositions.shift();
    };

    this.container.addEventListener("touchmove", this.touchmoveHandler);

    this.touchcancelHandler = (e) => {
      if (this.mouseXpositions.length >= 2)
        this.velocity = calc_velocity(
          this.mouseXpositions,
          this.touchVelMultiplier
        );
      else this.velocity = 0;

      if (!mouseHoldAtEnd(this.mouseXpositions, this.hold_threshold)) {
        let force_interval = setInterval(() => {
          add_force(force_interval, this);
        }, this.accelerateInterval);
      }
      this.mouseXpositions = [];
    };

    this.container.addEventListener("touchcancel", this.touchcancelHandler);

    this.removeTouchEvents = () => {
      this.container.removeEventListener("touchstart", this.touchstartHandler);
      this.container.removeEventListener("touchend", this.touchendHandler);
      this.container.removeEventListener("touchmove", this.touchmoveHandler);
      this.container.removeEventListener(
        "touchcancel",
        this.touchcancelHandler
      );
    };
  }
}
