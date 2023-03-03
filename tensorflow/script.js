/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

//The framework for importing and setting up tensorflow can be found at
//https://codelabs.developers.google.com/codelabs/tensorflowjs-object-detection#0

const status = document.getElementById('status');
if (status) {
  status.innerText = 'Loaded TensorFlow.js - version: ' + tf.version.tfjs;
}



const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');
const prompt1 = document.getElementById('prompt1');
const prompt2 = document.getElementById('prompt2');
const prompt3 = document.getElementById('prompt3');
const prompt_section = document.getElementById('prompt-section');
const instruction = document.getElementById('instruction')
const prompts = [prompt1, prompt2, prompt3];

// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

// Enable the live webcam view and start classification.
function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }

  // Hide the button once clicked.
  event.target.classList.add('removed');

  //Hide the instructions
  instruction.classList.add('removed');

  //Show the prompts
  prompt_section.classList.remove('removed');

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
    video.addEventListener('loadeddata', predictWebcam);
  });
}

var children = [];

function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  model.detect(video).then(function (predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);

    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with '
            + Math.round(parseFloat(predictions[n].score) * 100)
            + '% confidence.';
        drawingChecker(predictions[n].class);
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: '
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: '
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}

// Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
// script tag import so ignore any warning in Glitch.
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  // Show demo section now model is ready to use.
  demosSection.classList.remove('invisible');
  document.getElementById('webcamButton').innerHTML = "Enable Webcam";
  enableWebcamButton.classList.add('wiggle');
  assignPrompts();
});

//define a list of possible objects that coco-ssd can recognize
var items = ['car', 'airplane', 'bus', 'traffic light', 'stop sign', 'bench', 'cat', 'dog', 'bird', 'umbrella', 'kite', 'tennis racket', 'wine glass', 'cup', 'knife', 'spoon', 'apple', 'donut', 'mouse', 'book', 'clock', 'scissors', 'toothbrush'];

const drawingChecker = (predicted) => {
    //Change color of item if match occurs at least once
    var index = answerKey.indexOf(predicted);
    if (index !== -1) {
      prompts[index].classList.add('strike');
    }

    //remove item from list of requirements
}
var answerKey=[];
const assignPrompts = () => {
    //randomly generates a prompt from our item list

    //get unique integers between 0 and the number of prompts - 1
    var promptCount = prompts.length;
    for (var i = 0; i < prompts.length; i++) {
      var random = Math.floor(Math.random()*items.length); //removes random item and stores into answerKey
      console.log({random});
      answerKey.push(items.splice(random, 1)[0]);
      console.log({answerKey});
      prompts[i].innerHTML = answerKey[i].toUpperCase();
    }
}










