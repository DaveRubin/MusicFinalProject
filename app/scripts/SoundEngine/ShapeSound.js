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

  Kill() {
    this.gainNode.disconnect();
    this.filter.disconnect();
  }

  /**
   * Start playing the given timeline
   */
  play(sound) {
    this.soundPlaying = sound;
    var soundIndex = 1;
    if (sound == "Synth1") soundIndex = 1;
    else if (sound == "Synth2") soundIndex = 2;
    if (this.soundPlaying != "Rythem") {

      //make sure instance isn't playing already
      this.stopPlaying();

      this.oscillator1 = audioCtx.createBufferSource();
      this.oscillator1.buffer = bufferList[soundIndex];
      this.oscillator1.connect(audioCtx.destination);
      this.oscillator1.playbackRate.value = 1;
      this.oscillator1.loop = true;
      this.oscillator1.loopStart = 1;
      this.oscillator1.loopEnd = 2;
    }

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
      if (this.soundPlaying != "Rythem") this.oscillator1.stop();
      //this.oscillator2.stop();
    }

    //clear all current events
    for (var i = 0; i < this.intervals.length; i++) {
      clearInterval(this.intervals[i]);
    }
    if (this.path) {
      this.fadingPath = this.path;
      this.fadingPath.onFrame = (e)=>this.fade(e);
      this.path = null;
    }
    this.intervals = [];
  }

  fade(e) {
    this.fadingPath.strokeColor.alpha -=0.05;
    if (this.fadingPath.strokeColor.alpha <= 0) this.fadingPath.clear();
  }

  /**
   * Gets the timeline event and alters sin according to it
   * @param event - CanvasTimelineEvent object
   */
  handleTimelineEvent(event) {
    if (!this.path) {
      this.path = new Path({
        segments: [event.position],
        strokeColor: 'white'
      });
    }
    else {
      this.path.add(event.position);
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      if (this.soundPlaying != "Rythem") this.oscillator1.start();
      //this.oscillator2.start();
    }
    if (this.soundPlaying != "Rythem") {
      //map
      this.oscillator1.playbackRate.value = event.mappedFrequency();
      //this.oscillator2.frequency.value = event.mappedFrequency();
      this.gainNode.gain.value = event.mappedAmp();
      this.filter.frequency.value=   event.mappedFilter();
    }
    else {
      this.updateRythem(event);
    }
  };

  updateRythem(event) {
    if (this.lastPos) {
      var p  = this.lastPos.multiply(event.speed);
      if (p.x < 0 || p.y < 0) {
        //switch direction
        this.playTick();
      }
    }
    this.lastPos = event.speed;
  }

  playTick() {
    var source1 = audioCtx.createBufferSource();
    source1.buffer = bufferList[0];
    source1.connect(audioCtx.destination);
    // source1.playbackRate.value = this.current == 0? 1.5:1;
    source1.start(0);
  }
}
