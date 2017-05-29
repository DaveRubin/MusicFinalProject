/**
 * Created by david on 24/05/2017.
 */
class CanvasTimelineEvent {
  constructor(duration, position, speed) {
    this.duration = duration;
    this.position = position;
    this.speed = speed;
    this.notes = [440,493.9,523.3,587.3,659.3,698.5,784.0,880.0,987.8,1047];
  }

  mappedFrequency() {
    var tone = 300;
    var ratio = this.position.x/view.size.width;

    if (ratio< 0.1)       tone = this.notes[0];
    else if (ratio< 0.2)  tone = this.notes[1];
    else if (ratio< 0.3)  tone = this.notes[2];
    else if (ratio< 0.4)  tone = this.notes[3];
    else if (ratio< 0.5)  tone = this.notes[4];
    else if (ratio< 0.6)  tone = this.notes[5];
    else if (ratio< 0.7)  tone = this.notes[6];
    else if (ratio< 0.8)  tone = this.notes[7];
    else if (ratio< 0.9)  tone = this.notes[8];
    else if (ratio< 1)    tone = this.notes[9];
    return tone;
  }

  mappedAmp() {
    return 0.5;
  }

  mappedFilter() {
    return 2000- (this.position.y/view.size.height)*2000;
  }
}
