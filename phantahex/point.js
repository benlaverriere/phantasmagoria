class Point {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.radius = 5
  }

  move() {
    const speed = 10

    // this seems to bias up and left, still
    const xinc = (noise(frameCount * 0.03, 0.720, this.x / 100) * 2 - 1) * speed
    const yinc = (noise(-frameCount * 0.04, 0.135, this.y / 100) * 2 - 1) * speed
    if (DEBUG) {
      console.log(xinc, yinc)
    }

    // this clamping results in synchronized x and/or y values once the points hit an edge
    this.x = max(min(this.x + xinc, windowWidth), 0)
    this.y = max(min(this.y + yinc, windowHeight), 0)
  }

  draw() {
    push()
    noStroke()
    fill(this.color)
    circle(this.x, this.y, this.radius)
    pop()
  }
}


