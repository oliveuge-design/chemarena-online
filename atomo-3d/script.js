import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Luce
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Nucleo
const nucleus = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.5 })
);
scene.add(nucleus);

// Orbitale s (sfera)
const orbitalS = new THREE.Mesh(
  new THREE.SphereGeometry(2.5, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x00bfff,
    transparent: true,
    opacity: 0.2,
    wireframe: false
  })
);
scene.add(orbitalS);

// Orbitale p (due lobi)
const lobeMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff99,
  transparent: true,
  opacity: 0.3
});

const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), lobeMaterial);
lobe1.position.x = -3;
const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), lobeMaterial);
lobe2.position.x = 3;

scene.add(lobe1);
scene.add(lobe2);

// Animazione
function animate() {
  requestAnimationFrame(animate);
  nucleus.rotation.y += 0.01;
  orbitalS.rotation.y += 0.005;
  lobe1.rotation.y += 0.005;
  lobe2.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
}

animate();