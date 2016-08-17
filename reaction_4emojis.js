//trying to add all four emotions

var state = "POSSIBLE" || "LIKELY"|| "VERY_LIKELY" ;

var fr = 10;

var input;

var faceData;

var request, output;

var capture;
var w = 640, h = 480;

var joyResult;
var angryResult;
var sorrowResult;
var surpriseResult;

//emoji variables
var emojiX = [];
var emojiY = [];
var step;
var emojiContainer;
var numberEmotion = 10;


//var img;

function preload() {

  angry = loadImage('assets/angry copy.png');
  happy = loadImage('assets/happy copy.png')
  sorrow = loadImage('assets/sorrow copy.png');
  surprise = loadImage('assets/surprise copy.png');
}

function setup() {
  createCanvas(w, h);

  capture = createCapture(VIDEO);

  capture.size(w, h);
  capture.hide();
  
  frameRate(fr);
  
  emojiContainer = [angry, happy, sorrow, surprise]; //what's the point of this?
  
  initEmojiPos();

}

function initEmojiPos() {
  
  for (var i = 0; i < emojiContainer.length; i++) {
    //console.log(emojiContainer.length);
    emojiX.push(random(w));
    emojiY.push(random(h));
    step = 10;
    //numberEmotion = 1;
  }
  
}

//Google Cloud Vision API
function blobToBase64(blob, cb) {
  var reader = new window.FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function() {
    cb(reader.result);
  }
}

function canvasToBase64(canvas, cb) {
  canvas.toBlob(function(blob) {
    blobToBase64(blob, cb);
  }, 'image/jpeg');
}

function upload() {
  canvasToBase64(canvas, function(b64) {
    b64 = b64.replace('data:image/jpeg;base64,', ''); // remove content type
    request = {
      "requests": [{
        "image": {
          "content": b64
        },
        "features": [{
          "type": "FACE_DETECTION",
          "maxResults": 1
        }]
      }]
    };

    $.ajax({
      method: 'POST',
      url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAYYA3RmFbo2ulGIq1dnkB13LGdDkZIbv0',
      contentType: 'application/json',
      data: JSON.stringify(request),
      processData: false,
      success: function(data) {
        output = data;
        //var faceData = data.responses[0].faceAnnotations[0];
        faceData = data.responses[0].faceAnnotations[0];
        console.log('joy: ' + faceData.joyLikelihood);
        mood += faceData.joyLikelihood;


        console.log('sorrow: ' + faceData.sorrowLikelihood);
        mood += faceData.sorrowLikelihood;

        console.log('anger: ' + faceData.angerLikelihood);
        mood += faceData.angerLikelihood;


        console.log('surprise: ' + faceData.surpriseLikelihood);
        mood += faceData.surpriseLikelihood;

      },

      error: function(data, textStatus, errorThrown) {
        console.log('error');

      }
    })

  })
}


//canvas output

var mood = '';


function draw() {
  //console.log("draw");
  //image(img, 0, 0, w, h);
  text(mood, 50, 300)
  image(capture, 0, 0, w, h);
  upload();

  //initalizing data ... is this confusing?
  if(faceData != null) {
    angryEmoji(faceData.angerLikelihood);
  }
  
  if(faceData != null) {
    joyEmoji(faceData.joyLikelihood);
  }
  
  if(faceData != null) {
    sorrowEmoji(faceData.sorrowLikelihood); //can I do this for each emotion?
  }
  
  if(faceData != null) { //could I combine this into one?
    surpriseEmoji(faceData.surpriseLikelihood); //can I do this for each emotion?
  }

}

//functions to translate face detection data to corresponding emojis
function angryEmoji(angryResult) { 
  if (angryResult === state){
    drawAngry();
  }
  updateEmojiPos();
}

function joyEmoji(joyResult) { //this joy result part confuses me
  if (joyResult === state){
    drawJoy();
    //console.log("YAY"); //why is this not false?
  }
  // if (joyResult === 'VERY_UNLIKELY') { //why still drawing happy? angry and happy, buy if I put the number, then no angry
  //   drawAngry();
  // }
  updateEmojiPos();
}

function sorrowEmoji(sorrowResult) { 
  if (sorrowResult === state){ // || joyResult === 'VERY_UNLIKELY'
    drawSorrow();
  }
  updateEmojiPos();
}

function surpriseEmoji(surpriseResult) { //drawing surprise even though it's very_unlikely
  if (surpriseResult === state){
    drawSurprise();
  }
  updateEmojiPos();
}


// function to get emojis moving
function updateEmojiPos() {
  for (var i = 0; i < emojiContainer.length; i++) {
    emojiX[i] = emojiX[i] + random(-step, step);
    emojiY[i] = emojiY[i] + random(-step, step);
  }
  
}


//functions to draw emojis to canvas
function drawAngry() {
  for (var i = 0; i < numberEmotion; i ++) {
    image(angry, random(w), random(h), 50, 50);
  }
}

function drawJoy() {
  for (var i = 0; i < numberEmotion; i ++) {
    image(happy, random(w), random(h), 50, 50);
  }
}
  
function drawSorrow() {
  for (var i = 0; i < numberEmotion; i ++) {
    image(sorrow, random(w), random(h), 50, 50);
  }
}

function drawSurprise() {
  for (var i = 0; i < numberEmotion; i ++) {
    image(surprise, random(w), random(h), 50, 50);
  }
}
