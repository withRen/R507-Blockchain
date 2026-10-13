import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Elements du DOM
const canvas = document.querySelector('#webgl-canvas');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0f19');
scene.fog = new THREE.FogExp2('#0b0f19', 0.035);

// Dimensions
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 3, 5);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// Controles d'orbite
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2 + 0.1; // Limite sous le sol

// Eclairage
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
directionalLight.position.set(5, 8, 4);
scene.add(directionalLight);

const secondaryLight = new THREE.DirectionalLight(0x6366f1, 1.8);
secondaryLight.position.set(-5, -2, -4);
scene.add(secondaryLight);

// Grille de sol pour donner des reperes spatiaux
const gridHelper = new THREE.GridHelper(20, 20, 0x38bdf8, 0x1e293b);
gridHelper.position.y = -1.2;
scene.add(gridHelper);

// Creation d'un bloc blockchain interactif (Genesis Block #0)
const blockGroup = new THREE.Group();
scene.add(blockGroup);

// Geometrie du bloc
const boxGeometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);

// Materiau principal (style verre / cyber teinté)
const boxMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0f172a,
  metalness: 0.2,
  roughness: 0.15,
  transmission: 0.6,
  thickness: 1.2,
  transparent: true,
  opacity: 0.92,
  reflectivity: 0.9
});

const blockMesh = new THREE.Mesh(boxGeometry, boxMaterial);
blockGroup.add(blockMesh);

// Bords lumineux pour faire ressortir la structure
const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
const edgesMaterial = new THREE.LineBasicMaterial({
  color: 0x38bdf8,
  linewidth: 2
});
const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
blockGroup.add(edgesMesh);

// Noyau lumineux central representant la donnee / hash
const coreGeometry = new THREE.OctahedronGeometry(0.5, 0);
const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  emissive: 0x4f46e5,
  emissiveIntensity: 0.8,
  roughness: 0.3
});
const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
blockGroup.add(coreMesh);

// Anneau orbital autour du bloc
const ringGeometry = new THREE.TorusGeometry(1.6, 0.015, 16, 64);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0x38bdf8,
  transparent: true,
  opacity: 0.4
});
const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.rotation.x = Math.PI / 3;
blockGroup.add(ringMesh);

// Gestion du redimensionnement de la fenetre
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Boucle d'animation
const startTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = (performance.now() - startTime) * 0.001;

  // Animation subtile de veille
  blockGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.1;
  blockGroup.rotation.y = elapsedTime * 0.25;

  coreMesh.rotation.x = elapsedTime * 0.8;
  coreMesh.rotation.y = elapsedTime * 1.1;

  ringMesh.rotation.z = -elapsedTime * 0.4;

  controls.update();
  renderer.render(scene, camera);
}

animate();
