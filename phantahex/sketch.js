const DEBUG = false

class Hex {
  constructor(x, y, size, flipped) {
    this.x = x
    this.y = y
    this.flipped = flipped
    this.radius = size / 2

    this.color = color(random(128), random(128), random(128))
    this.id = `(${round(this.x)},${round(this.y)})`
  }

  draw() {
    const heightFactor = 1 // sqrt(3) / 2
    const widthFactor = sqrt(3) / 2

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
    this.x += random(-2, 2)
    this.y += random(-2, 2)
  }

  draw() {
    push()
    noFill()
    stroke(this.color)
    circle(this.x, this.y, this.radius)
    pop()
  }
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

const POINT_COUNT = 3

const HEX_SIZE = 40
const HEXES_WIDE = CANVAS_WIDTH / HEX_SIZE / (2/3)
const HEXES_HIGH = CANVAS_HEIGHT / HEX_SIZE

const points = []
const hexes = []

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  for (i = 0; i < POINT_COUNT ; i++) {
    points.push(new Point(200, 200))
  }

  for (y = 0; y <= HEXES_HIGH; y++) {
    hexes[y] = []
    for (x = 0; x <= HEXES_WIDE; x++) {
      const flipped = true //(x % 2) == 1
      const verticalOffset = (x % 2) * (HEX_SIZE / 2)
      hexes[y].push(new Hex(x * HEX_SIZE * (sqrt(3) / 2), y * HEX_SIZE + verticalOffset, HEX_SIZE, flipped))
    }
  }
}

function draw() {
  background('lightgray')

  for (y = 0; y <= HEXES_HIGH; y++) {
    for (x = 0; x <= HEXES_WIDE; x++) {
      const h = hexes[y][x]
      h.draw()
    }
  }

  for (i = 0; i < POINT_COUNT ; i++) {
    const p = points[i]
    p.move()
    p.draw()
  }
}
