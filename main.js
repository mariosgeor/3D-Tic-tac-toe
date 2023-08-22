import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
    wireframe: true
    
});

scene.background = new THREE.Color(0x282c34);

// Player Turn
let currentPlayer = 'sphere'; // Starting with sphere
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

const horizontalLineMiddleTop = new THREE.Mesh(horizontalLineGeometry, material);
horizontalLineMiddleTop.position.set(0, 10, 12);
board.add(horizontalLineMiddleTop);

const horizontalLineBottom = new THREE.Mesh(horizontalLineGeometry, material);
horizontalLineBottom.position.set(0, -31.5, 12);
board.add(horizontalLineBottom);


const horizontalLineMiddleBottom = new THREE.Mesh(horizontalLineGeometry, material);
horizontalLineMiddleBottom.position.set(0, -10, 12);
board.add(horizontalLineMiddleBottom);

// Hidden cubes
function _hiddenCube(offsets) {
    const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
    const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x327fa8});
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.visible = false;
    cube.position.x = offsets.x;
    cube.position.y = offsets.y;
    cube.position.z = offsets.z;
    return cube;
}
const players = ['X', 'O'];
const playerMeshes = {
    X: createXMesh(),
    O: createSphereMesh(),
};
let currentPlayerIndex = 0;
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
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Mouse move event handler
renderer.domElement.addEventListener('mousemove', onMouseMove);

// Mouse down event handler
renderer.domElement.addEventListener('mousedown', onMouseDown);
scene.add(board);
scene.add(hiddenCubesGroup);
scene.add(gameSymbols);

function animate() {
    requestAnimationFrame(animate);

    // Rotate the board and hidden cubes
    board.rotation.y += 0.001;
    hiddenCubesGroup.rotation.y += 0.001;
	gameSymbols.rotation.y += 0.001;


    renderer.render(scene, camera);
}
function createXMesh() {
    const xGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([-2, 2, 0, 2, -2, 0, 2, 2, 0, -2, -2, 0]);
    xGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    return new THREE.Mesh(xGeometry, xMaterial);
}

function createSphereMesh() {
    const sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    return new THREE.Mesh(sphereGeometry, sphereMaterial);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    gameSymbols.children.forEach(cube => {
        cube.material.color.set(0x327fa8);
    });

    const intersects = raycaster.intersectObjects(hiddenCubesGroup.children);

    if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000);
    }
}

function onMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(hiddenCubesGroup.children);

    if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        clickedCube.visible = false;

        // Add the appropriate player mesh at the same position
        const currentPlayer = players[currentPlayerIndex];
        const playerMesh = playerMeshes[currentPlayer].clone();
        playerMesh.position.copy(clickedCube.position);

        // Add the player mesh to hiddenCubesGroup
        gameSymbols.add(playerMesh);

        // Toggle player's turn
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
}

animate();

