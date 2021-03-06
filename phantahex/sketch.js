const DEBUG = false

function colorFalloff(coloredPoint, referencePoint) {
  const exp = 2
  const maxDist = pow(min(windowWidth, windowHeight) / 2, exp)
  const newRed = map(
    pow(dist(referencePoint.x, referencePoint.y, coloredPoint.x, coloredPoint.y), exp),
    0,
    maxDist,
    red(coloredPoint.color),
    0
  )
  const newGreen = map(
    pow(dist(referencePoint.x, referencePoint.y, coloredPoint.x, coloredPoint.y), exp),
    0,
    maxDist,
    green(coloredPoint.color),
    0
  )
  const newBlue = map(
    pow(dist(referencePoint.x, referencePoint.y, coloredPoint.x, coloredPoint.y), exp),
    0,
    maxDist,
    blue(coloredPoint.color),
    0
  )
  return color(newRed, newGreen, newBlue)
}

class Hex {
  constructor(x, y, size, flipped) {
    this.x = x
    this.y = y
    this.flipped = flipped
    this.radius = size / 2

    this.color = color(random(128), 0, random(128))
    this.id = `(${round(this.x)},${round(this.y)})`
  }

  draw(points) {
    this.color = color(0, 0, 0)
    for (i = 0; i < points.length; i++) {
      const c = colorFalloff(points[i], this)
      this.color.setRed(red(this.color) + red(c) / points.length)
      this.color.setGreen(green(this.color) + green(c) / points.length)
      this.color.setBlue(blue(this.color) + blue(c) / points.length)
    }

    const heightFactor = this.flipped ? 1 : sqrt(3) / 2
    const widthFactor = this.flipped ? sqrt(3) / 2 : 1

    const top = this.x + this.radius * heightFactor
    const midtop = this.x + this.radius / 2
    const middle = this.x
    const midbottom = this.x - this.radius / 2
    const bottom = this.x - this.radius * heightFactor

    const left = this.y - this.radius * widthFactor
    const midleft = this.y - this.radius / 2
    const center = this.y;
    const midright = this.y + this.radius / 2
    const right = this.y + this.radius * widthFactor

    const verticesRegular = [
      {x: top, y: midleft},
      {x: top, y: midright},
      {x: middle, y: right},
      {x: bottom, y: midright},
      {x: bottom, y: midleft},
      {x: middle, y: left},
      {x: top, y: midleft}
    ];
    const verticesFlipped = [
      {x: top, y: center},
      {x: midtop, y: right},
      {x: midbottom, y: right},
      {x: bottom, y: center},
      {x: midbottom, y: left},
      {x: midtop, y: left},
      {x: top, y: center}
    ];
    const vertices = this.flipped ? verticesFlipped : verticesRegular; 

    push()
    noStroke()
    fill(this.color)
    beginShape()
    for (i = 0; i < vertices.length; i++) {
      const v = vertices[i]
      vertex(v.x, v.y)
    }
    endShape()

    if (DEBUG) {
      noStroke()
      fill('black')
      textSize(10)
      textAlign(CENTER, CENTER)
      text(this.id, this.x, this.y)
    }

    pop()
  }
}

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

const HEX_SIZE = 150
let HEXES_WIDE
let HEXES_HIGH
let POINT_COUNT

const points = []

function setup() {
  createCanvas(windowWidth, windowHeight)

  const colors = [
    color(128, 0, 0),
    color(0, 256, 0),
    color(100, 100, 100),
    color(240, 3, 252)
  ]
  POINT_COUNT = colors.length

  for (i = 0; i < POINT_COUNT; i++) {
    points.push(new Point(random(0, windowWidth), random(0, windowHeight), colors[i]))
  }

}

function draw() {
  HEXES_WIDE = windowWidth / HEX_SIZE / (2/3)
  HEXES_HIGH = windowHeight / HEX_SIZE

  const hexes = []

  for (y = 0; y <= HEXES_HIGH; y++) {
    hexes[y] = []
    for (x = 0; x <= HEXES_WIDE; x++) {
      const flipped = true
      const verticalOffset = (x % 2) * (HEX_SIZE / 2)
      const h = new Hex(x * HEX_SIZE * (sqrt(3) / 2), y * HEX_SIZE + verticalOffset, HEX_SIZE, flipped)
      hexes[y].push(h)
    }
  }

  background('black')

  for (i = 0; i < POINT_COUNT ; i++) {
    const p = points[i]
    p.move()
  }

  for (y = 0; y <= HEXES_HIGH; y++) {
    for (x = 0; x <= HEXES_WIDE; x++) {
      const h = hexes[y][x]
      h.draw(points)
    }
  }

  if (DEBUG) {
    for (i = 0; i < POINT_COUNT ; i++) {
      const p = points[i]
      p.draw()
    }
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
    const fs = fullscreen()
    fullscreen(!fs)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
