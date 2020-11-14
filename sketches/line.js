const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

let xoff = 0.0;
const xincrement = 0.002;

let yoff = 0.0;
const yincrement = 0.003;

const colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'];

const drawLine = (p5, width, height, color, index) => {
  const x = p5.noise(xoff + index) * width;
  const y = p5.noise(yoff + index) * height;
  p5.fill(color);
  p5.circle(x, y, 3);
};

canvasSketch(
  ({ p5, width, height }) => {
    p5.background(0);
    p5.noStroke();
    p5.drawingContext.globalAlpha = 0.25;

    return () => {
      colors.forEach((color, index) => {
        drawLine(p5, width, height, color, index);
      });

      xoff += xincrement;
      yoff += yincrement;
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
