class BiasedAdditiveBlender {
  constructor(baseColor, biasColor) {
    this.baseColor = baseColor ?? new FColor(0, 0, 0);
    this.biasColor = biasColor ?? new FColor(0, 0, 0);
  }

  blend(colors) {
    let { r: newRed, g: newGreen, b: newBlue } = this.baseColor;
    for (i = 0; i < colors.length; i++) {
      const newColor = colors[i];
      newRed += newColor.r + this.biasColor.r * (newColor.r / 256);
      newGreen += newColor.g + this.biasColor.g * (newColor.g / 256);
      newBlue += newColor.b + this.biasColor.b * (newColor.b / 256);
    }
    return new FColor(newRed, newGreen, newBlue);
  }
}
