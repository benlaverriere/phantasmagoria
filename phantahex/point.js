class Point {
  constructor(sketch, x, y, color, mover) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.color = color;
    this.mover = mover;
  }

  move() {
    this.mover.move(this);
  }

  reposition(lastWindowWidth, lastWindowHeight) {
    this.x = (this.x / lastWindowWidth) * this.sketch.windowWidth;
    this.y = (this.y / lastWindowHeight) * this.sketch.windowHeight;
  }

  // TODO try different renderers
  draw() {
    if (this.sketch.DEBUG && this.debugMode !== "none") {
      this.sketch.push();
      this.sketch.noStroke();
      this.sketch.fill(this.color.p5(this.sketch));
      if (
        this.x > 0 &&
        this.y > 0 &&
        this.x < this.sketch.windowWidth &&
        this.y < this.sketch.windowHeight
      ) {
        this.sketch.push();
        this.sketch.fill(config.background);
        this.sketch.circle(this.x, this.y, this.radius + 1);
        this.sketch.pop();

        this.sketch.circle(this.x, this.y, this.radius);
      }
      this.sketch.pop();
    }
  }
}

class PointFactory {
  constructor(sketch, mover) {
    this.sketch = sketch;
    this.mover = mover;
  }

  build(x, y, color) {
    return new Point(this.sketch, x, y, color, this.mover);
  }
}
