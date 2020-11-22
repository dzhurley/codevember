const THREE = require('three');

global.THREE = THREE;

const canvasSketch = require('canvas-sketch');
const { rangeFloor } = require('canvas-sketch-util/random');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor(0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, 100);

  const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 30);
  const material = new THREE.MeshBasicMaterial({ color: 'white' });
  const stars = [];
  for (let i = 0; i < 512; i++) {
    const star = new THREE.Mesh(geometry, material);
    star.position.x = rangeFloor(-200, 200);
    star.position.y = rangeFloor(-200, 200);
    star.position.z = rangeFloor(-400, 200);
    stars.push(star);
    scene.add(star);
  }

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render() {
      for (let i = 0; i < stars.length; i++) {
        stars[i].position.z += 10;
        if (stars[i].position.z > 200) {
          stars[i].position.z = -400;
        }
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
