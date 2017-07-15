class PathTracer {

  constructor(timelineEvents,totalduration,millisecondsBeforeStart,instrument) {
    this.instrument = instrument;
    this.millisecondsBeforeStart = millisecondsBeforeStart;
    this.timeline = timelineEvents;
    this.totalduration = totalduration;
    this.intervals = [];
    this.isPlaying = false;
    console.log("Path tracer created");

    this.circle = new Path.Circle({
      center: new Point(50, 50),
      radius: 10,
      fillColor: 'white',
      strokeColor: 'black'
    });

    this.sound = new ShapeSound(this.timeline,this.totalduration);
    this.circle.onFrame = (e)=>this.onFrame(e);
  }

  onFrame() {
    if (!this.isPlaying && this.circle.fillColor.alpha > 0 ) {
      this.circle.fillColor.alpha -= 0.05;
    }
  }

  handleTimelineEvent(event) {
      this.circle.position = event.position;
  };

  Play() {
    console.log("playing");
    setTimeout(this.StartSound.bind(this),this.millisecondsBeforeStart)
  }

  StartSound() {
    this.isPlaying = true;
    this.sound.play(this.instrument);
    this.circle.fillColor.alpha = 1;
    for (var i = 0; i < this.timeline.length; i++) {
      var obj = this.timeline[i];
      var p = setTimeout(this.handleTimelineEvent.bind(this, obj), obj.duration);
      this.intervals.push(p);
    }

    this.intervals.push(setTimeout(this.Stop.bind(this), this.totalduration));
  }

  Stop() {
    this.isPlaying = false;
    this.sound.stopPlaying();
    for (var i = 0; i < this.intervals.length; i++) {
      var interval = this.intervals[i];
      clearTimeout(interval);
    }
  }

  Kill() {
    this.sound.Kill();
    this.circle.remove();
  }
}
