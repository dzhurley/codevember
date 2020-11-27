const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const createStar = (p5, x, y, multiplier) => {
  p5.fill(205, 127, 50, 70);
  p5.quad(
    -2.5 * multiplier + x,
    0 + y,
    0 + x,
    2.5 * multiplier + y,
    2.5 * multiplier + x,
    0 + y,
    0 + x,
    -2.5 * multiplier + y,
  );

  p5.fill('gold');
  p5.quad(
    -1 * multiplier + x,
    0 + y,
    0 + x,
    1 * multiplier + y,
    1 * multiplier + x,
    0 + y,
    0 + x,
    -1 * multiplier + y,
  );
};

const createMountain = (p5, x, y, size, color) => {
  p5.fill(p5.lerpColor(p5.color('purple'), p5.color('black'), color));
  p5.push();
  p5.translate(x, y);
  p5.triangle(30 * size, 75 * size, 58 * size, 20 * size, 86 * size, 75 * size);
  p5.pop();
};

canvasSketch(
  ({ p5, width, height }) => {
    p5.noStroke();

    const from = p5.color('black');
    const to = p5.color('darkblue');

    const gradientCount = 10;
    const gradientSize = 30;

    return ({ time }) => {
      for (let i = 0; i < height; i++) {
        const inter = p5.map(i, 0, height, 0, 1);
        p5.stroke(p5.lerpColor(from, to, inter));
        p5.line(0, height - i, width, height - i);
      }

      p5.noStroke();
      p5.translate(width / 2, height / 2);

      for (let i = 0; i < gradientCount; i++) {
        p5.fill(p5.lerpColor(from, to, (1 / gradientCount) * i));
        p5.rect(-175, -175 + gradientSize * i, 350, gradientSize);
      }

      p5.fill(253, 253, 208, 70);
      p5.circle(80, -100, Math.abs(Math.sin(time) * 2) + 90);
      p5.fill(253, 253, 208, 255);
      p5.circle(80, -100, 75);
      p5.fill('lightgrey');
      p5.circle(64, -100, 20);
      p5.circle(76, -118, 14);
      p5.circle(85, -106, 8);

      createStar(p5, -50, -60, Math.abs(Math.sin(time + 0.2)) + 2);
      createStar(p5, -90, -100, Math.abs(Math.sin(time + 0.5)) + 2);
      createStar(p5, -30, -120, Math.abs(Math.sin(time + 0.6)) + 2);
      createStar(p5, -140, -40, Math.abs(Math.sin(time + 0.9)) + 2);
      createStar(p5, -120, -140, Math.abs(Math.sin(time)) + 2);

      createMountain(p5, -262, -99, 3, 0.75);
      createMountain(p5, -40, -62, 2.5, 0.8);
      createMountain(p5, -50, -24, 2, 0.7);
      createMountain(p5, -100, -9, 1.8, 0.6);
      createMountain(p5, -157, 13, 1.5, 0.5);
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
