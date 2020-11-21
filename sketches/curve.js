const canvasSketch = require('canvas-sketch');
const { rangeFloor } = require('canvas-sketch-util/random');
const randomColor = require('randomcolor');
const p5 = require('p5');

// tweaked from https://generativeartistry.com/tutorials/joy-division/
const drawLines = (p5, width, height) => {
  p5.background('tan');
  const step = rangeFloor(16, 24);
  const lines = [];

  for (let i = 0; i <= height - step; i += step) {
    const line = [];
    for (let j = 0; j <= width; j += step) {
      const point = { x: j, y: i + Math.random() * rangeFloor(12, 18) };
      line.push(point);
    }
    lines.push(line);
  }

  for (let i = 0; i < lines.length; i++) {
    p5.drawingContext.beginPath();
    p5.drawingContext.moveTo(lines[i][0].x, lines[i][0].y);

    let j = 0;
    for (j = 0; j < lines[i].length - 2; j++) {
      const xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
      const yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
      p5.drawingContext.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
    }

    p5.drawingContext.quadraticCurveTo(
      lines[i][j].x,
      lines[i][j].y,
      lines[i][j + 1].x,
      lines[i][j + 1].y,
    );
    p5.fill(randomColor({ hue: '#00FF00', luminosity: 'dark' }));
    p5.drawingContext.fill();
    p5.drawingContext.stroke();
  }
};

canvasSketch(
  ({ p5, width, height }) => {
    let animating = false;
    return () => {
      if (!animating) {
        drawLines(p5, width, height);
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
