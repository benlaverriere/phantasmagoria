class AdditiveBlender {
  constructor(baseColor) {
    this.baseColor = baseColor ?? new FColor(0, 0, 0);
  }

  blend(inputColors) {
    let { r: newRed, g: newGreen, b: newBlue } = this.baseColor;
    for (i = 0; i < inputColors.length; i++) {
      newRed += inputColors[i].r;
      newGreen += inputColors[i].g;
      newBlue += inputColors[i].b;
    }
    return new FColor(newRed, newGreen, newBlue);
  }
}
