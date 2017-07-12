/**
 * Created by david on 11/07/2017.
 */
class TempoBar {

  constructor() {
    this.OnStartEvent = null;

    this.barSquares = [];
    this.interval = null;
    this.count = 4;
    this.current = 0;

    this.updateBar();
    this.Start();
  }

  Start() {
    this.interval = setTimeout(this.OnClick.bind(this), 500);
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
  }

  OnClick() {
    if (this.current == 0 && this.OnStartEvent != null) this.OnStartEvent();
    this.barSquares[this.current].Pulse();
    this.current = (this.current + 1) % this.count;
    this.interval = setTimeout(this.OnClick.bind(this), 500); // using set timeout instead of interval to allow usage of real time tempo change
  }
}
