const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
  context: 'webgl',
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 32, 0);

  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.maxDistance = 100;

  const scene = new THREE.Scene();

  const light = new THREE.PointLight(0xffffff, 2);
  light.position.set(0, 0, 0);
  scene.add(light);

  const red = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(2, 2, 1, 64, 1, true),
    new THREE.MeshPhongMaterial({
      color: 'red',
      side: THREE.DoubleSide,
      flatShading: true,
    })
  );
  red.rotateX(1);

  const green = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(4, 4, 1, 64, 1, true),
    new THREE.MeshPhongMaterial({
      color: 'green',
      side: THREE.DoubleSide,
      flatShading: true,
    })
  );
  green.rotateZ(1);

  const blue = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(6, 6, 1, 64, 1, true),
    new THREE.MeshPhongMaterial({
      color: 'blue',
      side: THREE.DoubleSide,
      flatShading: true,
    })
  );
  blue.rotateX(2);
  blue.rotateY(1);

  scene.add(red, green, blue);

  const speed = 0.01;

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render() {
      red.rotateY(speed);
      green.rotateY(speed);
      blue.rotateY(speed);

      controls.update();
      renderer.render(scene, camera);
    },
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
