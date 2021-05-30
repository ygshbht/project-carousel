import { calcTotalWidth } from "./calcTotalWidth.js";
import { calc_transform_origin } from "./calc_transform_origin.js";
import { calc_velocity, add_force } from "./calc_velocity.js";
import { get_rotationY, mouseHoldAtEnd } from "./utils.js";
import { calc_zIndex, calc_opacity as calcOpacity } from "./utils.js";

export default class Carousel {
  mouse_down = false;
  mouse_in = true;

  hold_threshold = 120;
  friction = 0.15;
  velocity = 0;
  accelerateInterval = 10;

  mouse_X_coord = 0;
  totalRotation = 0;

  mouseVelMultiplier = 1;
  touchVelMultiplier = 1;

  mouseXpositions = [];

  getVelocity = () => this.velocity;

  changeVelocity = (value) => (this.velocity += value);

  nullifyMouseXpositions = () => (this.mouseXpositions = []);

  async setRadiusAndCircumference() {
    return (this.total_width = await calcTotalWidth(this.elements, {
      gap: this.gap,
      includeMargin: this.includeMargin,
      limitWidth: this.limitWidth,
    }).then((value) => value));
  }

  constructor(
    elements,
    container,
    modifiers = { gap: 10, includeMargin: false, limitWidth: true }
  ) {
    this.gap = modifiers.gap ?? 10;
    this.includeMargin = modifiers.includeMargin ?? false;
    this.limitWidth = modifiers.limitWidth ?? true;
    this.project = elements[0];
    this.elements = elements;
    this.projects_container = container;

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
    });

    this.elements.forEach((elem, index) => {
      let extraDegress = (360 / this.totalProjects) * index;
      elem.style.transform = `rotateY(${
        (this.totalRotation + extraDegress) % 360
      }deg)`;

      elem.style.opacity = `${calcOpacity(this.totalRotation, extraDegress)}`;
      elem.style.zIndex = `${calc_zIndex(this.totalRotation, extraDegress)}`;
    });

    this.mousedownHandler = (e) => {
      this.mouse_down = true;
      this.mouse_X_coord = e.clientX;
      this.project_rotateY = get_rotationY(this.project);
      this.velocity = 0;
      this.mouseXpositions = [];
    };

    this.projects_container.addEventListener(
      "mousedown",
      this.mousedownHandler
    );

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

    this.projects_container.addEventListener("mouseup", this.mouseupHandler);

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

    this.projects_container.addEventListener(
      "mouseleave",
      this.mouseleaveHandler
    );

    this.mouseenterHandler = () => {
      this.mouse_in = true;
    };

    this.projects_container.addEventListener(
      "mouseenter",
      this.mouseenterHandler
    );

    this.mousemoveHandler = (e) => {
      if (!(this.mouse_down && this.mouse_in)) return;

      let horizontalDistMoved = e.clientX - this.mouse_X_coord;
      let degress_to_rotate = horizontalDistMoved * this.degreesPerCircum;

      this.totalRotation = this.project_rotateY + degress_to_rotate;

      this.elements.forEach((project, index) => {
        let extraDegress = (360 / this.totalProjects) * index;
        project.style.transform = `rotateY(${
          (this.totalRotation + extraDegress) % 360
        }deg)`;

        project.style.opacity = `${calcOpacity(
          this.totalRotation,
          extraDegress
        )}`;
        project.style.zIndex = `${calc_zIndex(
          this.totalRotation,
          extraDegress
        )}`;
      });

      this.mouseXpositions.push([e.clientX, new Date().getTime()]);
      if (this.mouseXpositions.length >= 15) this.mouseXpositions.shift();
    };

    this.projects_container.addEventListener(
      "mousemove",
      this.mousemoveHandler
    );

    this.removeMouseEvents = () => {
      this.projects_container.removeEventListener(
        "mousedown",
        this.mousedownHandler
      );
      this.projects_container.removeEventListener(
        "mouseup",
        this.mouseupHandler
      );
      this.projects_container.removeEventListener(
        "mouseleave",
        this.mouseleaveHandler
      );
      this.projects_container.removeEventListener(
        "mousemove",
        this.mousemoveHandler
      );
      this.projects_container.removeEventListener(
        "mouseenter",
        this.mouseenterHandler
      );
    };

    this.touchstartHandler = (e) => {
      this.velocity = 0;
      this.mouse_X_coord = e.targetTouches[0].pageX;
      this.mouseXpositions = [];
      this.project_rotateY = get_rotationY(this.project);
    };

    this.projects_container.addEventListener(
      "touchstart",
      this.touchstartHandler
    );

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

    this.projects_container.addEventListener("touchend", this.touchendHandler);

    this.touchmoveHandler = (e) => {
      let horizontalDistMoved = e.targetTouches[0].pageX - this.mouse_X_coord;

      let degress_to_rotate = horizontalDistMoved * this.degreesPerCircum;
      this.totalRotation = this.project_rotateY + degress_to_rotate;

      this.elements.forEach((project, index) => {
        let extraDegress = (360 / this.totalProjects) * index;
        project.style.transform = `rotateY(${
          (this.totalRotation + extraDegress) % 360
        }deg)`;

        project.style.opacity = `${calcOpacity(
          this.totalRotation,
          extraDegress
        )}`;
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

    this.projects_container.addEventListener(
      "touchmove",
      this.touchmoveHandler
    );

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

    this.projects_container.addEventListener(
      "touchcancel",
      this.touchcancelHandler
    );

    this.removeTouchEvents = () => {
      this.projects_container.removeEventListener(
        "touchstart",
        this.touchstartHandler
      );
      this.projects_container.removeEventListener(
        "touchend",
        this.touchendHandler
      );
      this.projects_container.removeEventListener(
        "touchmove",
        this.touchmoveHandler
      );
      this.projects_container.removeEventListener(
        "touchcancel",
        this.touchcancelHandler
      );
    };
  }
}
