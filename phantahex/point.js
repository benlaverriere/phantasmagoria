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

    // this seems to bias up and left, still
    const xinc = (noise(frameCount * (0.03 + this.seed)) * 2 - 1) * speed
    const yinc = (noise(frameCount * (0.04 + this.seed)) * 2 - 1) * speed
    if (DEBUG) {
      console.log(xinc, yinc)
    }

    this.x = max(min(this.x + xinc, windowWidth), 0)
    this.y = max(min(this.y + yinc, windowHeight), 0)
  }

  draw() {
    if (DEBUG) {
      push()
      noStroke()
      fill(this.color)
      circle(this.x, this.y, this.radius)
      pop()
    }
  }
}


