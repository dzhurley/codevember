/* eslint-disable */
let img;
let song;
let fft;
let rotation = 0;

function preload() {
  img = loadImage('./record.png');
  song = loadSound('./jazz.mp3');
}

function setup() {
  const { canvas } = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  fft = new p5.FFT();
  fft.setInput(song);

  canvas.addEventListener('click', () => {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.loop();
    }
  });
}

function draw() {
  background('#62d9dc');
  stroke(255);
  noFill();

  const spectrum = fft.analyze();

  push();
  translate(width / 2, height / 2);
  rotate(rotation);
  if (song.isPlaying()) {
    rotation += 0.25;
  }
  image(img, -225, -225, 450, 450);
  pop();

  translate(width / 2, height / 2);
  beginShape();
  spectrum.forEach((spec, index) => {
    const r = map(spec, 0, 255, 100, 200);
    const i = map(index, 0, 1024, -90, 270);
    const x = r * cos(i);
    const y = r * sin(i);
    vertex(x, y);
  });
  endShape();
}
