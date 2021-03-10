class ModuloBlender {
  constructor(baseColor) {
    this.baseColor = baseColor ?? new FColor(0, 0, 0);
  }

  blend(colors) {
    let { r: newRed, g: newGreen, b: newBlue } = this.baseColor;
    for (i = 0; i < colors.length; i++) {
      newRed += colors[i].r;
      newGreen += colors[i].g;
      newBlue += colors[i].b;
    }
    return new FColor(newRed % 256, newGreen % 256, newBlue % 256);
  }
}
