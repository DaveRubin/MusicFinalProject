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
    this.grid = [];
    normalizePoint = new Point(1/view.size.width,1/view.size.height);
    this.gridOn = false;
    this.gridAlpha = 0;

    //set events
    view.onMouseDown = (e)=>this.startDraw(e);
    view.onMouseUp = (e)=>this.stopDraw(e);
    view.onMouseMove = (e)=>this.draw(e);
    view.onFrame = (e)=>this.onFrame(e);

    //TODO - Add bar counter to set some kind of frame for all of this
    this.drawGrid();
  }

  drawGrid() {
    //create 10 sections
    var p;
    var widthSection = view.size.width/10;
    for (var i = 1; i < 10; i++) {
      p = new Path({
        segments: [new Point(widthSection*i,0),new Point(widthSection*i,view.size.height)],
        strokeColor: '#222222',
      });
      p.strokeColor.alpha = 0;
      this.grid.push(p);

    }
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


    if (this.gridOn && this.gridAlpha < 1) {
      this.gridAlpha += 0.1;
      for (var i = 0; i < this.grid.length; i++) {
        var line = this.grid[i];
        line.strokeColor.alpha = this.gridAlpha;
      }
    }
    else if (!this.gridOn && this.gridAlpha > 0) {
      this.gridAlpha -= 0.1;
      for (var i = 0; i < this.grid.length; i++) {
        var line = this.grid[i];
        line.strokeColor.alpha = this.gridAlpha;
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
    this.gridOn = true;
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
    var event = new CanvasTimelineEvent(0, event.point, 0);
    this.sound.updateSound(event);
    this.timelineEvents.push(event);
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
    var totalDuration = Date.now() - this.startTime;
    this.gridOn = false;
    this.killList.push(this.path);
    if (totalDuration< 500) return;
    var pt = new PathTracer(this.timelineEvents,totalDuration);
    this.path.simplify(10);
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
