
// This is a template for creating a looping animation in p5.js (JavaScript). 
// When you press the 'F' key, this program will export a series of images into
// your default Downloads folder. These can then be made into an animated gif. 
// This code is known to work with p5.js version 0.6.0
// Prof. Golan Levin, 28 January 2018

// INSTRUCTIONS FOR EXPORTING FRAMES (from which to make a GIF): 
// 1. Run a local server, using instructions from here:
//    https://github.com/processing/p5.js/wiki/Local-server
// 2. Set the bEnableExport variable to true.
// 3. Set the myNickname variable to your name.
// 4. Run the program from Chrome, press 'f'. 
//    Look in your 'Downloads' folder for the generated frames.
// 5. Note: Retina screens may export frames at twice the resolution.


//===================================================
// User-modifiable global variables. 
var myNickname = "nickname";
var nFramesInLoop = 120;
var bEnableExport = false;

// Other global variables you don't need to touch.
var nElapsedFrames;
var bRecording;
var theCanvas;

//===================================================
function setup() {
  theCanvas = createCanvas(500, 200);
  bRecording = false;
  nElapsedFrames = 0;
}

//===================================================
function keyTyped() {
  if (bEnableExport) {
    if ((key === 'f') || (key === 'F')) {
      bRecording = true;
      nElapsedFrames = 0;
    }
  }
}

//===================================================
function draw() {

  // Compute a percentage (0...1) representing where we are in the loop.
  var percentCompleteFraction = 0;
  if (bRecording) {
    percentCompleteFraction = float(nElapsedFrames) / float(nFramesInLoop);
  } else {
    percentCompleteFraction = float(frameCount % nFramesInLoop) / float(nFramesInLoop);
  }

  // Render the design, based on that percentage. 
  // This function renderMyDesign() is the one for you to change. 
  renderMyDesign (percentCompleteFraction);

  // If we're recording the output, save the frame to a file. 
  // Note that the output images may be 2x large if you have a Retina mac. 
  // You can compile these frames into an animated GIF using a tool like: 
  if (bRecording && bEnableExport) {
    var frameOutputFilename = myNickname + "_frame_" + nf(nElapsedFrames, 4) + ".png";
    print("Saving output image: " + frameOutputFilename);
    saveCanvas(theCanvas, frameOutputFilename, 'png');
    nElapsedFrames++;

    if (nElapsedFrames >= nFramesInLoop) {
      bRecording = false;
    }
  }
}

//===================================================
function renderMyDesign (percent) {
  //
  // THIS IS WHERE YOUR ART GOES. 
  // This is an example of a function that renders a temporally looping design. 
  // It takes a "percent", between 0 and 1, indicating where we are in the loop. 
  // Use, modify, or delete whatever you prefer from this example. 
  // This example uses several different graphical techniques. 
  // Remember to SKETCH FIRST!

  //----------------------
  // here, I set the background and some other graphical properties
  background(180);
  smooth();
  stroke(0, 0, 0);
  strokeWeight(2);

  //----------------------
  // Here, I assign some handy variables. 
  var cx = 100;
  var cy = 100;

  //----------------------
  // Here, I use trigonometry to render a rotating element.
  var radius = 80;
  var rotatingArmAngle = percent * TWO_PI;
  var px = cx + radius * cos(rotatingArmAngle);
  var py = cy + radius * sin(rotatingArmAngle);
  fill(255);
  line(cx, cy, px, py);
  ellipse(px, py, 20, 20);

  //----------------------
  // Here, I use graphical transformations to render a rotated square. 
  // Notice the use of push(), pop(), translate(), etc. 
  push();
  translate(cx, cy);
  var rotatingSquareAngle = percent * TWO_PI * -0.25;
  rotate(rotatingSquareAngle);
  fill(255, 128);
  rect(-40, -40, 80, 80);
  pop();

  //----------------------
  // Here's a linearly-moving square
  var squareSize = 20;
  var topY = 0 - squareSize - 2;
  var botY = height + 2;
  var sPercent = (percent + 0.5)%1.0; // shifted by a half-loop
  var yPosition = map(sPercent, 0, 1, topY, botY);
  fill(255, 255, 255);
  rect(230, yPosition, 20, 20);

  //----------------------
  // Here's a sigmoidally-moving pink square!
  // This uses the "Double-Exponential Sigmoid" easing function 
  // ripped from From: https://idmnyu.github.io/p5.js-func/
  // Really, you should just include this library!!
  var eased = doubleExponentialSigmoid (percent, 0.7); 
  eased = (eased + 0.5)%1.0; // shifted by a half-loop, for fun
  var yPosition2 = map(eased, 0, 1, topY, botY); 
  fill (255, 200, 200); 
  rect (260, yPosition2, 20, 20); 

  //----------------------
  // Here's a pulsating ellipse
  var ellipsePulse = sin(3.0 * percent * TWO_PI);
  var ellipseW = map(ellipsePulse, -1, 1, 20, 50);
  var ellipseH = map(ellipsePulse, -1, 1, 50, 30);
  var ellipseColor = map(ellipsePulse, -1, 1, 128, 255);
  fill(255, ellipseColor, ellipseColor);
  ellipse(350, cy, ellipseW, ellipseH);

  //----------------------
  // Here's a traveling sine wave
  stroke(0, 0, 0);
  for (var sy = 0; sy <= height; sy += 4) {
    var t = map(sy, 0, height, 0.0, 0.25);
    var sx = 450 + 25.0 * sin((t + percent) * TWO_PI);
    ellipse(sx, sy, 1, 1);
  }

  //----------------------
  // Include some visual feedback. 
  fill(255, 0, 0);
  noStroke();
  textAlign(CENTER);
  var percentDisplayString = "" + nf(percent, 1, 3);
  text(percentDisplayString, cx, cy - 15);
}


// symmetric double-element sigmoid function (a is slope)
// See https://github.com/IDMNYU/p5.js-func/blob/master/lib/p5.func.js
// From: https://idmnyu.github.io/p5.js-func/
//===================================================
function doubleExponentialSigmoid (_x, _a){
  if(!_a) _a = 0.75; // default

  var min_param_a = 0.0 + Number.EPSILON;
  var max_param_a = 1.0 - Number.EPSILON;
  _a = constrain(_a, min_param_a, max_param_a);
  _a = 1-_a;

  var _y = 0;
  if (_x<=0.5){
    _y = (pow(2.0*_x, 1.0/_a))/2.0;
  }
  else {
    _y = 1.0 - (pow(2.0*(1.0-_x), 1.0/_a))/2.0;
  }
  return(_y);
}

