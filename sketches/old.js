/* eslint-disable no-param-reassign */
const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');
require('three/examples/js/loaders/GLTFLoader');

const canvasSketch = require('canvas-sketch');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });
  renderer.setClearColor(0);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(-16, 16, -8);
  camera.lookAt(new THREE.Vector3());

  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.minDistance = 12;
  controls.maxDistance = 50;

  const scene = new THREE.Scene();

  const sphere = new THREE.SphereBufferGeometry(0.1, 16, 8);

  // lights

  const light1 = new THREE.PointLight(0xffffff, 1, 25);
  light1.add(
    new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })),
  );
  scene.add(light1);

  const light2 = new THREE.PointLight(0xffffff, 1, 25);
  light2.add(
    new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })),
  );
  scene.add(light2);

  const loader = new THREE.GLTFLoader();

  loader.load('./book_open/scene.gltf', (gltf) => {
    gltf.scene.scale.x = 0.2;
    gltf.scene.scale.y = 0.2;
    gltf.scene.scale.z = 0.2;
    gltf.scene.position.y += 3;
    scene.add(gltf.scene);
    renderer.render(scene, camera);
  });

  loader.load('./book/scene.gltf', (gltf) => {
    gltf.scene.scale.x = 0.44;
    gltf.scene.scale.y = 0.44;
    gltf.scene.scale.z = 0.44;
    gltf.scene.rotateY(1);
    scene.add(gltf.scene);
    renderer.render(scene, camera);
  });

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render({ time }) {
      light1.position.x = Math.sin(time * 0.7) * 13;
      light1.position.y = Math.cos(time * 0.5) * 14;
      light1.position.z = Math.cos(time * 0.3) * 13;

      light2.position.x = Math.cos(time * 0.3) * 13;
      light2.position.y = Math.sin(time * 0.5) * 14;
      light2.position.z = Math.sin(time * 0.7) * 13;

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
