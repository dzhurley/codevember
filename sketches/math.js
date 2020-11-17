const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const TWEEN = require('@tweenjs/tween.js');

const PHI = (1 + Math.sqrt(5)) / 2;

const tweenArc = (p5, from, to, arcArgs, lineArgs) => {
  const arc = { p: from };
  return new TWEEN.Tween(arc)
    .to({ p: to }, 1000)
    .onUpdate(() => {
      p5.arc(...arcArgs, from, arc.p);
    })
    .onComplete(() => {
      p5.line(...lineArgs);
    });
};

canvasSketch(
  ({ p5, width, height }) => {
    let w = width;
    let h = height;

    if (w / h > PHI) {
      w = h * PHI;
    } else if (w / h < PHI) {
      h = w / PHI;
    }

    p5.translate((width - w) / 2, (height - h) / 2);
    p5.background('purple');
    p5.fill('purple');
    p5.strokeWeight(8);
    p5.stroke('gold');

    const x1 = w / PHI;
    const first = tweenArc(
      p5,
      Math.PI,
      (3 / 2) * Math.PI,
      [x1, h, x1 * 2, x1 * 2],
      [x1, 0, x1, h],
    );

    const y1 = h / PHI;
    const second = tweenArc(
      p5,
      (3 / 2) * Math.PI,
      2 * Math.PI,
      [x1, y1, y1 * 2, y1 * 2],
      [x1, y1, w, y1],
    );

    const x2 = w - (w - x1) / PHI;
    const third = tweenArc(
      p5,
      0,
      Math.PI / 2,
      [x2, y1, (h - y1) * 2, (h - y1) * 2],
      [x2, y1, x2, h],
    );

    const y2 = h - (h - y1) / PHI;
    const fourth = tweenArc(
      p5,
      (1 / 2) * Math.PI,
      Math.PI,
      [x2, y2, (h - y2) * 2, (h - y2) * 2],
      [x1, y2, x2, y2],
    );

    const x3 = x1 + (x2 - x1) / PHI;
    const fifth = tweenArc(
      p5,
      Math.PI,
      (3 / 2) * Math.PI,
      [x3, y2, (x3 - x1) * 2, (x3 - x1) * 2],
      [x3, y1, x3, y2],
    );

    const y3 = y1 + (y2 - y1) / PHI;
    const sixth = tweenArc(
      p5,
      (3 / 2) * Math.PI,
      2 * Math.PI,
      [x3, y3, (x2 - x3) * 2, (x2 - x3) * 2],
      [x3, y3, x2, y3],
    );

    const x4 = x2 - (x2 - x3) / PHI;
    const seventh = tweenArc(
      p5,
      0,
      (1 / 2) * Math.PI,
      [x4, y3, (x2 - x4) * 2, (x2 - x4) * 2],
      [x4, y3, x4, y2],
    );

    const y4 = y2 - (y2 - y3) / PHI;
    const eigth = tweenArc(
      p5,
      (1 / 2) * Math.PI,
      Math.PI,
      [x4, y4, (x4 - x3) * 2, (x4 - x3) * 2],
      [x3, y4, x4, y4],
    );

    const x5 = x3 + (x4 - x3) / PHI;
    const ninth = tweenArc(
      p5,
      Math.PI,
      (3 / 2) * Math.PI,
      [x5, y4, (x5 - x3) * 2, (x5 - x3) * 2],
      [x5, y3, x5, y4],
    );

    const y5 = y3 + (y4 - y3) / PHI;
    const tenth = tweenArc(
      p5,
      (3 / 2) * Math.PI,
      2 * Math.PI,
      [x5, y5, (x4 - x5) * 2, (x4 - x5) * 2],
      [x4, y5, x5, y5],
    );

    const x6 = x4 - (x4 - x5) / PHI;
    const eleventh = tweenArc(
      p5,
      0,
      (1 / 2) * Math.PI,
      [x6, y5, (x4 - x6) * 2, (x4 - x6) * 2],
      [x6, y4, x6, y5],
    );

    const y6 = y4 - (y4 - y5) / PHI;
    const twelfth = tweenArc(
      p5,
      (1 / 2) * Math.PI,
      Math.PI,
      [x6, y6, (x6 - x5) * 2, (x6 - x5) * 2],
      [x5, y6, x6, y6],
    );

    first
      .chain(
        second.chain(
          third.chain(
            fourth.chain(
              fifth.chain(
                sixth.chain(
                  seventh.chain(
                    eigth.chain(
                      ninth.chain(tenth.chain(eleventh.chain(twelfth))),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      )
      .start();

    return () => {
      p5.translate((width - w) / 2, (height - h) / 2);
      TWEEN.update();
    };
  },
  {
    p5: { p5 },
    animate: true,
  },
);
