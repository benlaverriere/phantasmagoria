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

const HEX_SIZE = 150
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
  const HEXES_WIDE = windowWidth / HEX_SIZE / (2/3)
  const HEXES_HIGH = windowHeight / HEX_SIZE

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
