const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const frustumSize = 24;
let scene;
const toppers = [];

const addStep = (x, y, z) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 12, 4),
    new THREE.MeshStandardMaterial({
      color: 'lightblue',
    }),
  );
  mesh.position.set(x, y, z);
  scene.add(mesh);

  const wire = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 12, 4),
    new THREE.MeshBasicMaterial({
      wireframe: true,
    }),
  );
  wire.position.set(x, y, z);
  scene.add(wire);

  const topper = new THREE.Mesh(
    new THREE.OctahedronBufferGeometry(1),
    new THREE.MeshStandardMaterial({ color: 'cream' }),
  );
  topper.position.set(x, y + 8, z);
  toppers.push(topper);
  scene.add(topper);
};

const sketch = ({ context, width, height }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor('grey', 1);

  const aspect = width / height;
  const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect,
    frustumSize * aspect,
    frustumSize,
    -frustumSize,
    -1000,
    1000,
  );
  camera.position.set(1, 1.5, 1);

  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.enableRotate = false;
  controls.enablePan = false;

  scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0.5, 0.75, 0.25);
  scene.add(light);

  addStep(8, 6, 0);
  addStep(12, 5, 0);
  addStep(12, 4, 4);
  addStep(12, 3, 8);
  addStep(8, 2, 8);
  addStep(4, 1, 8);
  addStep(0, 0, 8);
  addStep(-4, -1, 8);
  addStep(-4, -2, 4);
  addStep(-4, -3, 0);
  addStep(-4, -4, -4);
  addStep(-4, -5, -8);

  return {
    resize({ viewportWidth, viewportHeight }) {
      const newAspect = viewportWidth / viewportHeight;
      camera.left = -frustumSize * newAspect;
      camera.right = frustumSize * newAspect;
      camera.top = frustumSize;
      camera.bottom = -frustumSize;

      camera.updateProjectionMatrix();
    },
    render({ time }) {
      toppers.forEach((topper, index) => {
        topper.rotation.y -= 0.01;
        topper.position.y = Math.sin(time - index) / 2 + (toppers.length + 2 - index);
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
