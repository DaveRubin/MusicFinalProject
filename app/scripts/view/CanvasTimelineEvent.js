/**
 * Created by david on 24/05/2017.
 */
class CanvasTimelineEvent {
  constructor(duration, position, speed) {
    this.duration = duration;
    this.position = position;
    this.speed = speed;
  }

  mappedFrequency() {
    return (this.position.x/view.size.width)*1500+ 400;
  }

  mappedAmp() {
    return (this.position.y/view.size.height)*0.8 + 0.2;
  }

  mappedFilter() {
    return 400;
  }
}
