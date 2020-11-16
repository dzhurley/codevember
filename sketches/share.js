const canvasSketch = require('canvas-sketch');
const { pick, rangeFloor } = require('canvas-sketch-util/random');
const THREE = require('three');
const TWEEN = require('@tweenjs/tween.js');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const colors = ['white', 'red', 'green', 'blue', 'cyan', 'yellow', 'magenta'];
let lastColor = 0;
let currentColor = 1;
let animating = false;
const balls = [];

const getNorth = (i) => i + 12;
const getSouth = (i) => i - 12;
const getEast = (i) => i - 1;
const getWest = (i) => i + 1;

const search = (balls, index) => {
  const queue = [index];
  const visited = {};
  let level = 0;
  while (queue.length) {
    const current = queue.shift();
    visited[current] = level;

    const north = getNorth(current);
    if (balls[north] && !(north in visited)) {
      queue.push(north);
    }

    const south = getSouth(current);
    if (balls[south] && !(south in visited)) {
      queue.push(south);
    }

    const east = getEast(current);
    if (balls[east] && !(east in visited)) {
      queue.push(east);
    }

    const west = getWest(current);
    if (balls[west] && !(west in visited)) {
      queue.push(west);
    }

    level += 0.01;
  }

  return visited;
};

const animateBall = (ball, step, color) => {
  const forward = new TWEEN.Tween(ball.scale)
    .to({ x: 2, y: 2, z: 2 }, 1000)
    .onUpdate(() => {
      ball.material.color = new THREE.Color(colors[lastColor]).lerp(
        new THREE.Color(colors[currentColor]),
        ball.scale.x - 1,
      );
    })
    .delay(50 * step);
  const backward = new TWEEN.Tween(ball.scale).to({ x: 1, y: 1, z: 1 }, 1000);
  forward.chain(backward).start();
};

const start = () => {
  animating = true;
  const visited = search(
    balls,
    pick([
      rangeFloor(52, 56),
      rangeFloor(64, 68),
      rangeFloor(76, 80),
      rangeFloor(88, 92),
    ]),
  );
  const animationDelay = 50 * Math.max(...Object.values(visited));
  Object.entries(visited).forEach(([index, level]) => {
    animateBall(balls[parseInt(index, 10)], level);
  });
  setTimeout(() => {
    animating = false;
    lastColor = lastColor === 6 ? 0 : lastColor + 1;
    currentColor = currentColor === 6 ? 0 : currentColor + 1;
  }, animationDelay + 2000);
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor(0);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3());

  const scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 2);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, context.canvas);

  const geometry = new THREE.SphereGeometry(1, 16, 8);

  for (let j = -16; j < 19; j += 3) {
    for (let i = -16; i < 19; i += 3) {
      const material = new THREE.MeshStandardMaterial({
        color: 'white',
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i;
      mesh.position.y = j;
      balls.push(mesh);
      scene.add(mesh);
    }
  }

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render({ time }) {
      if (!animating) {
        start();
      }
      TWEEN.update();
      controls.update();
      renderer.render(scene, camera);
    },
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, {
  animate: true,
  context: 'webgl',
});
