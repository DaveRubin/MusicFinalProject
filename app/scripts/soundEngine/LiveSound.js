/**
 * Created by david on 24/05/2017.
 */
/**
 * Created by david on 23/05/2017.
 * playing sounds according to player
 */
class LiveSound {

  /**
   * C'tor
   * @param timeline - array of TimelineEvent objects
   * @param totalDuration - the total duration of the sequence
   */
  constructor() {
    this.lastPos = null;
    this.startingAmp = 0.4;
    var startingCutoff = 1000;
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = this.startingAmp;
    this.filter = audioCtx.createBiquadFilter();
    this.filter.type = "lowshelf";
    this.filter.frequency.value = startingCutoff;
    this.filter.gain.value = 30;
    this.gainNode.connect(this.filter);
    this.filter.connect(audioCtx.destination);
    this.playing = false;
    this.soundPlaying = "Synth1";
    console.log("Live sound created");
  }

  /**
   * Start playing the given timeline
   */
  play(sound) {
    this.soundPlaying = sound;
    var soundIndex = 1;
    if (sound == "Synth1") soundIndex = 1;
    else if (sound == "Synth2") soundIndex = 2;
    else return;


    //make sure instance isn't playing already
    this.stop();
    //create new oscilator
    this.oscillator1 = audioCtx.createBufferSource();
    this.oscillator1.buffer = bufferList[soundIndex];
    this.oscillator1.playbackRate.value = 1;
    this.oscillator1.loop = true;
    this.oscillator1.loopStart = 1;
    this.oscillator1.loopEnd = 2;
    this.oscillator1.connect(audioCtx.destination);

    this.oscillator1.start();
    this.isPlaying = true;
  }

  /**
   * If oscs are playing stop them , and clear all future intervals
   */
  stop() {

    if (this.isPlaying) {
      this.isPlaying = false;
      this.oscillator1.stop();
    }
  }

  updateSound(event) {
    if (this.soundPlaying != "Rythem") {
      this.oscillator1.playbackRate.value = event.mappedFrequency();
      this.gainNode.gain.value = event.mappedAmp();
      this.filter.frequency.value=   event.mappedFilter();
    }
    else {
      this.updateRythem(event);
    }
  }

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
