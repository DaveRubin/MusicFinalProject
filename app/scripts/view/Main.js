/**
 * Created by david on 24/05/2017.
 * The main class, app root
 */
class Main {
  constructor() {
    paper.install(window);
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);


    this.isDrawing = false;
    this.path = null;
    this.timelineEvents = [];
    this.sound = new LiveSound();


    view.onMouseDown = (e)=>this.startDraw(e);
    view.onMouseUp = (e)=>this.stopDraw(e);
    view.onMouseMove = (e)=>this.draw(e);
  }

  startDraw(event) {
    console.log('Start draw ');
    if (this.isDrawing) return;

    this.sound.play();
    this.timelineEvents = [];
    this.startTime = Date.now();
    this.lastPoint = event.point;
    this.isDrawing = true;
    this.path = new Path({
      segments: [event.point],
      strokeColor: 'white',
      // Select the path, so we can see its segment points:
      // fullySelected: true
    });
  }

  stopDraw(event) {
    this.sound.stop();
    console.log("Stop Draw");
    this.isDrawing = false;
    this.path.simplify(10);
    console.log(this.timelineEvents);
  }

  draw(event) {
    if (this.isDrawing) {
      var p = event.point;
      var timePassed = Date.now() - this.startTime;
      var speed = p.subtract(this.lastPoint);
      this.path.add(p);
      this.sound.updateFrequency(p.x + 400);
      // this.sound.updateVolume(p.y/1400);
      this.sound.updateFilter(Math.min(Math.abs(speed.x)*400,2050));
      this.timelineEvents.push(new CanvasTimelineEvent(timePassed,p,speed));
      this.lastPoint = p;
    }
  }
}
