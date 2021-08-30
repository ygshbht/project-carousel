# Create an image carousel

To check implementation, please visit [this website.](http://carousel.projects.yogeshbhatt.com)  
To create a carousel, import the Carousel class from the index.js file like

      import Carousel from "./node_modules/virtual-carousel/src/index.js"

##### (path here is relative to the parent of node_modules folder)

OR &nbsp;

      import Carousel from "virtual-carousel"

&nbsp;

### How it works:

There are three important components of the carousel:

1. Images
2. Container for these images
3. One DIV container each for every image  
   (direct children of Container should be divs/ spans (like a card) and the set of related elements should be inside the respective div/span )

You can make as many carousels you want like:

            let carouselOne = new Carousel(container)
            let carouselTwo = new Carousel(container2)

Imagine all images are put side by side in a row and then the ends of the sidemost images are joined to make a ring. Circumference of this ring/ carousel will be the row's length and radius = circumference/ 2π

Two methods, **next()** and **previous()** of carousel object move elements right or left respectively when invoked. Each take an integer as argument that is the number to elements to move right or left by. Default is 1.

&nbsp;  
Additonally, you may enter a third argument (object) while creating a class instance to modify the carousel's behaviour. All options with defaults are as below:

            {
                  gap:30px,
                  includeMargin: false,
                  isOrthographic: false,
                  equidistantElements: true,
                  setStyles:true,
                  clickRotationDuration:350,
                  minRotationStepDist:35,
            }

1. **gap**: Extra space between images
2. **includeMargin**: if true, then margin will be added in circumference
3. **isOrthographic**: if true, the carousel will appear like a belt of images rather than a circular carousel
4. **equidistantElements**: Applicable when Orthographic mode is on. If this is false, the distance between elements will decrease towards the edges of the container
5. **setStyles**: this property sets the basic CSS styles that are required for the carousel to work, if false, then you may need to add the CSS manually (below)
6. **clickRotationDuration**: Time in milliseconds it takes to move elements when _next()_ or _previous()_ are invoked
7. **minRotationStepDist**: If the elements will move less then this value (in pixels) when _next()_ or _previous()_ is invoked, then the methods will rotate by 1 more element.

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

##### Note: This package won't add container class to the container element that's passed as argument. This will have to be done manually. All direct child elements of the container will be automatically wrapped inside one wrapper div each for the carousel to work properly when it's in orthographic mode. For this wrapper div, wrapper class will be added automatically.

&nbsp;

Speed of elements after swiping can be modified by using the below properties:

            carouselOne.mouseVelMultiplier = 1; // default & recommended 1
            carouselOne.touchVelMultiplier = 5; //default 1

Before calculating the circumference of the carousel, the module will wait for all the images to load. If there is any video or other media element, then its width will not be taken into consideration. In such cases you can wait for the media to load and then instantiate the Carousel  
&nbsp;

Some additional methods:

1. **removeTouchEvents** = removes _Touch_ events from cotnainer
2. **removeMouseEvents** = removes _Mouse_ events from cotnainer
3. **removeEvents** = remove both _Touch_ and _Mouse_ events from container
