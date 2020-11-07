const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });
  renderer.setClearColor('#4f6332', 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 25, 100);

  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.enablePan = false;
  controls.minDistance = 10;
  controls.maxDistance = 120;

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(25, 30, 25);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const table = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(32, 32, 64, 64),
    new THREE.MeshStandardMaterial({ color: 'tan', dithering: true }),
  );
  table.receiveShadow = true;
  table.position.y -= 32;
  scene.add(table);

  const shape = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 1, 8, 16, 1, true),
    new THREE.MeshStandardMaterial({
      color: 'tan',
      flatShading: true,
      side: THREE.DoubleSide,
    }),
  );
  shape.castShadow = true;
  scene.add(shape);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    render({ time }) {
      const step = Math.abs(Math.sin(time / 3));
      shape.scale.set(-step + 2, step * 4 + 1, -step + 2);
      table.rotation.y += 0.05;
      shape.rotation.y += 0.05;
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
