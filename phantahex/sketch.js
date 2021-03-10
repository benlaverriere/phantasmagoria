const DEBUG = false;

const firstHexColor = new FColor(0, 10, 0);
const firstConfig = new Config({
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
  pointFactory: new MarginWrappingPointFactory(),
  pointSpreadFactors: { x: 1, y: 1 },
});

const bounceConfig = new Config({
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
  movementMode: MovementMode.HARD_WALLS,
  pointFactory: new BouncingPointFactory(),
  pointSpreadFactors: { x: 1, y: 1 },
});

const blueConfig = new Config({
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
  pointFactory: new MarginWrappingPointFactory(),
});

const modConfig = new Config({
  background: new FColor(0, 0, 0),
  blender: new ModuloBlender(),
  movementMode: MovementMode.WRAP,
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
const grayConfig = new Config({
  background: new FColor(0, 0, 0),
  blender: new BiasedAdditiveBlender(grayBaseColor, grayBiasColor),
  pointFactory: new MarginWrappingPointFactory(),
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

const wrapConfig = new Config({
  background: new FColor(0, 0, 0),
  movementMode: MovementMode.WRAP,
  pointFactory: new WrappingPointFactory(),
  colors: [new FColor(20, 128, 255)],
  hexSize: 50,
  aperture: 0.01,
  feather: 1,
});

const config = modConfig;

let points = [];
let hexes = [];
let colors;

let hexCountX;
let hexCountY;

let lastWindowWidth;
let lastWindowHeight;

function setup() {
  createCanvas(windowWidth, windowHeight);
  lastWindowWidth = windowWidth;
  lastWindowHeight = windowHeight;

  const initialSpreadX = (config.pointSpreadFactors.x * windowWidth) / 2;
  const initialSpreadY = (config.pointSpreadFactors.y * windowHeight) / 2;
  points = [];
  for (i = 0; i < config.colors.length; i++) {
    points.push(
      config.pointFactory.build(
        initialSpreadX + random(-initialSpreadX, initialSpreadX),
        initialSpreadY + random(-initialSpreadY, initialSpreadY),
        config.colors[i]
      )
    );
  }

  resizeHexes();
}

function draw() {
  background(config.background);

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

  if (DEBUG) {
    push();
    noStroke();
    fill("lightgray");
    textSize(20);
    textAlign(LEFT, CENTER);
    text(round(frameRate(), 1), 10, 10);
    pop();
  }
}

function mousePressed() {
  if (
    mouseX > 0 &&
    mouseX < windowWidth &&
    mouseY > 0 &&
    mouseY < windowHeight
  ) {
    const fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resizeHexes();
  resizePoints();
  lastWindowWidth = windowWidth;
  lastWindowHeight = windowHeight;
}

function resizeHexes() {
  hexCountX = windowWidth / config.hexSize / (2 / 3);
  hexCountY = windowHeight / config.hexSize + 1;

  hexes = [];
  for (y = 0; y <= hexCountY; y++) {
    hexes[y] = [];
    for (x = 0; x <= hexCountX; x++) {
      const verticalOffset = (x % 2) * (config.hexSize / 2);
      const h = new Hex(
        x * config.hexSize * (sqrt(3) / 2),
        y * config.hexSize + verticalOffset,
        config.hexSize,
        config.blender
      );
      hexes[y].push(h);
    }
  }
}

function resizePoints() {
  for (i = 0; i < points.length; i++) {
    const existing = points[i];
    points[i] = config.pointFactory.build(
      (existing.x / lastWindowWidth) * windowWidth,
      (existing.y / lastWindowHeight) * windowHeight,
      existing.color
    );
  }
}
