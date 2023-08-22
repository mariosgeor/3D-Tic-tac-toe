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

// Create the TicTacToe board
const board = new THREE.Group();
const hiddenCubesGroup = new THREE.Group();
const gameSymbols = new THREE.Group();

// Create a mesh standard material
const material = new THREE.MeshStandardMaterial({
  color: 0xfcc742,
  emissive: 0x7b1414,
  specular: 0x7b1414,
  metalness: 0.5,
  roughness: 0.5,
  wireframe: true,
});

scene.background = new THREE.Color(0x282c34);

// Player Turn
let currentPlayer = "sphere"; // Starting with sphere
// Create lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Vertical lines
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

// Horizontal lines
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

// Hidden cubes


// Create a cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:true });

const cube9 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition9 = new THREE.Vector3(20, -20, 12);
cube9.position.copy(initialPosition9);
hiddenCubesGroup.add(cube9);
cube9.visible =false;
const cube8 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition8 = new THREE.Vector3(0, -20, 12);
cube8.position.copy(initialPosition8);
hiddenCubesGroup.add(cube8);
cube8.visible =false;
const cube7 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition7 = new THREE.Vector3(-20, -20, 12);
cube7.position.copy(initialPosition7);
hiddenCubesGroup.add(cube7);
cube7.visible =false;
const cube6 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition6 = new THREE.Vector3(20, 0, 12);
cube6.position.copy(initialPosition6);
hiddenCubesGroup.add(cube6);
cube6.visible =false;
const cube5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition5 = new THREE.Vector3(0, 0, 12);
cube5.position.copy(initialPosition5);
hiddenCubesGroup.add(cube5);
cube5.visible =false;
const cube4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition4 = new THREE.Vector3(-20, 0, 12);
cube4.position.copy(initialPosition4);
hiddenCubesGroup.add(cube4);
cube4.visible =false;
const cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition3 = new THREE.Vector3(20, 20, 12);
cube3.position.copy(initialPosition3);
hiddenCubesGroup.add(cube3);
cube3.visible =false;
const cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition1 = new THREE.Vector3(-20, 20, 12);
cube1.position.copy(initialPosition1);
hiddenCubesGroup.add(cube1);
cube1.visible =false;
const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialPosition2 = new THREE.Vector3(-0, 20, 12);
cube2.position.copy(initialPosition2);
hiddenCubesGroup.add(cube2);
cube2.visible =false;

const players = ["X", "O"];
const playerMeshes = {
  X: createXMesh(),
  O: createSphereMesh(),
};
let currentPlayerIndex = 0;


// Add Event Listeners and Handle Click Event

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// Mouse down event handler
renderer.domElement.addEventListener("mousedown", onMouseDown);
scene.add(board);
scene.add(hiddenCubesGroup);
scene.add(gameSymbols);


function createXMesh() {
  const geometry = new THREE.BoxGeometry(10, 10, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:true });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

function createSphereMesh() {
  const sphereGeometry = new THREE.SphereGeometry(6, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe:true });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  return sphere;
}

const clickedCubes = [];

function animate() {
  requestAnimationFrame(animate);
 
  // Rotate the board and hidden cubes
  // scene.rotation.y += 0.001;
  gameSymbols.children.forEach((playerMesh) => { // Adjust the rotation speed as needed
    playerMesh.rotation.y += 0.02; // Adjust the rotation speed as needed
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
      clickedCube.userData.clicked = true; // Mark the cube as clicked
      clickedCube.visible = false;

      // Add the appropriate player mesh at the same position
      const currentPlayer = players[currentPlayerIndex];
      const playerMesh = playerMeshes[currentPlayer].clone();
      playerMesh.position.copy(clickedCube.position);

      // Add the player mesh to hiddenCubesGroup
      gameSymbols.add(playerMesh);

      clickedCubes.push(clickedCube); // Store the clicked cube

      // Toggle player's turn
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
  }
}

animate();
