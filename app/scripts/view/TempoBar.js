/**
 * Created by david on 11/07/2017.
 */
class TempoBar {

  constructor() {
    this.OnStartEvent = null;

    this.barSquares = [];
    this.playPauseButton = null;
    this.interval = null;
    this.count = 4;
    this.current = 0;
    this.playing = false;

    this.updateBar();
    this.updatePlayStopButton();
    //this.Start();
  }

  Start() {
    this.interval = setTimeout(this.OnClick.bind(this), 500);
    this.playing = true;

    this.updatePlayStopButton();
  }

  Stop() {
    clearInterval(this.interval);
    this.playing = false;

    this.updatePlayStopButton();
  }

  updateBar() {
    //clear all existing items
    for (var i = 0; i < this.barSquares.length; i++) {
      var square = this.barSquares[i];
      square.Kill();
    }

    //create new items
    for (var i = 0; i < this.count; i++) {
      var s = new BarSquare(10 + i * 110, 10, 100);
      this.barSquares.push(s);
    }

    //create play pause button
    this.playPauseButton = new PlayPauseButton(10 + this.count * 110,10,100);
    this.playPauseButton.onValueChange = this.togglePlay.bind(this);
  }

  togglePlay() {
      if (this.playPauseButton.value) this.Start();
      else this.Stop();
  }

  OnClick() {
    if (this.current == 0 && this.OnStartEvent != null) this.OnStartEvent();
    var source1 = audioCtx.createBufferSource();
    source1.buffer = bufferList[0];
    source1.connect(audioCtx.destination);
    source1.playbackRate.value = this.current == 0? 1.5:1;
    source1.start(0);
    console.log("AAA");
    this.barSquares[this.current].Pulse();
    this.current = (this.current + 1) % this.count;
    this.interval = setTimeout(this.OnClick.bind(this), 500); // using set timeout instead of interval to allow usage of real time tempo change
  }

  updatePlayStopButton() {

  }
}
