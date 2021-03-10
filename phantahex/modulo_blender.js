class ModuloBlender {
  constructor(config) {
    this.config = config;
  }

  blend(colors) {
    let { r: newRed, g: newGreen, b: newBlue } = this.config.hexColor;
    for (i = 0; i < colors.length; i++) {
      newRed += colors[i].r;
      newGreen += colors[i].g;
      newBlue += colors[i].b;
    }
    return new FColor(newRed % 256, newGreen % 256, newBlue % 256);
  }
}
