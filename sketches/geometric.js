/* eslint-disable no-shadow, no-restricted-properties */
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const size = 3600;

const drawTriangle = (p5, x, y, size) => {
  p5.triangle(x, y, x + size, y, x + size / 2, y - size / 1.25);
};

const subdivideTriangle = (p5, x, y, size) => {
  // left
  drawTriangle(p5, x, y, size / 2);
  // right
  drawTriangle(p5, x + size / 2, y, size / 2);
  // top
  drawTriangle(p5, x + size / 4, y - size / 2.5, size / 2);
};

const step = (p5, x, y, size, depth) => {
  if (depth > 12) {
    return;
  }

  p5.push();
  if (depth % 2 === 0) {
    p5.rotate(Math.PI);
    p5.fill('#892cdc');
  } else {
    p5.fill('#52057b');
  }
  p5.scale(1 / Math.pow(2, depth - 1));
  p5.strokeWeight(depth);
  subdivideTriangle(p5, x, y, size);
  p5.pop();

  step(p5, x, y, size, depth + 1);
};

canvasSketch(
  ({ p5, width, height }) => {
    p5.background(0);
    p5.noFill();

    const x = -size / 2;
    const y = size / 3.75;

    p5.stroke('#bc6ff1');

    let scale = 1;
    return () => {
      if (scale > 4) {
        scale = 1;
      }
      p5.background(0);
      p5.translate(width / 2, height / 2);
      p5.scale(scale);
      drawTriangle(p5, x, y, size);
      step(p5, x, y, size, 1);
      scale += 0.005;
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
