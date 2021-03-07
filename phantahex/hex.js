const HEX_DEBUG_MODE = "none"

function mapRGBToBlack(value, currentMinimum, currentMaximum, startColor) {
  const newRed = map(value, currentMinimum, currentMaximum, startColor.r, 0)
  const newGreen = map(value, currentMinimum, currentMaximum, startColor.g, 0)
  const newBlue = map(value, currentMinimum, currentMaximum, startColor.b, 0)

  return new FColor(newRed, newGreen, newBlue)
}

function colorFalloff(coloredPoint, referencePoint) {
  const feather = 4/9 // higher = fuzzier (undefined at 0)
  const aperture = 2/5 // higher = wider

  // the farthest any hex can be from any point is to be in diagonally-opposed corners
  const maxDistance = aperture * pow(
    windowWidth * windowWidth + windowHeight * windowHeight,
    feather / 2 // aka (feather * 2)th root of squared distance
  )

  // without clamping to maxDistance, this can easily go to Infinity
  const actualDistance = min(
    maxDistance,
    pow(
      (coloredPoint.x - referencePoint.x) * (coloredPoint.x - referencePoint.x) +
      (coloredPoint.y - referencePoint.y) * (coloredPoint.y - referencePoint.y),
      feather / 2
    )
  )

  return mapRGBToBlack(actualDistance, 0, maxDistance, coloredPoint.color)
}

function blendRGBs(startingColors) {
  // not using it for the moment, but here's an opportunity to munge the list of colors
  // which contribute to the final resulting color
  const colors = startingColors
  // const threshold = -1
  // for (i = 0; i < startingColors.length; i++) {
  //   const c = startingColors[i]
  //   if (red(c) > threshold || green(c) > threshold || blue(c) > threshold) {
  //     colors.push(c)
  //   }
  // }

  let result = new FColor(0, 0, 0)
  for (i = 0; i < colors.length; i++) {
    const newColor = colors[i]
    const newRed = result.r + newColor.r / colors.length
    const newGreen = result.g + newColor.g / colors.length
    const newBlue = result.b + newColor.b / colors.length
    result = new FColor(newRed, newGreen, newBlue)
  }
  return result
}

class Hex {
  constructor(x, y, size, flipped) {
    this.x = x
    this.y = y
    this.flipped = flipped
    this.radius = size / 2

    this.color = new FColor(0, 0, 0)
    this.id = `(${round(this.x)},${round(this.y)})`

    const heightFactor = 1
    const widthFactor = sqrt(3) / 2

    this.top = this.x + this.radius * heightFactor
    this.midtop = this.x + this.radius / 2
    this.midbottom = this.x - this.radius / 2
    this.bottom = this.x - this.radius * heightFactor

    this.left = this.y - this.radius * widthFactor
    this.center = this.y;
    this.right = this.y + this.radius * widthFactor

    this.vertices = [
      {x: this.top, y: this.center},
      {x: this.midtop, y: this.right},
      {x: this.midbottom, y: this.right},
      {x: this.bottom, y: this.center},
      {x: this.midbottom, y: this.left},
      {x: this.midtop, y: this.left},
      {x: this.top, y: this.center}
    ];
  }

  draw(points) {
    this.color = new FColor(0, 0, 0)
    const colors = []
    for (i = 0; i < points.length; i++) {
      const c = colorFalloff(points[i], this)
      colors.push(c)
    }
    this.color = blendRGBs(colors)

    if (!(DEBUG && HEX_DEBUG_MODE === "invisible")) {
      push()
      noStroke()
      fill(this.color.p5())
      beginShape()
      for (i = 0; i < this.vertices.length; i++) {
        const v = this.vertices[i]
        vertex(v.x, v.y)
      }
      endShape()
      pop()
    }

    if (DEBUG) {
      push()
      if (HEX_DEBUG_MODE === "position") {
        noStroke()
        fill('black')
        textSize(10)
        textAlign(CENTER, CENTER)
        text(this.id, this.x, this.y)
      } else if (HEX_DEBUG_MODE === "color") {
        noStroke()
        fill('lightgray')
        textSize(10)
        textAlign(CENTER, CENTER)
        text(this.color.toString(), this.x, this.y)
      }
      pop()
    }
  }
}
