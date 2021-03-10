class BiasedAdditiveBlender {
  constructor(config) {
    this.config = config;
  }

  blend(colors) {
    let { r: newRed, g: newGreen, b: newBlue } = this.config.hexColor;
    for (i = 0; i < colors.length; i++) {
      const newColor = colors[i];
      newRed += newColor.r + this.config.biasColor.r * (newColor.r / 256);
      newGreen += newColor.g + this.config.biasColor.g * (newColor.g / 256);
      newBlue += newColor.b + this.config.biasColor.b * (newColor.b / 256);
    }
    return new FColor(newRed, newGreen, newBlue);
  }
}
