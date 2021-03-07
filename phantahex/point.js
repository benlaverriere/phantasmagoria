const POINT_DEBUG_MODE = "draw";

// TODO could be interesting to try a different approach to falloff, where points have defined radii. That way we can
// explicitly know when they're offscreen rather than guessing with very large margins, etc.
class Point {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 5;
    this.seed = random(0, 0.1);

    this.jitterScale = random(3, 10);
    this.xdrift = random(-2, 2);
    this.ydrift = random(4, -4);
  }

  move() {
    const xnoise = noise(frameCount * (0.03 + this.seed));
    const ynoise = noise(frameCount * (0.04 + this.seed));
    const xinc =
      map(xnoise, 0, 1, -this.jitterScale, this.jitterScale) + this.xdrift;
    const yinc =
      map(ynoise, 0, 1, -this.jitterScale, this.jitterScale) + this.ydrift;

    if (DEBUG && POINT_DEBUG_MODE === "increment") {
      console.log(round(xinc), round(yinc));
    }

    switch (config.movementMode) {
      case MovementMode.WRAP: {
        this.x = (windowWidth + this.x + xinc) % windowWidth;
        this.y = (windowHeight + this.y + yinc) % windowHeight;
        break;
      }
      case MovementMode.WRAP_WITH_MARGIN: {
        // TODO it would be great to have a *second* copy of each point, offset by one window unit
        const marginFactor = 3;
        const wrapWidth = windowWidth * marginFactor;
        const wrapHeight = windowHeight * marginFactor;
        const xOffset = (wrapWidth - windowWidth) / marginFactor;
        const yOffset = (wrapHeight - windowHeight) / marginFactor;

        this.x = ((wrapWidth + this.x + xinc + xOffset) % wrapWidth) - xOffset;
        this.y =
          ((wrapHeight + this.y + yinc + yOffset) % wrapHeight) - yOffset;
        if (DEBUG && POINT_DEBUG_MODE === "position") {
          console.log(round(this.x), round(this.y), "[", xOffset, yOffset, "]");
        }
        break;
      }
      case MovementMode.HARD_WALLS:
      default: {
        const newX = this.x + xinc;
        const newY = this.y + yinc;
        if (newX < 0 || newX > windowWidth) {
          this.xdrift *= -1;
        }
        if (newY < 0 || newY > windowHeight) {
          this.ydrift *= -1;
        }

        this.x = max(min(newX, windowWidth), 0);
        this.y = max(min(newY, windowHeight), 0);
        break;
      }
    }
  }

  draw() {
    if (DEBUG && POINT_DEBUG_MODE !== "none") {
      push();
      noStroke();
      fill(this.color.p5());
      if (
        this.x > 0 &&
        this.y > 0 &&
        this.x < windowWidth &&
        this.y < windowHeight
      ) {
        circle(this.x, this.y, this.radius);
      }
      pop();
    }
  }
}
