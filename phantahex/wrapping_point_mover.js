class WrappingPointMover {
  constructor(sketch) {
    this.sketch = sketch;
    this.seed = this.sketch.random(0, 0.1);

    this.jitterScale = this.sketch.random(3, 10);
    this.xdrift = this.sketch.random(-2, 2);
    this.ydrift = this.sketch.random(4, -4);

    this.debugMode = "draw";
  }

  move(point) {
    const xnoise = this.sketch.noise(
      this.sketch.frameCount * (0.03 + this.seed)
    );
    const ynoise = this.sketch.noise(
      this.sketch.frameCount * (0.04 + this.seed)
    );
    const xinc =
      this.sketch.map(xnoise, 0, 1, -this.jitterScale, this.jitterScale) +
      this.xdrift;
    const yinc =
      this.sketch.map(ynoise, 0, 1, -this.jitterScale, this.jitterScale) +
      this.ydrift;

    if (this.sketch.DEBUG && this.debugMode === "increment") {
      console.log(Math.round(xinc), Math.round(yinc));
    }

    point.x =
      (this.sketch.windowWidth + point.x + xinc) % this.sketch.windowWidth;
    point.y =
      (this.sketch.windowHeight + point.y + yinc) % this.sketch.windowHeight;
  }
}
