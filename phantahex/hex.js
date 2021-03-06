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
