class MarginWrappingPoint {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 5;
    this.seed = random(0, 0.1);

    this.jitterScale = random(3, 10);
    this.xdrift = random(-2, 2);
    this.ydrift = random(4, -4);
    this.marginFactor = 3;

    this.debugMode = "draw";
  }

  move() {
    const xnoise = noise(frameCount * (0.03 + this.seed));
    const ynoise = noise(frameCount * (0.04 + this.seed));
    const xinc =
      map(xnoise, 0, 1, -this.jitterScale, this.jitterScale) + this.xdrift;
    const yinc =
      map(ynoise, 0, 1, -this.jitterScale, this.jitterScale) + this.ydrift;

    if (DEBUG && this.debugMode === "increment") {
      console.log(round(xinc), round(yinc));
    }

    // TODO it would be great to have a *second* copy of each point, offset by one window unit
    const wrapWidth = windowWidth * this.marginFactor;
    const wrapHeight = windowHeight * this.marginFactor;
    const xOffset = (wrapWidth - windowWidth) / this.marginFactor;
    const yOffset = (wrapHeight - windowHeight) / this.marginFactor;

    this.x = ((wrapWidth + this.x + xinc + xOffset) % wrapWidth) - xOffset;
    this.y = ((wrapHeight + this.y + yinc + yOffset) % wrapHeight) - yOffset;
    if (DEBUG && this.debugMode === "position") {
      console.log(round(this.x), round(this.y), "[", xOffset, yOffset, "]");
    }
  }

  // TODO extract shared drawing code to a PointRenderer or something
  draw() {
    if (DEBUG && this.debugMode !== "none") {
      push();
      noStroke();
      fill(this.color.p5());
      if (
        this.x > 0 &&
        this.y > 0 &&
        this.x < windowWidth &&
        this.y < windowHeight
      ) {
        push();
        fill(config.background);
        circle(this.x, this.y, this.radius + 1);
        pop();

        circle(this.x, this.y, this.radius);
      }
      pop();
    }
  }
}

class MarginWrappingPointFactory {
  build(x, y, color) {
    return new MarginWrappingPoint(x, y, color);
  }
}
