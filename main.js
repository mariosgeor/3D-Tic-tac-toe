import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 100;

const earthTexture = new THREE.TextureLoader().load('./assets/images/2k_earth_daymap.jpg');
const xTexture = new THREE.TextureLoader().load('./assets/images/texture2.jpg');

const board = new THREE.Group();
const hiddenCubesGroup = new THREE.Group();
const gameSymbols = new THREE.Group();


const material = new THREE.MeshStandardMaterial({
  color: 0xfcc742,
  emissive: 0x7b1414,
  metalness: 0.5,
  roughness: 0.5,
  // wireframe: true,
});

scene.background = new THREE.Color(0x282c34);


let currentPlayer = "sphere"; // Starting with sphere

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


const verticalLineGeometry = new THREE.BoxGeometry(1, 64, 4);
// const verticalLineMaterial = new THREE.MeshBasicMaterial();

const verticalLineLeft = new THREE.Mesh(verticalLineGeometry, material);
verticalLineLeft.position.set(-32, 0, 12);
board.add(verticalLineLeft);

const verticalLineMiddleLeft = new THREE.Mesh(verticalLineGeometry, material);
verticalLineMiddleLeft.position.set(-10, 0, 12);
board.add(verticalLineMiddleLeft);

const verticalLineRight = new THREE.Mesh(verticalLineGeometry, material);
verticalLineRight.position.set(32, 0, 12);
board.add(verticalLineRight);

const verticalLineMiddleRight = new THREE.Mesh(verticalLineGeometry, material);
verticalLineMiddleRight.position.set(10, 0, 12);
board.add(verticalLineMiddleRight);


const horizontalLineGeometry = new THREE.BoxGeometry(64, 1, 4);
// const horizontalLineMaterial = new THREE.MeshBasicMaterial({color: 0x327fa8});

const horizontalLineTop = new THREE.Mesh(horizontalLineGeometry, material);
horizontalLineTop.position.set(0, 31.5, 12);
board.add(horizontalLineTop);

const horizontalLineMiddleTop = new THREE.Mesh(
  horizontalLineGeometry,
  material
);
horizontalLineMiddleTop.position.set(0, 10, 12);
board.add(horizontalLineMiddleTop);

const horizontalLineBottom = new THREE.Mesh(horizontalLineGeometry, material);
horizontalLineBottom.position.set(0, -31.5, 12);
board.add(horizontalLineBottom);

const horizontalLineMiddleBottom = new THREE.Mesh(
  horizontalLineGeometry,
  material
);
horizontalLineMiddleBottom.position.set(0, -10, 12);
board.add(horizontalLineMiddleBottom);


const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cubePositions = [
  new THREE.Vector3(20, -20, 12),
  new THREE.Vector3(0, -20, 12),
  new THREE.Vector3(-20, -20, 12),
  new THREE.Vector3(20, 0, 12),
  new THREE.Vector3(0, 0, 12),
  new THREE.Vector3(-20, 0, 12),
  new THREE.Vector3(20, 20, 12),
  new THREE.Vector3(-20, 20, 12),
  new THREE.Vector3(0, 20, 12)
];

cubePositions.forEach(position => {
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.copy(position);
  cube.visible = false;
  hiddenCubesGroup.add(cube);
});

const players = ["X", "O"];
const playerMeshes = {
  X: createXMesh(),
  O: createEarthMesh(), 
};
let currentPlayerIndex = 0;




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();



renderer.domElement.addEventListener("mousedown", onMouseDown);
scene.add(board);
scene.add(hiddenCubesGroup);
scene.add(gameSymbols);


function createXMesh() {
  const xGroup = new THREE.Group();

  const xArmGeometry1 = new THREE.BoxGeometry(2, 12, 1);
  const xArmMaterial = new THREE.MeshBasicMaterial({ map: xTexture });
  const xArm1 = new THREE.Mesh(xArmGeometry1, xArmMaterial);
  xArm1.position.set(0, 0, 0);
  xArm1.rotation.z = 2.7;
  xGroup.add(xArm1);

  const xArmGeometry2 = new THREE.BoxGeometry(2, 12, 1);
  const xArm2 = new THREE.Mesh(xArmGeometry2, xArmMaterial);
  xArm2.position.set(0, 0, 0);
  xArm2.rotation.z = 3.6;
  xGroup.add(xArm2);



  return xGroup;
}


function createEarthMesh() {
  const earthGeometry = new THREE.SphereGeometry(6, 50, 50);
  const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  return earth;
}

const clickedCubes = [];

function animate() {
  requestAnimationFrame(animate);
 
  // scene.rotation.y += 0.001;
  gameSymbols.children.forEach((playerMesh) => { 
    playerMesh.rotation.y += 0.008; 
  });

  renderer.render(scene, camera);
}


function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(hiddenCubesGroup.children);

  if (intersects.length > 0) {
    const clickedCube = intersects[0].object;

    if (!clickedCube.userData.clicked) {
      clickedCube.userData.clicked = true; 
      clickedCube.visible = false;

      
      const currentPlayer = players[currentPlayerIndex];
      const playerMesh = playerMeshes[currentPlayer].clone();
      playerMesh.position.copy(clickedCube.position);


      gameSymbols.add(playerMesh);

      clickedCubes.push(clickedCube); 


      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
  }
}
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
}


onWindowResize();

animate();
