/**
 * Created by david on 11/07/2017.
 */
class BarSquare {
  constructor(x,y,size) {
    //vars
    this.fading = true;
    this.fadeAmount = 0.02;

    //main shape
    this.shape = new Path.Rectangle({
      point: [x, y],
      size: [size, size],
      fillColor: 'white',
      strokeColor: 'black'
    });
    this.shape.fillColor.alpha = 0;

    //events
    this.shape.onFrame = (e)=>this.onFrame(e);
  }

  onFrame(event) {
    if (this.fading) {
      this.shape.fillColor.alpha -= this.fadeAmount;
      if (this.shape.fillColor.alpha <= 0) {
        this.fading = false;
      }
    }
  }

  Pulse() {
    this.fading = true;
    this.shape.fillColor.alpha = 1;
  }

  Kill() {
    this.shape.remove();
  }
}
