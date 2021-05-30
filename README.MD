# Create an image carousel

To check implementation, please visit [this website.](www.yogeshbhatt.com/projects/carousel)  
To create a carousel, import the Carousel class from the main.js file like

      import Carousel from "./node_modules/virtual-carousel/scripts/main.js"

##### (path here is relative to the parent of node_modules folder)

&nbsp;

### How it works:

There are three important components of the carousel:

1. Images
2. Container for these images
3. One DIV container each for every image in the carousel<sup>1</sup>

You can make as many carousels you want like below:

            let carouselOne = new Carousel(nodelistOfDivs, container)
            let carouselTwo = new Carousel(nodelistOfDivs2, container2)

Imagine all images are put side by side in a row and then the ends of the sidemost images are joined to make a ring. Circumference of this ring/ carousel will be the row's length and radius = circumference/ 2π

&nbsp;  
Additonally, you may enter a third argument (object) while creating a class instance to modify the carousel's behaviour. All options with defaults are as below:

            {
                  gap:10px, //extra space between images
                  includeMargin: false, // if true, then margin will be added in circumference,
                  limitWidth: true, // (of images) otherwise coursel won't look very good
            }

Below specified styling is curcial for the carousel to function properly.

            div {
            position: absolute;
            transform-origin: 50% 50% -2000px;
            transform: rotateY(1deg);
            }

            .container {
                  position: relative;
                  display: flex;
                  justify-content: center;
                  user-select: none;
                  perspective: 1000px;
            }

Speed of elements after swiping can be modified by using the below properties:

            carouselOne.mouseVelMultiplier = 1; // default & recommended 1
            carouselOne.touchVelMultiplier = 5; //default 1

<sup>1</sup> Divs enclose images for cases when you want to add more elements on top of images like buttons, text, etc. Widths of these extra elements may not be taken into consideration (especially elements including media such as background video or another images which take time to load) while calculating circumference. These elements are expected to abosolutely positioned to avoid lengthy divs.  
&nbsp;  
As only the carousel is round/ cylindrical and not the elements/ images themselves, the images (their divs) are assigned limited width by default to avoid very long elements.
