const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');
require('three/examples/js/objects/Refractor');
require('three/examples/js/shaders/WaterRefractionShader');

const canvasSketch = require('canvas-sketch');

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });
  renderer.setClearColor(0x20252f);

  const clock = new THREE.Clock();

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(16, 16, 32);

  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  const geometry = new THREE.TorusKnotBufferGeometry(4, 1, 64, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0x6083c2, flatShading: true });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const dudvMap = new THREE.TextureLoader().load('waterdudv.jpg');
  dudvMap.wrapS = THREE.RepeatWrapping;
  dudvMap.wrapT = THREE.RepeatWrapping;

  const refractors = [];
  const positions = [
    [0, 0, 5],
    [0, 5, 0],
    [5, 0, 0],
    [0, 0, -5],
    [0, -5, 0],
    [-5, 0, 0],
  ];

  const refractorGeometry = new THREE.PlaneBufferGeometry(10, 10);
  positions.forEach((position) => {
    const refractor = new THREE.Refractor(refractorGeometry, {
      color: 0x999999,
      textureWidth: 1024,
      textureHeight: 1024,
      shader: THREE.WaterRefractionShader,
    });
    refractor.material.uniforms.tDudv.value = dudvMap;
    refractor.position.set(...position);
    refractors.push(refractor);
    scene.add(refractor);
  });

  refractors[1].rotateX(-Math.PI / 2);
  refractors[2].rotateY(Math.PI / 2);
  refractors[4].rotateX(Math.PI / 2);
  refractors[5].rotateY(-Math.PI / 2);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render() {
      const delta = clock.getDelta();
      refractors.forEach((refractor) => {
        refractor.material.uniforms.time.value += delta;
      });
      mesh.rotation.y += 0.002;
      mesh.rotation.z += 0.003;
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
