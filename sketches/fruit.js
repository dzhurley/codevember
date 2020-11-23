/* eslint-disable no-param-reassign */
const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/loaders/GLTFLoader');
require('three/examples/js/loaders/OBJLoader');
require('three/examples/js/loaders/MTLLoader');

const canvasSketch = require('canvas-sketch');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, 60);
  camera.lookAt(new THREE.Vector3());

  const scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 0.8);
  scene.add(light);

  const background = new THREE.Mesh(
    new THREE.BoxBufferGeometry(50, 50, 120),
    new THREE.MeshNormalMaterial({ color: 'gray', side: THREE.BackSide }),
  );

  scene.add(background);

  let orange;
  new THREE.MTLLoader().load('./orange-fruit/source/Unity/sdsdfs.unity_1.mtl', (materials) => {
    materials.preload();
    new THREE.OBJLoader().setMaterials(materials).load(
      './orange-fruit/source/Unity/sdsdfs.unity_1.obj',
      (object) => {
        orange = object;
        orange.scale.x *= 0.2;
        orange.scale.y *= 0.2;
        orange.scale.z *= 0.2;
        orange.rotation.z += Math.PI / 2;
        scene.add(orange);
      },
    );
  });

  let banana;
  new THREE.MTLLoader().load('./banana/source/banana/export_banana.mtl', (materials) => {
    materials.preload();
    new THREE.OBJLoader().setMaterials(materials).load(
      './banana/source/banana/export_banana.obj',
      (object) => {
        banana = object;
        banana.scale.x *= 10;
        banana.scale.y *= 10;
        banana.scale.z *= 10;
        banana.rotation.z -= Math.PI / 2;
        banana.position.y += 8.25;
        scene.add(banana);
      },
    );
  });

  let apple;
  new THREE.GLTFLoader().load('./apple/scene.gltf', (gltf) => {
    apple = gltf.scene;
    apple.scale.x *= 0.15;
    apple.scale.y *= 0.15;
    apple.scale.z *= 0.15;
    apple.position.y += 14;
    scene.add(apple);
  });

  let watermelon;
  new THREE.GLTFLoader().load('./watermelon/scene.gltf', (gltf) => {
    watermelon = gltf.scene;
    watermelon.scale.x *= 0.15;
    watermelon.scale.y *= 0.15;
    watermelon.scale.z *= 0.15;
    watermelon.rotation.z = Math.PI / 2;
    watermelon.position.y += 8.5;
    scene.add(watermelon);
  });

  let rotation = 0;

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render() {
      rotation += 0.03;
      if (apple) {
        apple.rotation.y = rotation;
      }
      if (orange) {
        orange.rotation.y = rotation;
      }
      if (banana) {
        banana.rotation.y = rotation;
      }
      if (watermelon) {
        watermelon.rotation.y = rotation;
      }
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
