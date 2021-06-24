import { calcTotalWidth, getWidhtUpto } from "./calcTotalWidth.js";
import { calcTransformOrigin, wrapDivs } from "./utils.js";
import { calcVelocity, addForce } from "./calcVelocity.js";
import { getRotationY, mouseHoldAtEnd } from "./utils.js";
import { calcZindex, rotateChild, hideBackface } from "./utils.js";
import { removeMouseEvents, removeTouchEvents } from "./specific/removeEvents.js";
import { setContainerStyles, setWrapperStyles } from "./specific/removeEvents.js";

const log = console.log;

export default class Carousel {
  mouseDown = false;
  mouse_in = true;

  hold_threshold = 120;
  friction = 0.15;
  accelerateInterval = 10;

  velocity = 0;
  mouseCoordX = 0;
  totalRotation = 0;
  total_width = 0;

  mouseVelMultiplier = 1;
  touchVelMultiplier = 1;
  mouseXpositions = [];

  constructor(container, modifiers = {}) {
    this.gap = modifiers.gap ?? 30;
    this.includeMargin = modifiers.includeMargin ?? false;
    this.setStyles = modifiers.setStyles ?? true;

    this.container = container;
    this.elements = wrapDivs(Array.from(this.container.children));
    this.isOrthographic = modifiers.isOrthographic ?? false;

    this.project = this.elements[0];
    this.projectStyle = getComputedStyle(this.elements[0]);

    this.projectRotateY = getRotationY(this.project);
    this.totalProjects = this.elements.length;

    container.ondragstart = () => false;
    if (this.setStyles) {
      setContainerStyles(this.container, this.isOrthographic);
      this.elements.forEach((elem) => {
        setWrapperStyles(elem, this.isOrthographic);
      });
    }

    calcTotalWidth(this.elements, {
      gap: this.gap,
      includeMargin: this.includeMargin,
      limitWidth: this.limitWidth,
    }).then((width) => {
      this.total_width = width;
      this.radius = calcTransformOrigin(this.elements, this.total_width);
      this.circumference = Math.abs(2 * Math.PI * this.radius);
      this.degreesPerCircum = 360 / this.circumference;
      this.elements.forEach((elem, index) => {
        let widthUpto = getWidhtUpto(this.elements, index, this.gap, this.includeMargin);
        let extraDegress = (widthUpto / this.total_width) * 360;

        elem.extraDegress = extraDegress;

        elem.style.transform = `rotateY(${(this.totalRotation + extraDegress) % 360}deg)`;

        elem.style.zIndex = `${calcZindex(this.totalRotation, extraDegress)}`;
      });
    });

    this.mousedownHandler = (e) => dragStart(e.clientX);
    this.container.addEventListener("mousedown", this.mousedownHandler);

    this.touchstartHandler = (e) => dragStart(e.targetTouches[0].pageX);
    this.container.addEventListener("touchstart", this.touchstartHandler);

    this.mouseenterHandler = () => (this.mouse_in = true);
    this.container.addEventListener("mouseenter", this.mouseenterHandler);

    this.touchmoveHandler = (e) => drag(e.targetTouches[0].pageX);
    this.container.addEventListener("touchmove", this.touchmoveHandler);

    this.touchcancelHandler = (e) => dragEnd(this.touchVelMultiplier);
    this.container.addEventListener("touchcancel", this.touchcancelHandler);

    this.touchendHandler = () => dragEnd(this.touchVelMultiplier);
    this.container.addEventListener("touchend", this.touchendHandler);

    this.mousemoveHandler = (e) => (this.mouseDown && this.mouse_in ? drag(e.clientX) : null);
    this.container.addEventListener("mousemove", this.mousemoveHandler);

    this.mouseupHandler = () => {
      this.mouseDown = false;
      dragEnd(this.mouseVelMultiplier);
    };
    this.container.addEventListener("mouseup", this.mouseupHandler);

    this.mouseleaveHandler = () => {
      this.mouse_in = this.mouseDown = false;
      if (this.velocity === 0) dragEnd(this.mouseVelMultiplier);
    };
    this.container.addEventListener("mouseleave", this.mouseleaveHandler);

    let dragStart = (startingPos) => {
      this.mouseDown = true;
      this.mouseCoordX = startingPos;
      this.velocity = 0;
      this.projectRotateY = getRotationY(this.project);
      this.mouseXpositions = [];
    };

    let drag = (contactPoint) => {
      let horizontalDistMoved = contactPoint - this.mouseCoordX;

      let degressToRotate = horizontalDistMoved * this.degreesPerCircum;
      this.totalRotation = this.projectRotateY + degressToRotate;

      this.elements.forEach((elem) => {
        let extraDegress = elem.extraDegress;
        let toRotate = (this.totalRotation + extraDegress) % 360;
        elem.style.transform = `rotateY(${toRotate}deg)`;
        elem.style.zIndex = `${calcZindex(this.totalRotation, extraDegress)}`;
        //
        if (this.isOrthographic) {
          rotateChild(elem.querySelector("*"), -toRotate);
          hideBackface(elem.querySelector("*"));
        }
      });

      this.mouseXpositions.push({ pos: contactPoint, time: new Date().getTime() });
      if (this.mouseXpositions.length >= 15) this.mouseXpositions.shift();
    };

    let dragEnd = (multiplier) => {
      if (this.mouseXpositions.length >= 2) this.velocity = calcVelocity(this.mouseXpositions, this.radius, multiplier);
      else this.velocity = 0;

      if (!mouseHoldAtEnd(this.mouseXpositions, this.hold_threshold)) {
        let force_interval = setInterval(() => {
          addForce(force_interval, this);
        }, this.accelerateInterval);
      }
      this.mouseXpositions = [];
    };
  }

  getVelocity = () => this.velocity;
  changeVelocity = (value) => (this.velocity += value);
  nullifyMouseXpositions = () => (this.mouseXpositions = []);
  removeTouchEvents = () => removeTouchEvents(this);
  removeMouseEvents = () => removeMouseEvents(this);
}
