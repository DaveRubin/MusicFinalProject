/**
 * Created by david on 24/05/2017.
 * The main class, app root
 */
var normalizePoint;
class Main {
  constructor() {
    //initialise paper
    paper.install(window);
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    //set vars
    this.isDrawing = false;
    this.path = null;
    this.timelineEvents = [];
    this.killList = [];
    this.sound = new LiveSound();
    normalizePoint = new Point(1/view.size.width,1/view.size.height);

    //set events
    view.onMouseDown = (e)=>this.startDraw(e);
    view.onMouseUp = (e)=>this.stopDraw(e);
    view.onMouseMove = (e)=>this.draw(e);
    view.onFrame = (e)=>this.onFrame(e);

    //TODO - Add bar counter to set some kind of frame for all of this
  }

  /**
   * If kill list is has elements, fade them and then kill them after they fade out
   * @param event
   */
  onFrame(event) {
    if (this.killList.length > 0) {
      var i = this.killList.length;
      while (i--) {
        var path = this.killList[i];
        if (path.strokeColor.alpha > 0) {
          path.strokeColor.alpha -= 0.05;
        }
        else {
          console.log("removeing from list");
          this.killList.splice(i, 1);
          path.remove();
        }
      }
    }
  }

  /**
   * When user starts a draw, record its path and let live sound play that path.
   * @param event
   */
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
    this.timelineEvents.push(new CanvasTimelineEvent(0, event.point, 0));
  }

  /**
   * When user stops from drawing shape,
   * TODO - create the looper visual\sonic objects
   * Insert finished path to kill list
   * @param event
   */
  stopDraw(event) {
    this.sound.stop();
    console.log("Stop Draw");
    this.isDrawing = false;
    var pt = new PathTracer(this.timelineEvents,Date.now() - this.startTime);
    this.path.simplify(10);
    this.killList.push(this.path);
  }

  /**
   * when user moves. if drawing, then  alter the live sound according to axis\speed\vector
   * @param event
   */
  draw(event) {
    if (this.isDrawing) {
      var p = event.point;
      var timePassed = Date.now() - this.startTime;
      var speed = p.subtract(this.lastPoint);
      this.path.add(p);
      var event = new CanvasTimelineEvent(timePassed, p, speed);
      this.sound.updateSound(event);
      // this.sound.updateFrequency(p.x + 400);
      // this.sound.updateVolume(p.y/1400);
      // this.sound.updateFilter(Math.min(Math.abs(speed.x) * 400, 2050));
      this.timelineEvents.push(event);
      this.lastPoint = p;
    }
  }
}
