/**
 * Created by david on 23/05/2017.
 * playing sounds according to player
 */
var audioCtx = new AudioContext();
class ShapeSound {
  constructor(timeline = [], totalduration = 0) {
    this.timeline = timeline;
    this.totalduration = totalduration;
    this.oscillator = audioCtx.createOscillator();
    this.gainNode = audioCtx.createGain();
    this.oscillator.connect(this.gainNode);
    this.oscillator.type = 'sawtooth'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    this.oscillator.frequency.value = 800; // value in hertz
    this.oscillator.start();
  }

  /**
   * Start playing the given timeline
   */
  play() {
    this.gainNode.connect(audioCtx.destination);
    for (var i = 0; i < this.timeline.length; i++) {
      var obj = this.timeline[i];
      this.delay(obj.time, obj.message).then(event=>this.handleTimelineEvent(event));
    }

    this.delay(this.totalduration, null).then(()=>this.stopPlaying());
  }

  stopPlaying() {
    console.log("STOP!");
    this.gainNode.disconnect();
  }

  delay(ms, obj) {
    return new Promise(function (resolve, reject) {
      setTimeout(()=>resolve(obj), ms);
    });
  }

  /**
   * Gets the timeline event and alters sin according to it
   * @param event
   */
  handleTimelineEvent(event) {
    console.log(event);
    this.oscillator.frequency.value = event.freq;
    this.gainNode.gain.value= event.amp;
    this.timeline;
  };


}

var a = new ShapeSound([
  {time: 500, message: {amp:0.2,freq:700}},
  {time: 1000, message: {amp:1,freq:800}},
  {time: 1500, message: {amp:0.8,freq:100}}], 2000);
a.play();
