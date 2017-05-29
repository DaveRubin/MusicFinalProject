/**
 * Created by david on 23/05/2017.
 * playing sounds according to player
 */
var audioCtx = new AudioContext();
class ShapeSound {

  /**
   * C'tor
   * @param timeline - array of TimelineEvent objects
   * @param totalDuration - the total duration of the sequence
   */
  constructor(timeline = [], totalDuration = 0) {
    var startingCutoff = 1000;

    this.startingAmp = 0.4;
    this.timeline = timeline;
    this.totalDuration = totalDuration;
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = this.startingAmp;
    this.filter = audioCtx.createBiquadFilter();
    this.filter.type = "lowshelf";
    this.filter.frequency.value = startingCutoff;
    this.filter.gain.value = 30;
    this.gainNode.connect(this.filter);
    this.filter.connect(audioCtx.destination);
    this.playing = false;
    this.intervals = [];
  }

  /**
   * Start playing the given timeline
   */
  play() {
    //make sure instance isn't playing already
    this.stopPlaying();

    //create new oscilator
    this.oscillator1 = audioCtx.createOscillator();
    this.oscillator1.type = 'sawtooth'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    this.oscillator1.connect(this.gainNode);
    this.oscillator2 = audioCtx.createOscillator();
    this.oscillator2.type = 'triangle'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    this.oscillator2.connect(this.gainNode);
    this.oscillator1.detune.value = -10;
    this.oscillator2.detune.value = 10;

    //then schedule control
    for (var i = 0; i < this.timeline.length; i++) {
      var obj = this.timeline[i];
      var p = setTimeout(this.handleTimelineEvent.bind(this, obj), obj.duration);
      this.intervals.push(p);
    }

    var endingP = setTimeout(()=>this.stopPlaying(), this.totalDuration);
    this.intervals.push(endingP);
  }

  /**
   * If oscs are playing stop them , and clear all future intervals
   */
  stopPlaying() {

    if (this.isPlaying) {
      this.isPlaying = false;
      this.oscillator1.stop();
      this.oscillator2.stop();
    }

    //clear all current events
    for (var i = 0; i < this.intervals.length; i++) {
      clearInterval(this.intervals[i]);
    }
    this.intervals = [];
  }

  /**
   * Gets the timeline event and alters sin according to it
   * @param event - CanvasTimelineEvent object
   */
  handleTimelineEvent(event) {

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.oscillator1.start();
      this.oscillator2.start();
    }

    //map
    this.oscillator1.frequency.value = event.mappedFrequency();
    this.oscillator2.frequency.value = event.mappedFrequency();
    this.gainNode.gain.value = event.mappedAmp();
    this.filter.frequency.value=   event.mappedFilter();
  };
}
