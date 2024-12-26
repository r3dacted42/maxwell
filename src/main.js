import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

let aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 20000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: $('#main-canvas')[0],
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 7, 15);

renderer.render(scene, camera);

new THREE.TextureLoader().load("image/gm_construct.png",
  (texture) => {
    const skySphereGeometry = new THREE.SphereGeometry(1000, 100, 100);
    const skySphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });
    skySphereMaterial.side = THREE.BackSide;
    const skySphereMesh = new THREE.Mesh(skySphereGeometry, skySphereMaterial);
    scene.add(skySphereMesh);
  },
  (xhr) => {
    console.log('texture ' + (xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (err) => {
    console.log('error while loading texture: ', err);
  }
);

let model;

new GLTFLoader().load("model/maxwell.gltf",
  (dingus) => {
    model = dingus.scene;
    const scale = 0.3;
    model.scale.set(scale, scale, scale);
    model.position.set(0, -3, 0);
    scene.add(model);
  },
  (xhr) => {
    console.log('dingus ' + (xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (err) => {
    console.log('error while loading dingus: ', err);
  }
);

const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);

const orbitalControls = new OrbitControls(camera, renderer.domElement);

function animate() {
  renderer.render(scene, camera);

  if (model) model.rotation.y -= 0.01;
  orbitalControls.update();

  requestAnimationFrame(animate);
}

$(window).resize(() => {
  aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

$(document).on('pointerdown', () => {
  $('#bgm')[0].play();
});

$(document).on('visibilitychange', () => {
  if (document.visibilityState === 'hidden') $('#bgm')[0].pause();
});
