import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(1, 1, 100);

// Create the TicTacToe board
const board = new THREE.Group();
const hiddenCubesGroup = new THREE.Group();

// Player Turn
let currentPlayer = 'sphere'; // Starting with sphere


// Vertical lines
const verticalLineGeometry = new THREE.BoxGeometry(4, 64, 4);
const verticalLineMaterial = new THREE.MeshBasicMaterial({color: 0x327fa8});

const verticalLineLeft = new THREE.Mesh(verticalLineGeometry, verticalLineMaterial);
verticalLineLeft.position.set(-30, 0, 12);
board.add(verticalLineLeft);


const verticalLineMiddleLeft = new THREE.Mesh(verticalLineGeometry, verticalLineMaterial);
verticalLineMiddleLeft.position.set(-10, 0, 12);
board.add(verticalLineMiddleLeft);

const verticalLineRight = new THREE.Mesh(verticalLineGeometry, verticalLineMaterial);
verticalLineRight.position.set(30, 0, 12);
board.add(verticalLineRight);

const verticalLineMiddleRight = new THREE.Mesh(verticalLineGeometry, verticalLineMaterial);
verticalLineMiddleRight.position.set(10, 0, 12);
board.add(verticalLineMiddleRight);


// Horizontal lines
const horizontalLineGeometry = new THREE.BoxGeometry(64, 4, 4);
const horizontalLineMaterial = new THREE.MeshBasicMaterial({color: 0x327fa8});

const horizontalLineTop = new THREE.Mesh(horizontalLineGeometry, horizontalLineMaterial);
horizontalLineTop.position.set(0, 30, 12);
board.add(horizontalLineTop);

const horizontalLineMiddleTop = new THREE.Mesh(horizontalLineGeometry, horizontalLineMaterial);
horizontalLineMiddleTop.position.set(0, 10, 12);
board.add(horizontalLineMiddleTop);

const horizontalLineBottom = new THREE.Mesh(horizontalLineGeometry, horizontalLineMaterial);
horizontalLineBottom.position.set(0, -30, 12);
board.add(horizontalLineBottom);


const horizontalLineMiddleBottom = new THREE.Mesh(horizontalLineGeometry, horizontalLineMaterial);
horizontalLineMiddleBottom.position.set(0, -10, 12);
board.add(horizontalLineMiddleBottom);

// Hidden cubes
function _hiddenCube(offsets) {
    const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
    const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x327fa8});
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = offsets.x;
    cube.position.y = offsets.y;
    cube.position.z = offsets.z;
    return cube;
}

const hiddenCubeOffsets = [
    { x: -20, y: 20, z: 12 },
    { x: 0, y: 20, z: 12 },
    { x: 20, y: 20, z: 12 },
    { x: -20, y: 0, z: 12 },
	{ x: 0, y: 0, z: 12 },
	{ x: 20, y: 0, z: 12 },
	{ x: -20, y: -20, z: 12 },
	{ x: 0, y: -20, z: 12 },
	{ x: 20, y: -20, z: 12 },
];

// Add Event Listeners and Handle Click Event
hiddenCubeOffsets.forEach(offsets => {
    const hiddenCube = _hiddenCube(offsets);
    hiddenCubesGroup.add(hiddenCube);


});

scene.add(board);
scene.add(hiddenCubesGroup);

function animate() {
	requestAnimationFrame(animate);
    // board.rotation.y += 0.0001;
	renderer.render(scene, camera);
}

animate();

