const canvasSketch = require('canvas-sketch');
const { pick, rangeFloor, shuffle } = require('canvas-sketch-util/random');
const p5 = require('p5');

const colors = shuffle([
  'black',
  'blue',
  'brown',
  'cyan',
  'fuchsia',
  'gold',
  'green',
  'grey',
  'lime',
  'magenta',
  'maroon',
  'olive',
  'orange',
  'pink',
  'purple',
  'red',
  'tan',
  'teal',
  'turquoise',
  'violet',
  'yellow',
]);

const getCoords = (width, height) => {
  const range = Math.min(width, height) / 2 - 80;
  return [
    rangeFloor(width / 2 - range, width / 2 + range),
    rangeFloor(height / 2 - range, height / 2 + range),
  ];
};

canvasSketch(
  ({ p5, width, height }) => {
    p5.fill(colors[0]);
    p5.stroke('black');
    p5.strokeWeight(2);
    p5.textAlign(p5.CENTER);
    p5.textSize(64);
    p5.textStyle(p5.BOLD);

    const position = {
      time: 0,
      coords: getCoords(width, height),
    };

    return ({ time }) => {
      const floorTime = Math.floor(time);
      const color = colors[floorTime % colors.length];

      if (position.time !== floorTime) {
        position.time = floorTime;
        position.coords = getCoords(width, height);

        if (time > 4 && Math.random() < 0.25) {
          p5.fill(pick(colors));
        } else {
          p5.fill(color);
        }
      }

      p5.clear();
      p5.background('#EEE');

      p5.text(color, position.coords[0], position.coords[1]);
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
