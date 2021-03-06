const DEBUG = false

function colorFalloff(coloredPoint, referencePoint) {
  const feather = 0.1 // higher = fuzzier (undefined at 0)
  const aperture = 1/5 // higher = wider

  const maxDist = pow(min(windowWidth, windowHeight) * aperture, 1 / feather)
  const newRed = map(
    pow(dist(referencePoint.x, referencePoint.y, coloredPoint.x, coloredPoint.y), 1 / feather),
    0,
    maxDist,
    red(coloredPoint.color),
    0
  )
  const newGreen = map(
    pow(dist(referencePoint.x, referencePoint.y, coloredPoint.x, coloredPoint.y), 1 / feather),
    0,
    maxDist,
    green(coloredPoint.color),
    0
  )
  const newBlue = map(
    pow(dist(referencePoint.x, referencePoint.y, coloredPoint.x, coloredPoint.y), 1 / feather),
    0,
    maxDist,
    blue(coloredPoint.color),
    0
  )
  return color(newRed, newGreen, newBlue)
}

let POINT_COUNT
const points = []

function setup() {
  createCanvas(windowWidth, windowHeight)

  const colors = [
    color(128, 0, 0),
    color(0, 256, 0),
    color(100, 100, 100),
    color(240, 3, 252),
    color(240, 3, 252),
    color(240, 3, 252)
  ]
  POINT_COUNT = colors.length

  for (i = 0; i < POINT_COUNT; i++) {
    points.push(new Point(random(0, windowWidth), random(0, windowHeight), colors[i]))
  }

}

function draw() {
  const hexSize = 50
  const hexCountX = windowWidth / hexSize / (2/3)
  const hexCountY = windowHeight / hexSize

  const hexes = []

  for (y = 0; y <= hexCountY; y++) {
    hexes[y] = []
    for (x = 0; x <= hexCountX; x++) {
      const flipped = true
      const verticalOffset = (x % 2) * (hexSize / 2)
      const h = new Hex(x * hexSize * (sqrt(3) / 2), y * hexSize + verticalOffset, hexSize, flipped)
      hexes[y].push(h)
    }
  }

  background('black')

  for (y = 0; y <= hexCountY; y++) {
    for (x = 0; x <= hexCountX; x++) {
      const h = hexes[y][x]
      h.draw(points)
    }
  }

  for (i = 0; i < POINT_COUNT ; i++) {
    const p = points[i]
    p.draw()
    p.move()
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
