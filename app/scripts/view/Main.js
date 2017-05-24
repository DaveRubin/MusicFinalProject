/**
 * Created by david on 24/05/2017.
 * The main class, app root
 */
class Main {
  constructor() {
    paper.install(window);
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    view.onMouseDown = this.startDraw;
    view.onMouseUp = this.stopDraw;
    view.onMouseMove = this.draw;

    this.isDrawing = false;
    this.path = null;
    this.timelineEvents = [];
  }

  startDraw(event) {
    console.log('Start draw ');
    this.timelineEvents = [];
    this.startTime = Date.now();
    this.lastPoint = event.point;
    this.isDrawing = true;
    this.path = new Path({
      segments: [event.point],
      strokeColor: 'white',
      // Select the path, so we can see its segment points:
      fullySelected: true
    });
  }

  stopDraw(event) {
    console.log("Stop Draw");
    this.isDrawing = false;
    this.path.simplify(10);
    console.log(this.timelineEvents);
  }

  draw(event) {

    if (this.isDrawing) {
      var p = event.point;
      this.path.add(p);
      var timePassed = Date.now() - this.startTime;
      this.timelineEvents.push(new CanvasTimelineEvent(timePassed,p,p.subtract(this.lastPoint)));
      this.lastPoint = p;
    }
  }
}
