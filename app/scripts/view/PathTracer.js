class PathTracer {

  constructor(timelineEvents,totalduration) {
    this.intervals = [];
    this.timeline = timelineEvents;
    this.totalduration = totalduration;
    console.log("Path tracer created");

    this.circle = new Path.Circle({
      center: new Point(50, 50),
      radius: 10,
      fillColor: 'white',
      strokeColor: 'black'
    });

    this.sound = new ShapeSound(this.timeline,this.totalduration);


    this.repeatMotion();


    // var path = new Shape.Circle(new Point(100,100), 5 );
    // path.data.vector = new Point({
    //   angle: Math.random() * 360,
    //   length : scale * Math.random() / 5
    // });
  }

  handleTimelineEvent(event) {
      this.circle.position = event.position;
  };

  repeatMotion() {
    for (var i = 0; i < this.timeline.length; i++) {
      var obj = this.timeline[i];
      var p = setTimeout(this.handleTimelineEvent.bind(this, obj), obj.duration);
      this.intervals.push(p);
    }
    setTimeout(this.repeatMotion.bind(this), this.totalduration);
  }
}
