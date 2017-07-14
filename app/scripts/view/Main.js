/**
 * Created by david on 24/05/2017.
 * The main class, app root
 *
 * //TODO - create tempo tool
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
    this.lastTickTime = null;
    this.millisecondsBeforeStart = null;
    this.path = null;
    this.gridOn = false;
    this.gridAlpha = 0;
    this.timelineEvents = [];
    this.killList = [];
    this.grid = [];
    this.paths = [];
    this.sound = new LiveSound();
    this.selectedInstrument = "Synth1";
    normalizePoint = new Point(1/view.size.width,1/view.size.height);

    //set events
    view.onMouseDown = (e)=>this.startDraw(e);
    view.onMouseUp = (e)=>this.stopDraw(e);
    view.onMouseMove = (e)=>this.draw(e);
    view.onFrame = (e)=>this.onFrame(e);

    this.drawGrid();
    this.bar = new TempoBar();
    this.bar.OnStartEvent = this.OnBarStart.bind(this);
    this.bar.OnStopEvent = this.OnBarStop.bind(this);
    this.bar.OnResetEvent = this.OnReset.bind(this);

    this.RegisterInstruments();
  }

  RegisterInstruments() {
    $("input[name=selector][value=" + this.selectedInstrument + "]").prop('checked', true);
    $("input[name=selector]").change(function () {
      this.selectedInstrument = $('input[name=selector]:checked').val();
    }.bind(this));
  }

  OnReset() {
    for (var i = 0; i < this.paths.length; i++) {
      var path = this.paths[i];
      path.Kill();
    }
    this.paths = [];
  }

  OnBarStop() {
    for (var i = 0; i < this.paths.length; i++) {
      var path = this.paths[i];
      path.Stop();
    }
  }

  OnBarStart() {
    this.lastTickTime = new Date();
    for (var i = 0; i < this.paths.length; i++) {
      var path = this.paths[i];
      if (!path.isPlaying) path.Play();
    }
  }

  drawGrid() {
    //create 10 sections
    var p;
    var widthSection = view.size.width/10;
    for (var i = 1; i < 10; i++) {
      p = new Path({
        segments: [new Point(widthSection*i,0),new Point(widthSection*i,view.size.height)],
        strokeColor: '#222222'
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

      //path fade functionality
      while (i--) {
        var path = this.killList[i];
        if (path.strokeColor.alpha > 0) {
          path.strokeColor.alpha -= 0.05;
        }
        else {
          this.killList.splice(i, 1);
          path.remove();
        }
      }
    }

    //grid fade functionality
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
    if (this.isDrawing) return;
    this.millisecondsBeforeStart = new Date() - this.lastTickTime ;
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
   * Insert finished path to kill list
   * @param event
   */
  stopDraw(event) {
    this.sound.stop();
    this.isDrawing = false;
    var totalDuration = Date.now() - this.startTime;
    this.gridOn = false;
    this.killList.push(this.path);
    if (totalDuration< 500) return;

    this.paths.push(new PathTracer(this.timelineEvents,totalDuration,this.millisecondsBeforeStart));
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
