const { pick } = require('canvas-sketch-util/random');

const THREE = require('three');

global.THREE = THREE;

const canvasSketch = require('canvas-sketch');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor('#000', 1);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, 100);

  const scene = new THREE.Scene();

  const ball = new THREE.Mesh(
    new THREE.IcosahedronBufferGeometry(32, 0),
    new THREE.MeshPhongMaterial({ color: 'white', flatShading: true }),
  );
  scene.add(ball);

  const colors = ['red', 'green', 'blue', 'orange', 'yellow', 'purple'];
  const geometry = new THREE.IcosahedronGeometry(32, 1);
  const lights = new THREE.Group();
  geometry.vertices.forEach((vertex, i) => {
    if (i % 2 !== 0) {
      return;
    }
    const light = new THREE.PointLight(pick(colors), 1, 64);
    light.position.copy(vertex);
    light.position.multiplyScalar(1.05);
    lights.add(light);
  });
  scene.add(lights);

  const background = new THREE.Mesh(
    new THREE.IcosahedronBufferGeometry(96, 0),
    new THREE.MeshPhongMaterial({ side: THREE.BackSide }),
  );
  scene.add(background);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    render() {
      ball.rotation.y += 0.01;
      lights.rotation.y += 0.01;
      background.rotation.y -= 0.01;
      renderer.render(scene, camera);
    },

    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, {
  animate: true,
  context: 'webgl',
});
