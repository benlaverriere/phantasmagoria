// If we're doing everything in RGB, we don't need all the fancy features of p5's Color
// (and in particular we don't need the cost of parsing red() / green() / blue() every
// time we want to extract a component!) If this is *still* slow, we could also just use
// a raw array with indices.
class FColor {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
  
  toString() {
    return `(${this.r}, ${this.g}, ${this.b})`
  }

  p5() {
    return color(this.r, this.g, this.b)
  }
}
