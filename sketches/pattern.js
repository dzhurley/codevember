const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const { pick, rangeFloor } = require('canvas-sketch-util/random');
const randomColor = require('randomcolor');

const generateSquare = (p5, x, y, width, height) => {
  p5.fill(randomColor({ luminosity: 'light' }));
  p5.rect(x, y, width, height);
  p5.fill(randomColor({ luminosity: 'light' }));
  pick([
    () => p5.circle(x + width / 2, y + height / 2, width),
    () => p5.triangle(x, y, x, y + height, x + width, y + height),
    () => p5.triangle(x, y + height, x + width, y + height, x + width, y),
  ])();
};

const generate = (p5, width, height) => {
  p5.background('lightgrey');
  const size = Math.min(width, height);
  const squareSize = rangeFloor(size / 12, size / 20);
  const steps = Math.floor(size / squareSize);

  p5.translate(
    width / 2 - (steps * squareSize) / 2,
    height / 2 - (steps * squareSize) / 2,
  );
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      generateSquare(p5, squareSize * i, squareSize * j, squareSize, squareSize);
    }
  }
};

canvasSketch(
  ({ p5, width, height }) => {
    p5.noStroke();
    let animating = false;
    return () => {
      if (!animating) {
        generate(p5, width, height);
        animating = true;
        setTimeout(() => {
          animating = false;
        }, 3000);
      }
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
