/**
 * Created by david on 11/07/2017.
 */
class TempoBar {

  constructor() {
    this.OnStartEvent = null;
    this.OnStopEvent = null;
    this.OnResetEvent = null;

    this.barSquares = [];
    this.interval = null;
    this.count = 4;
    this.current = 0;
    this.playing = false;

    this.updateBar();

    $(PlayButton).click($.proxy(  this.togglePlay, this));
    $(ResetButton).click($.proxy(  this.OnReset, this));
  }

  Start() {
    this.interval = setTimeout(this.OnClick.bind(this), 500);
    this.playing = true;
  }

  Stop() {
    clearInterval(this.interval);
    this.playing = false;
    this.current = 0;
    if (this.OnStopEvent) this.OnStopEvent();
  }

  updateBar() {
    this.barSquares = [];
    var a = $( ".item" );
    for (var i = 0; i < a.length; i++) {
      var obj = a[i];
      $(obj).fadeTo(0,0);
      this.barSquares.push($(obj));
    }
  }

  togglePlay() {
      if (!this.playing) {
        this.Start();
      }
      else {
        this.Stop();
      }
    this.UpdateButton();
  }

  UpdateButton() {
    $(PlayButton).html( this.playing ? "Stop" : "Play" );
  }

  OnClick() {
    if (this.current == 0 && this.OnStartEvent != null) this.OnStartEvent();
    var source1 = audioCtx.createBufferSource();
    source1.buffer = bufferList[0];
    source1.connect(audioCtx.destination);
    source1.playbackRate.value = this.current == 0? 1.5:1;
    source1.start(0);
    //animate this bar
    var item=  this.barSquares[this.current];
    item.fadeTo(1,1,function() {
      item.fadeTo(1000,0);
    });
    this.current = (this.current + 1) % this.count;
    this.interval = setTimeout(this.OnClick.bind(this), 500); // using set timeout instead of interval to allow usage of real time tempo change
  }

  OnReset() {
    this.Stop();
    this.UpdateButton();
    if (this.OnResetEvent != null) this.OnResetEvent();
  }
}
