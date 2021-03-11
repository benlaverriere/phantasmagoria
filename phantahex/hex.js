class Hex {
  constructor(sketch, x, y, size, blender, aperture, feather) {
    this.sketch = sketch;
    this.debugMode = "color";
    this.aperture = aperture;
    this.feather = feather;

    this.x = x;
    this.y = y;
    this.radius = size / 2;
    this.blender = blender;
    if (this.blender === null || this.blender === undefined) {
      console.error(`No blender specified for hex at (${this.x}, ${this.y})`);
    }

    this.color = this.blender.baseColor;
    this.id = `(${Math.round(this.x)},${Math.round(this.y)})`;

    const heightFactor = 1;
    const widthFactor = Math.sqrt(3) / 2;

    this.top = this.x + this.radius * heightFactor;
    this.midtop = this.x + this.radius / 2;
    this.midbottom = this.x - this.radius / 2;
    this.bottom = this.x - this.radius * heightFactor;

    this.left = this.y - this.radius * widthFactor;
    this.center = this.y;
    this.right = this.y + this.radius * widthFactor;

    this.vertices = [
      { x: this.top, y: this.center },
      { x: this.midtop, y: this.right },
      { x: this.midbottom, y: this.right },
      { x: this.bottom, y: this.center },
      { x: this.midbottom, y: this.left },
      { x: this.midtop, y: this.left },
      { x: this.top, y: this.center },
    ];
  }

  draw(points) {
    const colors = [];
    for (i = 0; i < points.length; i++) {
      const c = this.colorFalloff(points[i], this);
      colors.push(c);
    }
    this.color = this.blender.blend(colors);

    if (!(this.sketch.DEBUG && this.debugMode === "invisible")) {
      this.sketch.push();
      this.sketch.noStroke();
      this.sketch.fill(this.color.p5(this.sketch));
      this.sketch.beginShape();
      for (i = 0; i < this.vertices.length; i++) {
        const v = this.vertices[i];
        this.sketch.vertex(v.x, v.y);
      }
      this.sketch.endShape();
      this.sketch.pop();
    }

    if (this.sketch.DEBUG) {
      this.sketch.push();
      if (this.debugMode === "position") {
        this.sketch.noStroke();
        this.sketch.fill("black");
        this.sketch.textSize(10);
        this.sketch.textAlign(CENTER, CENTER);
        this.sketch.text(this.id, this.x, this.y);
      } else if (this.debugMode === "color") {
        this.sketch.noStroke();
        this.sketch.fill("lightgray");
        this.sketch.textSize(10);
        this.sketch.textAlign(CENTER, CENTER);
        this.sketch.text(this.color.toString(), this.x, this.y);
      }
      this.sketch.pop();
    }
  }

  mapRGBToBackground(value, currentMinimum, currentMaximum, startColor) {
    const newRed = this.sketch.map(
      value,
      currentMinimum,
      currentMaximum,
      startColor.r,
      this.blender.baseColor.r
    );
    const newGreen = this.sketch.map(
      value,
      currentMinimum,
      currentMaximum,
      startColor.g,
      this.blender.baseColor.g
    );
    const newBlue = this.sketch.map(
      value,
      currentMinimum,
      currentMaximum,
      startColor.b,
      this.blender.baseColor.b
    );

    return new FColor(newRed, newGreen, newBlue);
  }

  // TODO feels like the Point should own `feather`, not the hex
  colorFalloff(coloredPoint, referencePoint) {
    const aperturePower = 1 / (this.feather * 2); // aka (feather * 2)th root of squared distance

    // the farthest any hex can be from any point is to be in diagonally-opposed corners
    const maxDistance = Math.pow(
      (this.sketch.windowWidth * this.sketch.windowWidth +
        this.sketch.windowHeight * this.sketch.windowHeight) *
        this.aperture,
      aperturePower
    );

    const xdist = coloredPoint.x - referencePoint.x;
    const ydist = coloredPoint.y - referencePoint.y;
    // without clamping to maxDistance, this can easily go to Infinity...or at least it doesn't look as pretty
    const actualDistance = Math.min(
      maxDistance,
      Math.pow(xdist * xdist + ydist * ydist, aperturePower)
    );

    return this.mapRGBToBackground(
      actualDistance,
      0,
      maxDistance,
      coloredPoint.color
    );
  }
}
