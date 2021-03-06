const DEBUG = false

const MIN_RED = 20
const MAX_RED = 128
const MIN_GREEN = 0
const MAX_GREEN = 10
const MIN_BLUE = 0
const MAX_BLUE = 128

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
    const newRed = map(dist(this.x, this.y, points[0].x, points[0].y), 0, CANVAS_WIDTH, MIN_RED, MAX_RED)
    const newGreen = map(dist(this.x, this.y, points[1].x, points[1].y), 0, CANVAS_WIDTH, MIN_GREEN, MAX_GREEN)
    const newBlue = map(dist(this.x, this.y, points[2].x, points[2].y), 0, CANVAS_WIDTH, MIN_BLUE, MAX_BLUE)
    this.color = color(newRed, newGreen, newBlue)

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
  constructor(x, y) {
    this.x = x
    this.y = y
    this.color = color('blue')
    this.radius = 5
  }

  move() {
    const speed = 10
    const xinc = (noise(frameCount * 0.03, 0.720, this.x / 100) * 2 - 1) * speed
    const yinc = (noise(-frameCount * 0.04, 0.135, this.y / 100) * 2 - 1) * speed
    if (DEBUG) {
      console.log(xinc, yinc)
    }

    // this clamping results in synchronized x and/or y values once the points hit an edge
    this.x = max(min(this.x + xinc, CANVAS_WIDTH), 0)
    this.y = max(min(this.y + yinc, CANVAS_HEIGHT), 0)
  }

  draw() {
    push()
    noStroke()
    fill(this.color)
    circle(this.x, this.y, this.radius)
    pop()
  }
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

const POINT_COUNT = 3

const HEX_SIZE = 20
const HEXES_WIDE = CANVAS_WIDTH / HEX_SIZE / (2/3)
const HEXES_HIGH = CANVAS_HEIGHT / HEX_SIZE

const points = []
const hexes = []

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  for (i = 0; i < POINT_COUNT ; i++) {
    points.push(new Point(random(0, CANVAS_WIDTH), random(0, CANVAS_HEIGHT)))
  }

  for (y = 0; y <= HEXES_HIGH; y++) {
    hexes[y] = []
    for (x = 0; x <= HEXES_WIDE; x++) {
      const flipped = true
      const verticalOffset = (x % 2) * (HEX_SIZE / 2)
      const h = new Hex(x * HEX_SIZE * (sqrt(3) / 2), y * HEX_SIZE + verticalOffset, HEX_SIZE, flipped)
      hexes[y].push(h)
    }
  }
}

function draw() {
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
