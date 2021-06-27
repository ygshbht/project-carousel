# Create an image carousel

To check implementation, please visit [this website.](https://yogeshbhatt.com/projects/carousel/public/)  
To create a carousel, import the Carousel class from the index.js file like

      import Carousel from "./node_modules/virtual-carousel/src/index.js"
      //or
      import Carousel from "virtual-carousel"

##### (path here is relative to the parent of node_modules folder)

&nbsp;

### How it works:

There are three important components of the carousel:

1. Images
2. Container for these images
3. One DIV container each for every image in the carousel<sup>1</sup>

You can make as many carousels you want like below:

            let carouselOne = new Carousel(container)
            let carouselTwo = new Carousel(container2)

Imagine all images are put side by side in a row and then the ends of the sidemost images are joined to make a ring. Circumference of this ring/ carousel will be the row's length and radius = circumference/ 2π

&nbsp;  
Additonally, you may enter a third argument (object) while creating a class instance to modify the carousel's behaviour. All options with defaults are as below:

            {
                  gap:30px, //extra space between images
                  includeMargin: false, // if true, then margin will be added in circumference,
                  isOrthographic: false; // if true, the carousel will appear like a belt of images rather than a circular carousel,
                  setStyles:true// this property sets the basic CSS styles that are required for the carousel to work, if false, then you may need the add the CSS manually (below)
            }

Many of the below specified stylings are curcial for the carousel to function properly. The same has been provided in a CSS file inside the sibling folder, Styles, of the Script folder.

            .container {
                  user-select: none;
                  position: relative;
                  display: flex;
                  //justify-content: center;
                  perspective: 1000px;// for non orthographic carousel
            }

            .container > .wrapper {
                  user-select: none;
                  position: absolute;
                  transform: rotateY(1deg);
                  backface-visibility: hidden; //optional
                  transform-style: preserve-3d; // for orthographic
            }

&nbsp;

             <link rel="stylesheet" href="./node_modules/virtual-carousel/styles/styles.css" />

##### Note: This package will not add the container class to the container element that is passed as an argument. This will have to be done manually. All direct child elements of the container will be automatically wrapped inside one wrapper div each for the carousel to work properly when it's in orthographic mode. For this wrapper div, wrapper class will be added automatically.

&nbsp;

Speed of elements after swiping can be modified by using the below properties:

            carouselOne.mouseVelMultiplier = 1; // default & recommended 1
            carouselOne.touchVelMultiplier = 5; //default 1

<sup>1</sup> Divs enclose images for cases when you want to add more elements on top of images like buttons, text, etc. Widths of these extra elements may not be taken into consideration (especially elements including media such as background video or another images which take time to load) while calculating circumference. These elements are expected to be abosolutely positioned to avoid lengthy divs.  
&nbsp;

&nbsp;

It is recommended to consider using events like onload (and 'complete' property) to fully load all the media before instantiating the Carousel class when there is more than just an image media inside the parent Divs.
