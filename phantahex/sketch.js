const DEBUG = false

let POINT_COUNT
const points = []
let hexes = []
const hexSize = 50
let hexCountX
let hexCountY

function setup() {
  createCanvas(windowWidth, windowHeight)

  const colors = [
    new FColor(128, 0, 0),
    new FColor(0, 256, 0),
    new FColor(100, 100, 100),
    new FColor(240, 3, 252),
    new FColor(240, 3, 252),
    new FColor(240, 3, 252)
  ]
  POINT_COUNT = colors.length

  for (i = 0; i < POINT_COUNT; i++) {
    points.push(new Point(random(0, windowWidth), random(0, windowHeight), colors[i]))
  }

}

function draw() {
  resizeHexes()
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
  resizeCanvas(windowWidth, windowHeight)
  resizeHexes()
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
