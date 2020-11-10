const canvasSketch = require('canvas-sketch');
const { pick } = require('canvas-sketch-util/random');
const p5 = require('p5');

let p1Turn = true;
let thinking = false;
let resetting = false;

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const winSlashes = (index) => [
  [-160, 100, 160, 100],
  [-160, 0, 160, 0],
  [-160, -100, 160, -100],
  [100, 160, 100, -160],
  [0, 160, 0, -160],
  [-100, 160, -100, -160],
  [-160, -160, 160, 160],
  [-160, 160, 160, -160],
][index];

const centers = [
  [100, 100],
  [0, 100],
  [-100, 100],
  [100, 0],
  [0, 0],
  [-100, 0],
  [100, -100],
  [0, -100],
  [-100, -100],
];

let played = [];

const drawBoard = (p5, width, height) => {
  const centerX = width / 2;
  const centerY = height / 2;
  p5.strokeWeight(4);
  p5.line(centerX - 150, centerY - 50, centerX + 150, centerY - 50);
  p5.line(centerX - 150, centerY + 50, centerX + 150, centerY + 50);
  p5.line(centerX - 50, centerY - 150, centerX - 50, centerY + 150);
  p5.line(centerX + 50, centerY + 150, centerX + 50, centerY - 150);
};

const reset = (p5) => {
  p5.background(255);
  played = [];
};

const move = () => pick(
  [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
    (place) => !played.some((prev) => prev.place === place),
  ),
);

const drawX = (p5, place) => {
  p5.text('X', ...centers[place]);
};

const drawO = (p5, place) => {
  p5.text('O', ...centers[place]);
};

const happy = '😁';
const sad = '😟';
const thinker = '🤔';
const grimace = '😬';
const tied = '🤯';

const drawP1 = (p5, face) => {
  p5.text(face, -75, -200);
};
const drawP2 = (p5, face) => {
  p5.text(face, 70, -200);
};

const checkWinner = (p5, type) => {
  const places = played.reduce(
    (ps, p) => (p.type === type ? ps.concat(p.place) : ps),
    [],
  );

  let index = -1;
  const isWinner = wins.find((win, i) => {
    const winner = win.every((w) => places.includes(w));
    index = i;
    return winner;
  });
  if (isWinner) {
    p5.push();
    p5.translate(16, -16);
    p5.stroke('red');
    p5.line(...winSlashes(index));
    p5.pop();
  }
  return !!isWinner;
};

canvasSketch(
  ({ p5, width, height }) => {
    p5.textSize(48);

    return () => {
      drawBoard(p5, width, height);
      p5.translate(width / 2 - 18, height / 2 + 18);

      if (resetting) {
        return;
      }

      if (checkWinner(p5, 'X')) {
        resetting = true;
        drawP1(p5, happy);
        drawP2(p5, sad);
        setTimeout(() => {
          reset(p5);
          resetting = false;
        }, 2000);
        return;
      }

      if (checkWinner(p5, 'O')) {
        resetting = true;
        drawP1(p5, sad);
        drawP2(p5, happy);
        setTimeout(() => {
          reset(p5);
          resetting = false;
        }, 2000);
        return;
      }

      if (played.length === 9) {
        resetting = true;
        drawP1(p5, tied);
        drawP2(p5, tied);
        setTimeout(() => {
          reset(p5);
          resetting = false;
        }, 2000);
        return;
      }

      if (!thinking) {
        thinking = true;

        drawP1(p5, p1Turn ? thinker : grimace);
        drawP2(p5, p1Turn ? grimace : thinker);

        setTimeout(() => {
          const place = move();

          if (p1Turn) {
            drawX(p5, place);
            played.push({ place, type: 'X' });
          } else {
            drawO(p5, place);
            played.push({ place, type: 'O' });
          }

          thinking = false;
          p1Turn = !p1Turn;
        }, 1000);
      }
    };
  },
  { p5: { p5 }, animate: true },
);
