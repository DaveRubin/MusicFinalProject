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
    this.startingAmp = 0.4;
    var startingCutoff = 1000;
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = this.startingAmp;
    this.filter = audioCtx.createBiquadFilter();
    this.filter.type = "lowshelf";
    this.filter.frequency.value = startingCutoff;
    this.filter.gain.value = 20;
    this.gainNode.connect(this.filter);
    this.filter.connect(audioCtx.destination);
    this.playing = false;
    console.log("Live sound created");
  }

  /**
   * Start playing the given timeline
   */
  play() {
    //make sure instance isn't playing already
    this.stop();
    //create new oscilator
    this.oscillator1 = audioCtx.createOscillator();
    this.oscillator1.type = 'sawtooth'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    this.oscillator1.connect(this.gainNode);
    this.oscillator2 = audioCtx.createOscillator();
    this.oscillator2.type = 'triangle'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    this.oscillator2.connect(this.gainNode);
    this.oscillator1.detune.value = -10;
    this.oscillator2.detune.value = 10;

    this.oscillator1.start();
    this.oscillator2.start();
    this.isPlaying = true;
  }

  /**
   * If oscs are playing stop them , and clear all future intervals
   */
  stop() {

    if (this.isPlaying) {
      this.isPlaying = false;
      this.oscillator1.stop();
      this.oscillator2.stop();
    }
  }

  updateFrequency(f = 0) {
    this.oscillator1.frequency.value = f;
    this.oscillator2.frequency.value = f;
  };

  updateFilter(f = 0) {
    this.filter.frequency.value = f;
  }

  updateVolume(v = 0.5) {
    this.gainNode.gain.value = v * this.startingAmp;
  }
}
