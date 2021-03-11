let myp5 = new p5((sketch) => {
  sketch.DEBUG = false;

  const firstHexColor = new FColor(0, 10, 0);
  const firstConfig = new Config(sketch, {
    aperture: 1 / 5,
    background: "black",
    blender: new FractionalBlender(firstHexColor),
    colors: [
      new FColor(128, 0, 0),
      new FColor(0, 256, 0),
      new FColor(100, 100, 100),
      new FColor(240, 3, 252),
      new FColor(240, 3, 252),
      new FColor(240, 3, 252),
    ],
    feather: 2 / 9,
    hexSize: 50,
    pointFactory: new PointFactory(
      sketch,
      new MarginWrappingPointMover(sketch)
    ),
    pointSpreadFactors: { x: 1, y: 1 },
  });

  const bounceConfig = new Config(sketch, {
    aperture: 2 / 20,
    background: new FColor(0, 0, 0),
    colors: [
      new FColor(60, 237, 57),
      new FColor(240, 3, 252),
      new FColor(255, 94, 0),
      new FColor(7, 60, 235),
    ],
    feather: 3 / 9,
    hexColor: new FColor(5, 5, 5),
    hexSize: 80,
    pointFactory: new PointFactory(sketch, new BouncingPointMover(sketch)),
    pointSpreadFactors: { x: 1, y: 1 },
  });

  const blueConfig = new Config(sketch, {
    background: new FColor(0, 0, 0),
    blender: new AdditiveBlender(),
    colorListMultiplier: 3,
    colors: [
      new FColor(115, 221, 2240),
      new FColor(5, 99, 166),
      new FColor(2, 74, 242),
      new FColor(48, 33, 209),
    ],
    hexSize: 120,
    aperture: 0.05,
    feather: 2,
    pointSpreadFactors: { x: 2, y: 2 },
    pointFactory: new PointFactory(
      sketch,
      new MarginWrappingPointMover(sketch)
    ),
  });

  const modConfig = new Config(sketch, {
    background: new FColor(0, 0, 0),
    blender: new ModuloBlender(),
    colors: [
      new FColor(255, 0, 0),
      new FColor(0, 255, 0),
      new FColor(0, 0, 255),
      new FColor(255, 255, 0),
      new FColor(255, 0, 255),
      new FColor(0, 255, 255),
    ],
    hexSize: 150,
    aperture: 0.1,
    feather: 1,
  });

  const grayBaseColor = new FColor(0, 0, 0);
  const grayBiasColor = new FColor(128, 50, 0);
  const grayConfig = new Config(sketch, {
    background: new FColor(0, 0, 0),
    blender: new BiasedAdditiveBlender(grayBaseColor, grayBiasColor),
    pointFactory: new PointFactory(
      sketch,
      new MarginWrappingPointMover(sketch)
    ),
    colors: [
      new FColor(255, 255, 255),
      new FColor(255, 255, 255),
      new FColor(255, 255, 255),
      new FColor(255, 255, 255),
    ],
    hexSize: 150,
    aperture: 0.1,
    feather: 1,
  });

  const wrapConfig = new Config(sketch, {
    background: new FColor(0, 0, 0),
    pointFactory: new PointFactory(sketch, new WrappingPointMover(sketch)),
    colors: [new FColor(20, 128, 255)],
    hexSize: 50,
    aperture: 0.01,
    feather: 1,
  });

  const config = bounceConfig;

  let points = [];
  let hexes = [];
  let colors;

  let hexCountX;
  let hexCountY;

  let lastWindowWidth;
  let lastWindowHeight;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    lastWindowWidth = sketch.windowWidth;
    lastWindowHeight = sketch.windowHeight;

    const initialSpreadX =
      (config.pointSpreadFactors.x * sketch.windowWidth) / 2;
    const initialSpreadY =
      (config.pointSpreadFactors.y * sketch.windowHeight) / 2;
    points = [];
    for (i = 0; i < config.colors.length; i++) {
      points.push(
        config.pointFactory.build(
          initialSpreadX + sketch.random(-initialSpreadX, initialSpreadX),
          initialSpreadY + sketch.random(-initialSpreadY, initialSpreadY),
          config.colors[i]
        )
      );
    }

    resizeHexes();
  };

  sketch.draw = () => {
    sketch.background(config.background);

    for (y = 0; y <= hexCountY; y++) {
      for (x = 0; x <= hexCountX; x++) {
        const h = hexes[y][x];
        h.draw(points);
      }
    }

    for (i = 0; i < points.length; i++) {
      const p = points[i];
      p.draw();
      p.move();
    }

    if (sketch.DEBUG) {
      sketch.push();
      sketch.noStroke();
      sketch.fill("lightgray");
      sketch.textSize(20);
      sketch.textAlign(LEFT, CENTER);
      sketch.text(Math.round(sketch.frameRate() * 10) / 10, 10, 10);
      sketch.pop();
    }
  };

  sketch.mousePressed = () => {
    if (
      sketch.mouseX > 0 &&
      sketch.mouseX < sketch.windowWidth &&
      sketch.mouseY > 0 &&
      sketch.mouseY < sketch.windowHeight
    ) {
      const fs = sketch.fullscreen();
      sketch.fullscreen(!fs);
    }
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    resizeHexes();
    resizePoints();
    lastWindowWidth = sketch.windowWidth;
    lastWindowHeight = sketch.windowHeight;
  };

  function resizeHexes() {
    hexCountX = sketch.windowWidth / config.hexSize / (2 / 3);
    hexCountY = sketch.windowHeight / config.hexSize + 1;

    hexes = [];
    for (y = 0; y <= hexCountY; y++) {
      hexes[y] = [];
      for (x = 0; x <= hexCountX; x++) {
        const verticalOffset = (x % 2) * (config.hexSize / 2);
        const h = new Hex(
          sketch,
          x * config.hexSize * (Math.sqrt(3) / 2),
          y * config.hexSize + verticalOffset,
          config.hexSize,
          config.blender,
          // TODO too many args!
          config.aperture,
          config.feather
        );
        hexes[y].push(h);
      }
    }
  }

  function resizePoints() {
    for (i = 0; i < points.length; i++) {
      const existing = points[i];
      points[i].reposition(lastWindowWidth, lastWindowHeight);
    }
  }
});
