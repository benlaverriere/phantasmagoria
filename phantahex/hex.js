const HEX_DEBUG_MODE = "color"

function mapRGB(value, currentMinimum, currentMaximum, startColor, endColor) {
  const newRed = map(value, currentMinimum, currentMaximum, red(startColor), red(endColor))
  const newGreen = map(value, currentMinimum, currentMaximum, green(startColor), green(endColor))
  const newBlue = map(value, currentMinimum, currentMaximum, blue(startColor), blue(endColor))

  return color(newRed, newGreen, newBlue)
}

function colorFalloff(coloredPoint, referencePoint) {
  const feather = 0.1 // higher = fuzzier (undefined at 0)
  const aperture = 1/8 // higher = wider

  // the farthest any hex can be from any point is to be in diagonally-opposed corners
  const maxDistance = pow(
    dist(0, 0, windowWidth, windowHeight) * aperture,
    1 / feather
  )

  // without clamping to maxDistance, this can easily go to Infinity
  const actualDistance = min(
    maxDistance,
    pow(dist(referencePoint.x, referencePoint.y, coloredPoint.x, coloredPoint.y), 1 / feather)
  )

  return mapRGB(actualDistance, 0, maxDistance, coloredPoint.color, color('black'))
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

      // TODO we could improve this blending to only incorporate colors with non-zero impact,
      // because currently adding more points dims all of them
      const newRed = red(this.color) + red(c) / points.length
      const newGreen = green(this.color) + green(c) / points.length
      const newBlue = blue(this.color) + blue(c) / points.length

      this.color.setRed(newRed)
      this.color.setGreen(newGreen)
      this.color.setBlue(newBlue)
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
      push()
      if (HEX_DEBUG_MODE == "position" || !HEX_DEBUG_MODE) {
        noStroke()
        fill('black')
        textSize(10)
        textAlign(CENTER, CENTER)
        text(this.id, this.x, this.y)
      } else if (HEX_DEBUG_MODE == "color") {
        noStroke()
        fill('lightgray')
        textSize(10)
        textAlign(CENTER, CENTER)
        text(this.color, this.x, this.y)
      }
      pop()
    }

    pop()
  }
}
