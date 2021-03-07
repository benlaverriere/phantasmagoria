const DEBUG = false

let points = []
let hexes = []
let colors
const hexSize = 80
let hexCountX
let hexCountY

let lastWindowWidth
let lastWindowHeight

function setup() {
  createCanvas(windowWidth, windowHeight)
  lastWindowWidth = windowWidth
  lastWindowHeight = windowHeight

  colors = [
    new FColor(128, 0, 0),
    new FColor(0, 256, 0),
    new FColor(100, 100, 100),
    new FColor(240, 3, 252),
    new FColor(240, 3, 252),
    new FColor(240, 3, 252)
  ]

  points = []
  for (i = 0; i < colors.length; i++) {
    points.push(new Point(random(-windowWidth, 2 * windowWidth), random(-windowHeight, 2 * windowHeight), colors[i]))
  }

  resizeHexes()
}

function draw() {
  background('black')

  for (y = 0; y <= hexCountY; y++) {
    for (x = 0; x <= hexCountX; x++) {
      const h = hexes[y][x]
      h.draw(points)
    }
  }

  for (i = 0; i < points.length ; i++) {
    const p = points[i]
    p.draw()
    p.move()
  }

  if (DEBUG) {
    push()
    noStroke()
    fill('lightgray')
    textSize(20)
    textAlign(LEFT, CENTER)
    text(round(frameRate(), 1), 10, 10)
    pop()
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
    const fs = fullscreen()
    fullscreen(!fs)
  }
}

function windowResized() {
  console.log("resizing")
  resizeCanvas(windowWidth, windowHeight)
  resizeHexes()
  resizePoints()
  lastWindowWidth = windowWidth
  lastWindowHeight = windowHeight
}

function resizeHexes() {
  hexCountX = windowWidth / hexSize / (2/3)
  hexCountY = windowHeight / hexSize + 1

  hexes = []
  for (y = 0; y <= hexCountY; y++) {
    hexes[y] = []
    for (x = 0; x <= hexCountX; x++) {
      const verticalOffset = (x % 2) * (hexSize / 2)
      const h = new Hex(x * hexSize * (sqrt(3) / 2), y * hexSize + verticalOffset, hexSize)
      hexes[y].push(h)
    }
  }
}

function resizePoints() {
  for (i = 0; i < points.length; i++) {
    const existing = points[i]
    points[i] = new Point(
      existing.x / lastWindowWidth * windowWidth,
      existing.y / lastWindowHeight * windowHeight,
      existing.color
    )
  }
}
