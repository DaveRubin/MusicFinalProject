
var events = [];
for (var i = 0; i < 100; i++) {
  var te = new TimelineEvent(i*10,0.8,500+i*5);
  events.push(te);
}

// var a = new ShapeSound([
//   {time: 500, message: {amp:0.2,freq:700}},
//   {time: 1000, message: {amp:1,freq:800}},
//   {time: 1500, message: {amp:0.8,freq:100}}], 2000);
var a = new ShapeSound(events, 1000);

var audioCtx = new AudioContext();
window.onload = function() {
    var a = new Main();
};
