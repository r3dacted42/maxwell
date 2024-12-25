import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

let aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: $('#main-canvas')[0],
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 7, 15);

renderer.render(scene, camera);

const loader = new GLTFLoader();
let model;

loader.load("model/maxwell.gltf",
  (gltf) => {
    model = gltf.scene;
    const scale = 0.3;
    model.scale.set(scale, scale, scale);
    model.position.set(0, -3, 0);
    scene.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (err) => {
    console.log('error while loading gltf: ', err);
  }
);

const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);

const orbitalControls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  if (model) model.rotation.y -= 0.007;
  orbitalControls.update();

  renderer.render(scene, camera);
}

$(window).resize(() => {
  aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

$(document).on('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    $('#bgm')[0].pause();
  } else {
    $('#bgm')[0].play();
  }
});
