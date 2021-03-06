const MovementMode = {
  HARD_WALLS: 0,
  WRAP: 1,
  WRAP_WITH_MARGIN: 2,
}

class Point {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.radius = 5
    this.seed = random(0,0.1)
  }

  move() {
    const speed = 10
    const mode = MovementMode.WRAP

    // this seems to bias up and left, still
    const xnoise = noise(frameCount * (0.03 + this.seed))
    const ynoise = noise(frameCount * (0.04 + this.seed))
    const xinc = map(xnoise, 0, 1, -speed, speed)
    const yinc = map(ynoise, 0, 1, -speed, speed)
    if (DEBUG) {
      console.log(round(xinc), round(yinc))
    }

    switch(mode) {
      case (MovementMode.WRAP): {
        // TODO doesn't work when we wrap in the negative direction
        this.x = (this.x + xinc) % (windowWidth)
        this.y = (this.y + yinc) % (windowHeight)
        break;
      }
      case (MovementMode.WRAP_WITH_MARGIN): {
        this.x = (- windowWidth / 2) + (this.x + xinc) % (windowWidth / 2)
        this.y = (- windowHeight / 2) + (this.y + yinc) % (windowHeight / 2)
        break;
      }
      case (MovementMode.HARD_WALLS):
      default: {
        this.x = max(min(this.x + xinc, windowWidth), 0)
        this.y = max(min(this.y + yinc, windowHeight), 0)
        break;
      }
    }
  }

  draw() {
    if (DEBUG) {
      push()
      noStroke()
      fill(this.color)
      if (this.x > 0 && this.y > 0 && this.x < windowWidth && this.y < windowHeight) {
        circle(this.x, this.y, this.radius)
      }
      pop()
    }
  }
}


