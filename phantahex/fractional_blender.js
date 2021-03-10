class FractionalBlender {
  constructor(baseColor) {
    this.baseColor = baseColor ?? new FColor(0, 0, 0);
  }

  blend(colors) {
    let { r: newRed, g: newGreen, b: newBlue } = this.baseColor;
    for (i = 0; i < colors.length; i++) {
      // Note: at one point, we were doing
      //   component = (component + new_component) / colors.length
      // which is very different and produces exponentially-dark colors by count.
      // This blender is already one that I don't like the look of much, so...I'm
      // leaving it as-is for now, and we could split it out into separate
      // blenders later.
      newRed = newRed + colors[i].r / colors.length;
      newGreen = newGreen + colors[i].g / colors.length;
      newBlue = newBlue + colors[i].b / colors.length;
    }
    return new FColor(newRed, newGreen, newBlue);
  }
}
