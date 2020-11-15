/* eslint-disable no-param-reassign,no-shadow */
const canvasSketch = require('canvas-sketch');
const { pick } = require('canvas-sketch-util/random');
const p5 = require('p5');
const { scaleSequential } = require('d3-scale');
const { interpolateRainbow } = require('d3-scale-chromatic');

const color = scaleSequential(interpolateRainbow).domain([0, 1000]);

const createBall = (width, height) => ({
  radius: 10,
  x: width / 2,
  y: height / 2,
  velX: 6 * pick([-1, 1]),
  velY: 6 * pick([-1, 1]),
});

const update = (ball, width, height) => {
  // bottom bound / floor
  if (ball.y + ball.radius >= height) {
    ball.velY *= -1;
    ball.y = height - ball.radius;
  }

  // top bound / ceiling
  if (ball.y - ball.radius <= 0) {
    ball.velY *= -1;
    ball.y = ball.radius;
  }

  // left bound
  if (ball.x - ball.radius <= 0) {
    ball.velX *= -1;
    ball.x = ball.radius;
  }

  // right bound
  if (ball.x + ball.radius >= width) {
    ball.velX *= -1;
    ball.x = width - ball.radius;
  }

  ball.velY += 0.05;

  ball.x += ball.velX;
  ball.y += ball.velY;
};

canvasSketch(
  ({ p5, width, height }) => {
    p5.background(0);

    const size = Math.min(width, height);

    p5.translate(width / 2 - size / 2, height / 2 - size / 2);
    p5.stroke(255);
    p5.rect(0, 0, size, size);
    p5.stroke(0);

    const ball = createBall(size, size);

    return ({ time }) => {
      p5.translate(width / 2 - size / 2, height / 2 - size / 2);
      update(ball, size, size);

      p5.fill(color(time * 64));
      p5.circle(ball.x, ball.y, ball.radius * 2);
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
