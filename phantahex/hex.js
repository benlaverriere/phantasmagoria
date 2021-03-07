const HEX_DEBUG_MODE = "none";

function mapRGBToBackground(value, currentMinimum, currentMaximum, startColor) {
  const newRed = map(
    value,
    currentMinimum,
    currentMaximum,
    startColor.r,
    config.hexColor.r
  );
  const newGreen = map(
    value,
    currentMinimum,
    currentMaximum,
    startColor.g,
    config.hexColor.g
  );
  const newBlue = map(
    value,
    currentMinimum,
    currentMaximum,
    startColor.b,
    config.hexColor.b
  );

  return new FColor(newRed, newGreen, newBlue);
}

function colorFalloff(coloredPoint, referencePoint) {
  const aperturePower = 1 / (config.feather * 2); // aka (feather * 2)th root of squared distance

  // the farthest any hex can be from any point is to be in diagonally-opposed corners
  const maxDistance = pow(
    (windowWidth * windowWidth + windowHeight * windowHeight) * config.aperture,
    aperturePower
  );

  const xdist = coloredPoint.x - referencePoint.x;
  const ydist = coloredPoint.y - referencePoint.y;
  // without clamping to maxDistance, this can easily go to Infinity...or at least it doesn't look as pretty
  const actualDistance = min(
    maxDistance,
    pow(xdist * xdist + ydist * ydist, aperturePower)
  );

  return mapRGBToBackground(actualDistance, 0, maxDistance, coloredPoint.color);
}

function blendRGBs(startingColors) {
  // not using it for the moment, but here's an opportunity to munge the list of colors
  // which contribute to the final resulting color
  const colors = startingColors;
  // const threshold = -1
  // for (i = 0; i < startingColors.length; i++) {
  //   const c = startingColors[i]
  //   if (red(c) > threshold || green(c) > threshold || blue(c) > threshold) {
  //     colors.push(c)
  //   }
  // }

  let result = config.hexColor;
  for (i = 0; i < colors.length; i++) {
    const newColor = colors[i];
    let newRed, newGreen, newBlue;

    switch (config.blendMode) {
      case BlendMode.MODULO: {
        newRed = (result.r + newColor.r) % 256;
        newGreen = (result.g + newColor.g) % 256;
        newBlue = (result.b + newColor.b) % 256;
        break;
      }
      case BlendMode.FRACTIONAL: {
        newRed = (result.r + newColor.r) / colors.length;
        newGreen = (result.g + newColor.g) / colors.length;
        newBlue = (result.b + newColor.b) / colors.length;
        break;
      }
      case BlendMode.BIASED_ADD: {
        newRed =
          result.r + newColor.r + config.biasColor.r * (newColor.r / 256);
        newGreen =
          result.g + newColor.g + config.biasColor.g * (newColor.g / 256);
        newBlue =
          result.b + newColor.b + config.biasColor.b * (newColor.b / 256);
        break;
      }
      case BlendMode.ADD:
      default: {
        newRed = result.r + newColor.r;
        newGreen = result.g + newColor.g;
        newBlue = result.b + newColor.b;
        break;
      }
    }

    result = new FColor(newRed, newGreen, newBlue);
  }
  return result;
}

class Hex {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.radius = size / 2;

    this.color = config.hexColor;
    this.id = `(${round(this.x)},${round(this.y)})`;

    const heightFactor = 1;
    const widthFactor = sqrt(3) / 2;

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
      const c = colorFalloff(points[i], this);
      colors.push(c);
    }
    this.color = blendRGBs(colors);

    if (!(DEBUG && HEX_DEBUG_MODE === "invisible")) {
      push();
      noStroke();
      fill(this.color.p5());
      beginShape();
      for (i = 0; i < this.vertices.length; i++) {
        const v = this.vertices[i];
        vertex(v.x, v.y);
      }
      endShape();
      pop();
    }

    if (DEBUG) {
      push();
      if (HEX_DEBUG_MODE === "position") {
        noStroke();
        fill("black");
        textSize(10);
        textAlign(CENTER, CENTER);
        text(this.id, this.x, this.y);
      } else if (HEX_DEBUG_MODE === "color") {
        noStroke();
        fill("lightgray");
        textSize(10);
        textAlign(CENTER, CENTER);
        text(this.color.toString(), this.x, this.y);
      }
      pop();
    }
  }
}
