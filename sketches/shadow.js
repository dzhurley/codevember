const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor('#eaeaea', 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, 100);

  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const spotLightLeft = new THREE.SpotLight(0xffffff);
  spotLightLeft.position.set(50, 0, 50);
  spotLightLeft.castShadow = true;
  scene.add(spotLightLeft);

  const spotLightRight = new THREE.SpotLight(0xffffff);
  spotLightRight.position.set(-50, 0, 50);
  spotLightRight.castShadow = true;
  scene.add(spotLightRight);

  const planeSize = 46;
  const left = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(planeSize, planeSize),
    new THREE.MeshStandardMaterial({ color: '#54b7b7', side: THREE.DoubleSide }),
  );
  left.receiveShadow = true;
  left.position.x -= 16;
  left.position.z -= 16;
  left.rotation.y += Math.PI / 4;
  scene.add(left);

  const right = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(planeSize, planeSize),
    new THREE.MeshStandardMaterial({ color: '#90f9ab', side: THREE.DoubleSide }),
  );
  right.receiveShadow = true;
  right.position.x += 16;
  right.position.z -= 16;
  right.rotation.y -= Math.PI / 4;
  scene.add(right);

  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(planeSize * 2, planeSize * 2),
    new THREE.MeshStandardMaterial({ color: '#ffdc96', side: THREE.DoubleSide }),
  );
  floor.position.y -= 23;
  floor.rotation.x -= Math.PI / 2;
  floor.rotation.z -= Math.PI / 4;
  scene.add(floor);

  const positions = [
    [-6, -6, -6],
    [-6, -6, 0],
    [-6, -6, 0],
    [-6, -6, 6],
    [-6, 0, -6],
    [-6, 0, 0],
    [-6, 0, 6],
    [-6, 6, -6],
    [-6, 6, 0],
    [-6, 6, 6],
    [0, -6, -6],
    [0, -6, 0],
    [0, -6, 0],
    [0, -6, 6],
    [0, 0, -6],
    [0, 0, 0],
    [0, 0, 6],
    [0, 6, -6],
    [0, 6, 0],
    [0, 6, 6],
    [6, -6, -6],
    [6, -6, 0],
    [6, -6, 6],
    [6, 0, -6],
    [6, 0, 0],
    [6, 0, 6],
    [6, 6, -6],
    [6, 6, 0],
    [6, 6, 6],
  ];

  const group = new THREE.Group();
  positions.map((position) => {
    const shape = new THREE.Mesh(
      new THREE.BoxBufferGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: '#f47d70' }),
    );
    shape.position.set(...position);
    shape.castShadow = true;
    shape.receiveShadow = true;
    group.add(shape);
  });

  group.rotation.y = Math.PI / 4;
  group.rotation.z = Math.PI / 4;
  scene.add(group);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render() {
      group.rotation.y += 0.005;
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
