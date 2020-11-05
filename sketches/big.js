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

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
  directionalLight.position.set(0, 1, -0.25);
  scene.add(directionalLight);

  const planet = new THREE.Mesh(
    new THREE.IcosahedronBufferGeometry(64, 32),
    new THREE.MeshStandardMaterial({
      color: 'red',
      flatShading: true,
    }),
  );
  planet.position.x += 16;
  planet.position.y -= 16;
  planet.position.z -= 32;
  scene.add(planet);

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(128, 80, 256, 256),
    new THREE.MeshStandardMaterial({
      color: 'lightblue',
      morphTargets: true,
      side: THREE.BackSide,
      flatShading: true,
    }),
  );

  const wobble = 0.3;

  surface.geometry.vertices.forEach((vertex) => {
    const scalar = Math.random() * wobble;
    return vertex.setZ(scalar);
  });

  surface.geometry.morphTargets.push({
    name: 'flex',
    vertices: surface.geometry.vertices.map((vertex) => {
      const scalar = Math.random() * wobble;
      return vertex.clone().setZ(scalar);
    }),
  });

  surface.rotateX(1.6);
  surface.position.z += 64;
  scene.add(surface);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    render({ time }) {
      surface.morphTargetInfluences = [Math.sin(time / 2) + 1 / 2];
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
