class MarginWrappingPointMover {
  constructor(sketch) {
    this.sketch = sketch;
    this.seed = this.sketch.random(0, 0.1);

    this.jitterScale = this.sketch.random(3, 10);
    this.xdrift = this.sketch.random(-2, 2);
    this.ydrift = this.sketch.random(4, -4);
    this.marginFactor = 3;

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
      console.log(this.sketch.round(xinc), this.sketch.round(yinc));
    }

    // TODO it would be great to have a *second* copy of each point, offset by one window unit
    const wrapWidth = this.sketch.windowWidth * this.marginFactor;
    const wrapHeight = this.sketch.windowHeight * this.marginFactor;
    const xOffset = (wrapWidth - this.sketch.windowWidth) / this.marginFactor;
    const yOffset = (wrapHeight - this.sketch.windowHeight) / this.marginFactor;

    point.x = ((wrapWidth + point.x + xinc + xOffset) % wrapWidth) - xOffset;
    point.y = ((wrapHeight + point.y + yinc + yOffset) % wrapHeight) - yOffset;
    if (this.sketch.DEBUG && this.debugMode === "position") {
      console.log(
        this.sketch.round(point.x),
        this.sketch.round(point.y),
        "[",
        xOffset,
        yOffset,
        "]"
      );
    }
  }
}
