const THREE = require('three');
const { rangeFloor } = require('canvas-sketch-util/random');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const frustumSize = 32;

let scene;
const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
const material = new THREE.MeshNormalMaterial();

const H = [
  [-2, 4],
  [-2, 2],
  [-2, 0],
  [-2, -2],
  [-2, -4],
  [0, 0],
  [2, 4],
  [2, 2],
  [2, 0],
  [2, -2],
  [2, -4],
];

const E = [
  [-2, 4],
  [0, 4],
  [2, 4],
  [-2, 2],
  [-2, 0],
  [0, 0],
  [2, 0],
  [-2, -2],
  [-2, -4],
  [0, -4],
  [2, -4],
];

const L = [[-2, 4], [-2, 2], [-2, 0], [-2, -2], [-2, -4], [0, -4], [2, -4]];

const O = [
  [-2, 4],
  [0, 4],
  [2, 4],
  [-2, 2],
  [2, 2],
  [-2, 0],
  [2, 0],
  [-2, -2],
  [2, -2],
  [-2, -4],
  [0, -4],
  [2, -4],
];

const drawLetter = (positions) => {
  const letter = new THREE.Group();
  positions.forEach(([x, y]) => {
    const block = new THREE.Mesh(geometry, material);
    block.position.x = x;
    block.position.y = y;
    block.position.z = rangeFloor(-16, 16);
    letter.add(block);
  });
  return letter;
};

const sketch = ({ context, width, height }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  const aspect = width / height;
  const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect,
    frustumSize * aspect,
    frustumSize,
    -frustumSize,
    -1000,
    1000,
  );
  camera.position.set(0.5, 1, 1);

  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.enableZoom = false;

  scene = new THREE.Scene();

  const light = new THREE.PointLight(0xffffff, 1, 200);
  scene.add(light);

  const one = drawLetter(H);
  one.position.x -= 14;

  const two = drawLetter(E);
  two.position.x -= 7;

  const three = drawLetter(L);

  const four = drawLetter(L);
  four.position.x += 7;

  const five = drawLetter(O);
  five.position.x += 14;

  scene.add(one, two, three, four, five);

  const container = new THREE.Mesh(
    new THREE.BoxBufferGeometry(120, 120, 120),
    new THREE.MeshStandardMaterial({ color: 'white', side: THREE.BackSide }),
  );

  scene.add(container);

  return {
    resize({ viewportWidth, viewportHeight }) {
      const newAspect = viewportWidth / viewportHeight;
      camera.left = -frustumSize * newAspect;
      camera.right = frustumSize * newAspect;
      camera.top = frustumSize;
      camera.bottom = -frustumSize;

      camera.updateProjectionMatrix();
    },
    render() {
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
