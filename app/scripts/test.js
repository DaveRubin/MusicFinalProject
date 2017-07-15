

// var a = new ShapeSound([
//   {time: 500, message: {amp:0.2,freq:700}},
//   {time: 1000, message: {amp:1,freq:800}},
//   {time: 1500, message: {amp:0.8,freq:100}}], 2000);

var bufferLoader;
var bufferList;
var audioCtx;
window.onload = init;
function init(){
    audioCtx = new AudioContext();
    bufferLoader = new BufferLoader(
      audioCtx,
      [
        '../sounds/tick.mp3',
        '../sounds/Synth.mp3',
        '../sounds/Light.wav'
      ],
      finishedLoadingSounds
    );

    bufferLoader.load();
};


function finishedLoadingSounds(LoadedBufferList) {
  bufferList = LoadedBufferList;
  console.log(bufferList);
  var entryPoint = new Main();
}
