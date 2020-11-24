const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const getMilliseconds = require('date-fns/getMilliseconds');
const getSeconds = require('date-fns/getSeconds');
const getMinutes = require('date-fns/getMinutes');
const getHours = require('date-fns/getHours');
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getQuarter = require('date-fns/getQuarter');
const getYear = require('date-fns/getYear');

canvasSketch(
  ({ p5, width, height }) => {
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textFont('monospace');
    p5.textSize(16);

    return () => {
      p5.background(20);
      const now = new Date();
      const text = `
millisecond ${getMilliseconds(now)}
second ${getSeconds(now)}
minute ${getMinutes(now)}
hour ${getHours(now)}
day ${getDate(now)}
month ${getMonth(now) + 1}
quarter ${getQuarter(now)}
year ${getYear(now) - 2000}
decade ${(getYear(now) - 2000) / 10}
century ${(getYear(now) - (getYear(now) - 2000)) / 100 + 1}
millenia ${(getYear(now) - (getYear(now) - 2000)) / 1000 + 1}
`;
      p5.translate(width / 2, height / 2);
      p5.fill('lime');
      p5.noStroke();
      p5.text(text, 0, 0);

      p5.noFill();
      p5.stroke('lime');

      p5.rect(-95, -130, 190, 10);
      p5.line(-90, -120, 90, -120);

      p5.bezier(-90, -120, -90, -20, -55, -50, -55, 0);
      p5.bezier(-55, 0, -55, 50, -90, 20, -90, 120);

      p5.bezier(90, -120, 90, -20, 55, -50, 55, 0);
      p5.bezier(55, 0, 55, 50, 90, 20, 90, 120);

      p5.line(-90, 120, 90, 120);
      p5.rect(-95, 120, 190, 10);
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
