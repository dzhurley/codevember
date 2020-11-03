/* eslint-disable no-restricted-properties */
const THREE = require('three');

global.THREE = THREE;

const canvasSketch = require('canvas-sketch');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, -6, 70);

  const scene = new THREE.Scene();

  const light = new THREE.PointLight(0xffffff, 2);
  light.position.set(0, -15, 100);
  scene.add(light);

  const points = [];
  for (let i = -5; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, -Math.pow(i * 1.5, 2), 25 * i));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeBufferGeometry(curve, 100, 14, 100, false);
  const material = new THREE.MeshStandardMaterial({
    color: 'lightblue',
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const particle = new THREE.Mesh(
    new THREE.IcosahedronBufferGeometry(6),
    new THREE.MeshStandardMaterial({ color: 'pink' }),
  );
  scene.add(particle);

  let counter = 6;

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    render() {
      counter -= 0.025;
      if (counter <= 0) {
        counter = 6;
      }
      const { x, y, z } = curve.getPointAt(Math.abs(Math.sin(counter / 6)));
      particle.position.x = x;
      particle.position.y = y;
      particle.position.z = z;

      particle.rotation.x = Math.sin(counter * 2);
      particle.rotation.y = Math.cos(counter);
      particle.rotation.z = Math.cos(counter * 2);
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
