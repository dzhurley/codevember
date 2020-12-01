const canvasSketch = require('canvas-sketch');
const { pick } = require('canvas-sketch-util/random');
const p5 = require('p5');
const { interpolateViridis } = require('d3-scale-chromatic');

const limit = 2;

const divide = (p5, x, y, w, h, isHorizontal, sections = [], depth = 0) => {
  if (w < limit || h < limit) {
    return sections;
  }

  const color = p5.color(interpolateViridis(depth / 12));
  sections.push({
    x,
    y,
    w,
    h,
    color,
    depth,
  });

  divide(
    p5,
    x,
    pick([y + h / 2, y]),
    w,
    h / 2,
    !isHorizontal,
    sections,
    depth + 1,
  );
  divide(
    p5,
    pick([x + w / 2, x]),
    y,
    w / 2,
    h,
    !isHorizontal,
    sections,
    depth + 1,
  );

  return sections;
};

canvasSketch(
  ({ p5, width, height }) => {
    const startColor = p5.color(interpolateViridis(0));
    p5.noStroke();
    p5.background(p5.lerpColor(startColor, p5.color('black'), 0.5));

    let switchable = true;
    const size = Math.min(width, height);
    let sections = divide(p5, 0, 0, size, size, Math.random() > 0.5);

    return ({ time }) => {
      if (Math.floor(time) % 2 === 0) {
        if (switchable) {
          sections = divide(p5, 0, 0, size, size, Math.random() > 0.5);
          switchable = false;
        }
      } else {
        switchable = true;
      }
      p5.translate(width / 2 - size / 2, height / 2 - size / 2);
      sections.forEach(({
        x, y, w, h, color, depth,
      }) => {
        p5.fill(p5.lerpColor(startColor, color, depth));
        p5.rect(x, y, w, h);
      });
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
