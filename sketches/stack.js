const canvasSketch = require('canvas-sketch');
const { pick, range } = require('canvas-sketch-util/random');
const { linspace } = require('canvas-sketch-util/math');
const THREE = require('three');

const randomColor = require('randomcolor');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const makeStack = (index) => {
  const stack = new THREE.Group();
  let y = -50;
  while (y < 50) {
    const height = range(6, 12);
    const geometry = new THREE.BoxBufferGeometry(
      range(6, 12),
      height,
      range(6, 12),
    );
    const material = new THREE.MeshStandardMaterial({
      color: randomColor({ hue: '#00FFFF' }),
    });
    const box = new THREE.Mesh(geometry, material);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.y = y + height / 2;
    box.rotateY(Math.random() * 2);
    stack.add(box);
    y += height;
  }
  stack.position.x = pick([range(-24, -10), range(10, 24)]);
  stack.position.z = range(-10, -20) * index;
  return stack;
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor('#000', 1);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 500);
  camera.position.set(0, 0, 1);

  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.enableZoom = false;
  controls.enablePan = false;

  const scene = new THREE.Scene();

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.castShadow = true;
  scene.add(light);

  const stacks = [];
  linspace(16).forEach((n, i) => {
    const stack = makeStack(i);
    stacks.push(stack);
    scene.add(stack);
  });

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render() {
      stacks.forEach((stack) => {
        stack.position.z += 0.25;
        if (stack.position.z > 100) {
          stack.position.z = -100;
        }
      });
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
