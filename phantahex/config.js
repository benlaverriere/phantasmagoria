const BlendMode = {
  ADD: 0,
  MODULO: 1,
  FRACTIONAL: 2,
  BIASED_ADD: 3,
};

const MovementMode = {
  HARD_WALLS: 0,
  WRAP: 1,
  WRAP_WITH_MARGIN: 2,
};

// because we'll be passing this value to p5's background(), it needs to be a p5 Color
function parseBackground(incoming) {
  if (incoming instanceof FColor) {
    return incoming.p5();
  } else {
    const p = new p5(); // triggering "global mode" so we can use color()
    const result = color(incoming);
    delete p;
    return result;
  }
}

class Config {
  constructor({
    aperture,
    background,
    biasColor,
    blender,
    colorListMultiplier,
    colors,
    feather,
    hexColor,
    hexSize,
    movementMode,
    pointSpreadFactors,
  }) {
    this.aperture = aperture ?? 0.5; // higher = wider

    this.background = parseBackground(background ?? new FColor(0, 0, 0));
    this.hexColor = hexColor ?? new FColor(0, 0, 0);

    this.biasColor = biasColor ?? new FColor(0, 0, 0);
    this.blender = blender ?? new AdditiveBlender(this.hexColor);

    this.colorListMultiplier = colorListMultiplier ?? 1;
    this.colors = [];
    for (let i = 0; i < this.colorListMultiplier; i++) {
      this.colors = this.colors.concat(colors ?? []);
    }

    this.feather = feather ?? 0.1; // higher = fuzzier (undefined at 0)

    // TODO when hexes get large, wrapping gets jerky
    this.hexSize = hexSize ?? 100;

    this.movementMode = movementMode ?? MovementMode.HARD_WALLS;
    this.pointSpreadFactors = pointSpreadFactors ?? { x: 1, y: 1 };
  }
}
