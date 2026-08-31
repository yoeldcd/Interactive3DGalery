/**
 * @file gallery_builder.js
 * @description Constructor procedural de salas poligonales, pasillos, marcos, luminarias y objetos 3D.
 */

import * as THREE from 'three';
import { createPastelYellowWallTexture, createThematicRoomWallTexture } from './texture_generator.js';

/**
 * Constructor procedural GalleryBuilder.
 */
class GalleryBuilder {

    /**
     * Inicializa geometrías y materiales compartidos para la construcción.
     */
    constructor() {
        this.geoLampTrim = new THREE.CylinderGeometry(0.58, 0.58, 0.03, 24);
        this.geoLampRecess = new THREE.CylinderGeometry(0.48, 0.52, 0.04, 24);
        this.geoLampGlow = new THREE.CylinderGeometry(0.46, 0.46, 0.015, 24);

        this.hallWallTexture = createPastelYellowWallTexture();
        this.matHallWall = new THREE.MeshStandardMaterial({
            map: this.hallWallTexture,
            color: 0xffffff,
            roughness: 0.82,
            metalness: 0.02
        });
        this.matHallFloor = new THREE.MeshStandardMaterial({ color: 0xded8cc, roughness: 0.52, metalness: 0.02 });
        this.matHallCeil = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.96, metalness: 0.0 });
        this.matLampTrim = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 });
        this.matLampRecess = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.1 });
        this.matFrameBorder = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.2 });
        this.matDoorThreshold = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    }

    /**
     * Crea un artefacto de iluminación circular empotrado en el techo.
     * @param {number} [glowColor=0xfffaed] - Color del resplandor emissive.
     * @returns {THREE.Group} Grupo de mallas que componen la luminaria.
     */
    createCircularLamp(glowColor = 0xfffaed) {
        const fixtureGroup = new THREE.Group();

        const trimMesh = new THREE.Mesh(this.geoLampTrim, this.matLampTrim);
        trimMesh.position.set(0, 0.01, 0);
        fixtureGroup.add(trimMesh);

        const recessMesh = new THREE.Mesh(this.geoLampRecess, this.matLampRecess);
        recessMesh.position.set(0, 0.005, 0);
        fixtureGroup.add(recessMesh);

        const glowMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: new THREE.Color(glowColor),
            emissiveIntensity: 0.85,
            roughness: 0.25
        });
        const glowMesh = new THREE.Mesh(this.geoLampGlow, glowMat);
        glowMesh.position.set(0, 0.002, 0);
        fixtureGroup.add(glowMesh);

        return fixtureGroup;
    }

    /**
     * Calcula el número de lados del polígono y el radio interior de una sala.
     * @param {object} room - Datos de la sala.
     * @returns {{ sides: number, inRadius: number }} Lados y radio interior.
     */
    _computeRoomGeometry(room) {
        const numPics = room.pictures ? room.pictures.length : 0;
        const pictureWalls = Math.max(3, numPics);
        const sides = pictureWalls + 1;
        const inRadius = Math.max(10.5, sides * 1.75);

        return { sides, inRadius };
    }

    /**
     * Construye la estructura geométrica completa de la galería (pasillo y salones poligonales).
     * @param {object} context - Objetos y subsistemas inyectados.
     * @returns {void}
     */
    buildGallery({ galleryData, galleryGroup, collisionSystem, raycasterManager, assetLoader, rotatingObjects, roomList, roomDoorData, minimapLayout }) {
        this.galleryData = galleryData;
        this.galleryGroup = galleryGroup;
        this.collisionSystem = collisionSystem;
        this.raycasterManager = raycasterManager;
        this.assetLoader = assetLoader;
        this.rotatingObjects = rotatingObjects;
        this.roomList = roomList;
        this.roomDoorData = roomDoorData;
        this.minimapLayout = minimapLayout;
const hemiLight = new THREE.HemisphereLight(0xfffaf0, 0xf1ede4, 0.72);
hemiLight.position.set(0, 20, 0);
this.galleryGroup.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xfffcf5, 0.38);
this.galleryGroup.add(ambientLight);

const hallWidth = 6.4;
const hallHeight = 5.0;
const wallThick = 0.5;
const doorWidth = 3.6;
const doorHeight = 4.0;
const roomGap = 4.0;
const firstRoomOffset = 13;

const leftRooms = galleryData.rooms.filter((_, idx) => idx % 2 === 0);
const rightRooms = galleryData.rooms.filter((_, idx) => idx % 2 !== 0);

const computeSidePositions = (rooms) => {
    const positions = [];
    let cursor = -firstRoomOffset;

    for (let i = 0; i < rooms.length; i++) {
        const { inRadius } = this._computeRoomGeometry(rooms[i]);

        if (i === 0) {
            positions.push(cursor);
        } else {
            const prevRadius = this._computeRoomGeometry(rooms[i - 1]).inRadius;
            cursor -= (prevRadius + inRadius + roomGap);
            positions.push(cursor);
        }
    }

    return positions;
};

const leftPositions = computeSidePositions(leftRooms);
const rightPositions = computeSidePositions(rightRooms);

let furthestZ = -firstRoomOffset;

for (let i = 0; i < leftRooms.length; i++) {
    const { inRadius } = this._computeRoomGeometry(leftRooms[i]);
    const z = leftPositions[i] - inRadius;
    if (z < furthestZ) furthestZ = z;
}

for (let i = 0; i < rightRooms.length; i++) {
    const { inRadius } = this._computeRoomGeometry(rightRooms[i]);
    const z = rightPositions[i] - inRadius;
    if (z < furthestZ) furthestZ = z;
}

const startZ = 6;
const endZ = furthestZ - roomGap;
const totalLength = Math.abs(endZ - startZ);

this.minimapLayout.startZ = startZ;
this.minimapLayout.endZ = endZ;
this.minimapLayout.hallWidth = hallWidth;

const floorBox = new THREE.Mesh(
new THREE.BoxGeometry(hallWidth, wallThick, totalLength),
this.matHallFloor
);
floorBox.position.set(0, -wallThick / 2, (startZ + endZ) / 2);
this.galleryGroup.add(floorBox);

const ceilBox = new THREE.Mesh(
new THREE.BoxGeometry(hallWidth, wallThick, totalLength),
this.matHallCeil
);
ceilBox.position.set(0, hallHeight + wallThick / 2, (startZ + endZ) / 2);
this.galleryGroup.add(ceilBox);

const lampSpacing = 5.0;
const margin = 2.4;
const usableLength = Math.max(1, totalLength - margin * 2);
const numLamps = Math.max(2, Math.round(usableLength / lampSpacing));

for (let i = 0; i <= numLamps; i++) {
const lz = (startZ - margin) - (i / numLamps) * usableLength;
const fixture = this.createCircularLamp(0xfffaed);
fixture.position.set(0, hallHeight - 0.01, lz);
this.galleryGroup.add(fixture);

const downLight = new THREE.SpotLight(0xfff7e6, 1.1, 14, Math.PI / 3.2, 0.85, 1.2);
downLight.position.set(0, hallHeight - 0.05, lz);
downLight.target.position.set(0, 0, lz);
this.galleryGroup.add(downLight);
this.galleryGroup.add(downLight.target);
}

const baseLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, totalLength), this.matFrameBorder);
baseLeft.position.set(-hallWidth / 2 + 0.04, 0.08, (startZ + endZ) / 2);
this.galleryGroup.add(baseLeft);

const baseRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, totalLength), this.matFrameBorder);
baseRight.position.set(hallWidth / 2 - 0.04, 0.08, (startZ + endZ) / 2);
this.galleryGroup.add(baseRight);

const backWall = new THREE.Mesh(new THREE.BoxGeometry(hallWidth + wallThick * 2, hallHeight, wallThick), this.matHallWall);
backWall.position.set(0, hallHeight / 2, startZ + wallThick / 2);
this.galleryGroup.add(backWall);
this.collisionSystem.addSegmentCollider(-hallWidth / 2, startZ, hallWidth / 2, startZ);

const frontWall = new THREE.Mesh(new THREE.BoxGeometry(hallWidth + wallThick * 2, hallHeight, wallThick), this.matHallWall);
frontWall.position.set(0, hallHeight / 2, endZ - wallThick / 2);
this.galleryGroup.add(frontWall);
this.collisionSystem.addSegmentCollider(-hallWidth / 2, endZ, hallWidth / 2, endZ);

const frameThick = 0.20;
const sideConfigs = [
    { sign: -1, rooms: leftRooms, positions: leftPositions },
    { sign: 1, rooms: rightRooms, positions: rightPositions }
];

sideConfigs.forEach(({ sign: sideSign, rooms: sideRooms, positions: zPositions }) => {
const xPos = sideSign * (hallWidth / 2 + wallThick / 2);
let currentZ = startZ;

sideRooms.forEach((room, roomIndex) => {
const targetZ = zPositions[roomIndex];
const openingHalfWidth = (doorWidth / 2) + frameThick;
const doorStartZ = targetZ + openingHalfWidth;
const doorEndZ = targetZ - openingHalfWidth;

const doorSpawnX = sideSign * (hallWidth / 2 - 1.2);
const spawnYaw = (sideSign === -1) ? Math.PI / 2 : -Math.PI / 2;
this.roomDoorData[room.id] = {
x: doorSpawnX,
z: targetZ,
yaw: spawnYaw
};

if (currentZ > doorStartZ) {
const segLen = currentZ - doorStartZ;
const segMidZ = currentZ - segLen / 2;
const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallThick, hallHeight, segLen), this.matHallWall);
wallMesh.position.set(xPos, hallHeight / 2, segMidZ);
this.galleryGroup.add(wallMesh);
this.collisionSystem.addSegmentCollider(sideSign * hallWidth / 2, currentZ, sideSign * hallWidth / 2, doorStartZ);
}

const lintelHeight = hallHeight - (doorHeight + frameThick);
if (lintelHeight > 0.05) {
const lintel = new THREE.Mesh(new THREE.BoxGeometry(wallThick, lintelHeight, doorWidth + frameThick * 2), this.matHallWall);
lintel.position.set(xPos, doorHeight + frameThick + lintelHeight / 2, targetZ);
this.galleryGroup.add(lintel);
}

this.buildDoorFrameAndPlacard(xPos, sideSign, targetZ, doorWidth, doorHeight, wallThick, frameThick, room.name);
this.buildRoom(room, sideSign, targetZ, hallWidth, hallHeight, doorWidth, doorHeight, wallThick);

currentZ = doorEndZ;
});

if (currentZ > endZ) {
const segLen = currentZ - endZ;
const segMidZ = currentZ - segLen / 2;
const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallThick, hallHeight, segLen), this.matHallWall);
wallMesh.position.set(xPos, hallHeight / 2, segMidZ);
this.galleryGroup.add(wallMesh);
this.collisionSystem.addSegmentCollider(sideSign * hallWidth / 2, currentZ, sideSign * hallWidth / 2, endZ);
}
});
}

buildDoorFrameAndPlacard(xPos, sideSign, zPos, doorWidth, doorHeight, wallThick, frameThick, roomName) {
const frameDepth = wallThick + 0.02;

const threshold = new THREE.Mesh(new THREE.BoxGeometry(wallThick, 0.02, doorWidth), this.matDoorThreshold);
threshold.position.set(xPos, 0.01, zPos);
this.galleryGroup.add(threshold);

const postGeo = new THREE.BoxGeometry(frameDepth, doorHeight, frameThick);
const leftPost = new THREE.Mesh(postGeo, this.matFrameBorder);
leftPost.position.set(xPos, doorHeight / 2, zPos + doorWidth / 2 + frameThick / 2);

const rightPost = new THREE.Mesh(postGeo, this.matFrameBorder);
rightPost.position.set(xPos, doorHeight / 2, zPos - (doorWidth / 2 + frameThick / 2));

this.galleryGroup.add(leftPost);
this.galleryGroup.add(rightPost);

const topBeamGeo = new THREE.BoxGeometry(frameDepth, frameThick, doorWidth + frameThick * 2);
const topBeam = new THREE.Mesh(topBeamGeo, this.matFrameBorder);
topBeam.position.set(xPos, doorHeight + frameThick / 2, zPos);
this.galleryGroup.add(topBeam);

const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 128;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 512, 128);
ctx.strokeStyle = '#facc15';
ctx.lineWidth = 10;
ctx.strokeRect(5, 5, 502, 118);

ctx.fillStyle = '#f8fafc';
ctx.font = 'bold 44px Inter, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(roomName.toUpperCase(), 256, 64);

const tex = new THREE.CanvasTexture(canvas);
const labelMat = new THREE.MeshStandardMaterial({ 
map: tex, 
roughness: 0.3,
polygonOffset: true,
polygonOffsetFactor: -1.0,
polygonOffsetUnits: -1.0
});
const labelMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.70, 2.6), labelMat);
labelMesh.position.set(xPos - sideSign * (wallThick / 2 + 0.05), doorHeight + 0.55, zPos);
this.galleryGroup.add(labelMesh);
}

buildRoom(room, sideSign, zCenter, hallWidth, hallHeight, doorWidth, doorHeight, wallThick) {
const numPics = room.pictures.length;
const picturesMap = {};
const pictureWalls = Math.max(3, numPics);

for (let p = 0; p < numPics; p++) {
picturesMap[p] = room.pictures[p];
}

const sides = pictureWalls + 1;
const inRadius = Math.max(10.5, sides * 1.75);
const angleStep = (2 * Math.PI) / sides;
const halfStep = angleStep / 2;
const vertexRadius = inRadius / Math.cos(halfStep);

const corridorLength = 5.0;
const roomCenterX = sideSign * (hallWidth / 2 + corridorLength + inRadius);
const roomCenterZ = zCenter;

const roomGroup = new THREE.Group();
roomGroup.position.set(roomCenterX, 0, roomCenterZ);
const roomLights = [];
const roomPicMeshes = [];

const roomWallTexture = createThematicRoomWallTexture(room.color || '#ece8e1');
const roomWallMat = new THREE.MeshStandardMaterial({
map: roomWallTexture,
roughness: 0.78,
            metalness: 0.02
});
const roomFloorMat = this.matHallFloor;
const roomCeilMat = this.matHallCeil;

const baseAngle = (sideSign === -1) ? 0 : Math.PI;

const localVertices = [];
const worldVertices = [];
for (let i = 0; i < sides; i++) {
const angle = baseAngle - halfStep + i * angleStep;
const vx = Math.cos(angle) * vertexRadius;
const vz = Math.sin(angle) * vertexRadius;
localVertices.push({ x: vx, z: vz });
worldVertices.push({ x: roomCenterX + vx, z: roomCenterZ + vz });
}

const floorShape = new THREE.Shape();
for (let i = 0; i < sides; i++) {
const v = localVertices[i];
if (i === 0) floorShape.moveTo(v.x, v.z);
else floorShape.lineTo(v.x, v.z);
}
floorShape.closePath();

const extrudeSettings = { depth: wallThick, bevelEnabled: false };
const floorGeo = new THREE.ExtrudeGeometry(floorShape, extrudeSettings);
floorGeo.rotateX(Math.PI / 2);

const roomFloorMesh = new THREE.Mesh(floorGeo, roomFloorMat);
roomFloorMesh.position.set(0, 0, 0);
roomGroup.add(roomFloorMesh);

const roomCeilMesh = new THREE.Mesh(floorGeo, roomCeilMat);
roomCeilMesh.position.set(0, hallHeight + wallThick, 0);
roomGroup.add(roomCeilMesh);

const lightColorHex = room.lightColor || '#ffffff';
const lightColor = new THREE.Color(lightColorHex);

const roomPointLight = new THREE.PointLight(lightColorHex, 3.2, inRadius * 2.8, 1.25);
roomPointLight.position.set(0, hallHeight - 0.4, 0);
roomGroup.add(roomPointLight);
roomLights.push(roomPointLight);

const roomAccentLight = new THREE.PointLight(lightColorHex, 1.6, inRadius * 1.6, 1.4);
roomAccentLight.position.set(0, 1.9, 0);
roomGroup.add(roomAccentLight);
roomLights.push(roomAccentLight);

const centerLamp = this.createCircularLamp(lightColorHex);
centerLamp.position.set(0, hallHeight - 0.01, 0);
roomGroup.add(centerLamp);

for (let i = 0; i < sides; i++) {
const v1 = localVertices[i];
const v2 = localVertices[(i + 1) % sides];
const edgeMidX = (v1.x + v2.x) / 2;
const edgeMidZ = (v1.z + v2.z) / 2;

const lampX = edgeMidX * 0.70;
const lampZ = edgeMidZ * 0.70;

const sideLamp = this.createCircularLamp(lightColorHex);
sideLamp.position.set(lampX, hallHeight - 0.01, lampZ);
roomGroup.add(sideLamp);
}

const pedGeo = new THREE.CylinderGeometry(1.2, 1.5, 1.2, 20);
const pedMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.35, metalness: 0.3 });
const pedestal = new THREE.Mesh(pedGeo, pedMat);
pedestal.position.set(0, 0.6, 0);
roomGroup.add(pedestal);

const baseRadius = Math.max(1.7, 1.5 * (room.objectScale || 1.0));
const obstacle = {
roomId: room.id,
x: roomCenterX,
z: roomCenterZ,
radius: baseRadius
};
        this.collisionSystem.obstacleColliders.push(obstacle);

if (room.object) {
const handleRoomObj = (obj) => {
this.assetLoader.normalizeAndEnhanceMesh(obj);
const box = new THREE.Box3().setFromObject(obj);
const size = box.getSize(new THREE.Vector3());
const maxDim = Math.max(size.x, size.y, size.z);
const norm = maxDim > 0 ? 2.0 / maxDim : 1.0;
const scaleVal = (room.objectScale !== undefined ? room.objectScale : 1.0);
obj.scale.setScalar(norm * scaleVal);

const scaledBox = new THREE.Box3().setFromObject(obj);
const center = scaledBox.getCenter(new THREE.Vector3());
const scaledSize = scaledBox.getSize(new THREE.Vector3());

obj.position.set(-center.x, 1.2 + scaledSize.y / 2 - center.y, -center.z);
roomGroup.add(obj);
this.rotatingObjects.push(obj);

const modelRadius = Math.max(1.7, Math.max(scaledSize.x, scaledSize.z) / 2 + 0.3);
obstacle.radius = modelRadius;
};

try {
const source = room.object;
                        if (typeof source === 'string' && (source.includes('\nv ') || source.includes('\nf ') || source.startsWith('v ') || source.startsWith('#'))) {
                            const parsed = this.assetLoader.objLoader.parse(source);
handleRoomObj(parsed);
} else if (typeof source === 'string' && source.startsWith('data:')) {
const base64Index = source.indexOf(';base64,');
if (base64Index !== -1) {
const decoded = atob(source.substring(base64Index + 8));
const parsed = this.assetLoader.objLoader.parse(decoded);
handleRoomObj(parsed);
} else {
this.assetLoader.objLoader.load(source, handleRoomObj);
}
} else {
this.assetLoader.objLoader.load(source, handleRoomObj);
}
} catch(e) {
console.error('Error al cargar objeto 3D del salón:', e);
}
} else {
const defObj = new THREE.Mesh(
new THREE.TorusKnotGeometry(0.75, 0.25, 80, 16),
new THREE.MeshStandardMaterial({ 
color: 0xfacc15, 
metalness: 0.6, 
roughness: 0.2,
emissive: 0xb45309,
emissiveIntensity: 0.25
})
);
defObj.position.set(0, 2.3, 0);
defObj.scale.setScalar(room.objectScale || 1.0);
roomGroup.add(defObj);
this.rotatingObjects.push(defObj);
}

const partGeo = new THREE.BufferGeometry();
const count = 75;
const pos = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
pos[i] = (Math.random() - 0.5) * 4;
pos[i + 1] = Math.random() * 3.5 + 1.2;
pos[i + 2] = (Math.random() - 0.5) * 4;
}
partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const partMat = new THREE.PointsMaterial({
size: 0.07,
color: lightColor,
transparent: true,
opacity: 0.75
});
const particles = new THREE.Points(partGeo, partMat);
roomGroup.add(particles);
this.rotatingObjects.push(particles);

for (let i = 0; i < sides; i++) {
const v1 = localVertices[i];
const v2 = localVertices[(i + 1) % sides];

const edgeMidX = (v1.x + v2.x) / 2;
const edgeMidZ = (v1.z + v2.z) / 2;
const edgeLen = Math.hypot(v2.x - v1.x, v2.z - v1.z);

if (i === 0) {
const sidePieceWidth = (edgeLen - doorWidth) / 2;
const lintelH = hallHeight - doorHeight;

if (sidePieceWidth > 0.05) {
const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, hallHeight, wallThick), roomWallMat);
wallLeft.position.set(edgeMidX, hallHeight / 2, edgeMidZ);
wallLeft.lookAt(0, hallHeight / 2, 0);
wallLeft.translateX(-(doorWidth + sidePieceWidth) / 2);
roomGroup.add(wallLeft);

const wallRight = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, hallHeight, wallThick), roomWallMat);
wallRight.position.set(edgeMidX, hallHeight / 2, edgeMidZ);
wallRight.lookAt(0, hallHeight / 2, 0);
wallRight.translateX((doorWidth + sidePieceWidth) / 2);
roomGroup.add(wallRight);

const wV1 = worldVertices[0];
const wV2 = worldVertices[1];
const dirX = (wV2.x - wV1.x) / edgeLen;
const dirZ = (wV2.z - wV1.z) / edgeLen;

this.collisionSystem.addSegmentCollider(wV1.x, wV1.z, wV1.x + dirX * sidePieceWidth, wV1.z + dirZ * sidePieceWidth);
this.collisionSystem.addSegmentCollider(wV2.x - dirX * sidePieceWidth, wV2.z - dirZ * sidePieceWidth, wV2.x, wV2.z);
}

if (lintelH > 0.01) {
const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + 0.1, lintelH, wallThick), roomWallMat);
lintel.position.set(edgeMidX, doorHeight + lintelH / 2, edgeMidZ);
lintel.lookAt(0, hallHeight / 2, 0);
roomGroup.add(lintel);
}

continue;
}

const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(edgeLen + 0.02, hallHeight, wallThick), roomWallMat);
wallMesh.position.set(edgeMidX, hallHeight / 2, edgeMidZ);
wallMesh.lookAt(0, hallHeight / 2, 0);
roomGroup.add(wallMesh);

const roomCornice = new THREE.Mesh(new THREE.BoxGeometry(edgeLen + 0.02, 0.14, 0.12), this.matFrameBorder);
roomCornice.position.set(0, hallHeight / 2 - 0.07, wallThick / 2 + 0.06);
wallMesh.add(roomCornice);

const wV1 = worldVertices[i];
const wV2 = worldVertices[(i + 1) % sides];
this.collisionSystem.addSegmentCollider(wV1.x, wV1.z, wV2.x, wV2.z);

const pictureIndex = i - 1;
const pictureData = picturesMap[pictureIndex] || null;
this.buildPictureOnWall(pictureData, wallMesh, edgeLen, hallHeight, pictureIndex + 1, wallThick, roomPicMeshes);
}

this.buildConnectingCorridor(
sideSign, zCenter, hallWidth, hallHeight, doorWidth, wallThick,
roomCenterX, roomCenterZ, inRadius, roomWallMat, roomFloorMat
);

this.minimapLayout.rooms.push({
id: room.id,
x: roomCenterX,
z: roomCenterZ,
radius: inRadius,
name: room.name,
sideSign: sideSign,
color: room.color || '#facc15',
vertices: worldVertices
});

const doorEntranceX = sideSign * (hallWidth / 2);
const boundCenterX = (roomCenterX + doorEntranceX) / 2;
const totalSpan = Math.abs(roomCenterX + sideSign * inRadius - doorEntranceX);
const boundRadius = (totalSpan / 2) + inRadius + 8.0;

const roomBoundingSphere = new THREE.Sphere(
new THREE.Vector3(boundCenterX, hallHeight / 2, roomCenterZ),
boundRadius
);

const portalBox = new THREE.Box3(
new THREE.Vector3(
doorEntranceX - (sideSign === 1 ? 0.4 : 0.1),
0,
zCenter - (doorWidth / 2 + 0.2)
),
new THREE.Vector3(
doorEntranceX + (sideSign === 1 ? 0.1 : 0.4),
doorHeight + 0.2,
zCenter + (doorWidth / 2 + 0.2)
)
);

this.roomList.push({
id: room.id,
name: room.name || '',
description: room.description || '',
x: roomCenterX,
z: roomCenterZ,
doorX: doorEntranceX,
doorZ: zCenter,
radius: inRadius,
sideSign: sideSign,
object3D: roomGroup,
sphere: roomBoundingSphere,
portalBox: portalBox,
lights: roomLights,
picMeshes: roomPicMeshes,
soundtrackSrc: room.soundtrackSrc || null
});

this.galleryGroup.add(roomGroup);
}

buildConnectingCorridor(sideSign, zCenter, hallWidth, hallHeight, doorWidth, wallThick, roomCenterX, roomCenterZ, inRadius, wallMat, floorMat) {
const corrStartX = sideSign * (hallWidth / 2 + wallThick);
const roomEntranceX = roomCenterX - sideSign * inRadius;
const corrLen = Math.abs(roomEntranceX - corrStartX);
const corrMidX = (corrStartX + roomEntranceX) / 2;

const corrFloor = new THREE.Mesh(new THREE.BoxGeometry(corrLen, wallThick, doorWidth), floorMat);
corrFloor.position.set(corrMidX, -wallThick / 2, zCenter);
this.galleryGroup.add(corrFloor);

const corrCeil = new THREE.Mesh(new THREE.BoxGeometry(corrLen, wallThick, doorWidth), this.matHallCeil);
corrCeil.position.set(corrMidX, hallHeight + wallThick / 2, zCenter);
this.galleryGroup.add(corrCeil);

const sideWallGeo = new THREE.BoxGeometry(corrLen, hallHeight, wallThick);

const wallNorth = new THREE.Mesh(sideWallGeo, wallMat);
wallNorth.position.set(corrMidX, hallHeight / 2, zCenter + doorWidth / 2 + wallThick / 2);
this.galleryGroup.add(wallNorth);
this.collisionSystem.addSegmentCollider(corrStartX, zCenter + doorWidth / 2, roomEntranceX, zCenter + doorWidth / 2);

const wallSouth = new THREE.Mesh(sideWallGeo, wallMat);
wallSouth.position.set(corrMidX, hallHeight / 2, zCenter - doorWidth / 2 - wallThick / 2);
this.galleryGroup.add(wallSouth);
this.collisionSystem.addSegmentCollider(corrStartX, zCenter - doorWidth / 2, roomEntranceX, zCenter - doorWidth / 2);
}

buildPictureOnWall(picData, wallMesh, maxWallWidth, hallHeight, wallNumber, wallThick, roomPicMeshes = null) {
    if (!picData || !picData.src) {
        return;
    }

    const maxW = maxWallWidth * 0.72;
    const maxH = hallHeight * 0.58;

    const frameDepth = 0.08;      // Relieve y profundidad del marco
    const moldingWidth = 0.12;    // Ancho de las molduras perimetrales
    const zBase = (wallThick / 2) + (frameDepth / 2) + 0.005;

    const frameColor = picData.frameColor || '#eab308';
    const frameMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(frameColor),
        roughness: 0.32,
        metalness: 0.35
    });

    const passepartoutMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.85,
        metalness: 0.05
    });

    let w = Math.min(3.4, maxW);
    let h = Math.min(2.4, maxH);

    const frameGroup = new THREE.Group();
    frameGroup.position.set(0, 0, zBase);

    // 1. Tablero de fondo (Passepartout / Backing plate)
    const backplateMesh = new THREE.Mesh(
        new THREE.BoxGeometry(w + moldingWidth * 2, h + moldingWidth * 2, 0.02),
        passepartoutMat
    );
    backplateMesh.position.set(0, 0, -frameDepth / 2 + 0.01);
    frameGroup.add(backplateMesh);

    // 2. Las 4 molduras perimetrales que forman el marco 3D hueco en relieve
    const topMolding = new THREE.Mesh(
        new THREE.BoxGeometry(w + moldingWidth * 2, moldingWidth, frameDepth),
        frameMat
    );
    topMolding.position.set(0, h / 2 + moldingWidth / 2, 0);

    const bottomMolding = new THREE.Mesh(
        new THREE.BoxGeometry(w + moldingWidth * 2, moldingWidth, frameDepth),
        frameMat
    );
    bottomMolding.position.set(0, -h / 2 - moldingWidth / 2, 0);

    const leftMolding = new THREE.Mesh(
        new THREE.BoxGeometry(moldingWidth, h, frameDepth),
        frameMat
    );
    leftMolding.position.set(-w / 2 - moldingWidth / 2, 0, 0);

    const rightMolding = new THREE.Mesh(
        new THREE.BoxGeometry(moldingWidth, h, frameDepth),
        frameMat
    );
    rightMolding.position.set(w / 2 + moldingWidth / 2, 0, 0);

    frameGroup.add(topMolding);
    frameGroup.add(bottomMolding);
    frameGroup.add(leftMolding);
    frameGroup.add(rightMolding);

    // 3. El lienzo de la obra (encajado dentro de la cavidad del marco 3D)
    const picGeo = new THREE.PlaneGeometry(w, h);
    const picMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.FrontSide
    });
    const picMesh = new THREE.Mesh(picGeo, picMat);
    picMesh.position.set(0, 0, -frameDepth / 2 + 0.022);

    picMesh.userData = {
        isPicture: true,
        name: picData.name || 'Obra de Arte',
        description: picData.description || ''
    };
    frameGroup.add(picMesh);

    // 4. Placa de título con su propio marco miniatura
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 512;
    pCanvas.height = 100;
    const pCtx = pCanvas.getContext('2d');
    pCtx.fillStyle = '#0f172a';
    pCtx.fillRect(0, 0, 512, 100);
    pCtx.strokeStyle = '#facc15';
    pCtx.lineWidth = 6;
    pCtx.strokeRect(4, 4, 504, 92);

    pCtx.fillStyle = '#f8fafc';
    pCtx.font = 'bold 36px Inter, sans-serif';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    let displayTitle = picData.name || 'Sin título';
    if (displayTitle.length > 22) {
        displayTitle = displayTitle.substring(0, 20) + '…';
    }
    pCtx.fillText(displayTitle, 256, 50);

    const pTex = new THREE.CanvasTexture(pCanvas);
    pTex.colorSpace = THREE.SRGBColorSpace;
    const plaqueMat = new THREE.MeshStandardMaterial({
        map: pTex,
        roughness: 0.3,
        metalness: 0.2
    });

    let plaqueW = Math.min(w * 0.85, 2.2);
    let plaqueH = Math.max(0.24, plaqueW * (100 / 512));

    const plaqueBaseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(plaqueW + 0.06, plaqueH + 0.04, 0.03),
        frameMat
    );
    const plaqueY = -h / 2 - moldingWidth - (plaqueH / 2 + 0.12);
    plaqueBaseMesh.position.set(0, plaqueY, 0);

    const plaqueGeo = new THREE.PlaneGeometry(plaqueW, plaqueH);
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.position.set(0, plaqueY, 0.018);
    plaqueMesh.userData = picMesh.userData;

    frameGroup.add(plaqueBaseMesh);
    frameGroup.add(plaqueMesh);

    wallMesh.add(frameGroup);
    if (roomPicMeshes) {
        roomPicMeshes.push(picMesh);
        roomPicMeshes.push(plaqueMesh);
    }

    // 5. Carga de textura y ajuste proporcional dinámico
    this.assetLoader.textureLoader.setCrossOrigin('anonymous');
    this.assetLoader.textureLoader.load(
        picData.src,
        (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.needsUpdate = true;
            picMat.map = tex;
            picMat.needsUpdate = true;

            const img = tex.image;
            if (img && img.width && img.height) {
                const aspect = img.width / img.height;
                let newW = maxW;
                let newH = newW / aspect;
                if (newH > maxH) {
                    newH = maxH;
                    newW = newH * aspect;
                }

                backplateMesh.geometry.dispose();
                backplateMesh.geometry = new THREE.BoxGeometry(newW + moldingWidth * 2, newH + moldingWidth * 2, 0.02);

                topMolding.geometry.dispose();
                topMolding.geometry = new THREE.BoxGeometry(newW + moldingWidth * 2, moldingWidth, frameDepth);
                topMolding.position.set(0, newH / 2 + moldingWidth / 2, 0);

                bottomMolding.geometry.dispose();
                bottomMolding.geometry = new THREE.BoxGeometry(newW + moldingWidth * 2, moldingWidth, frameDepth);
                bottomMolding.position.set(0, -newH / 2 - moldingWidth / 2, 0);

                leftMolding.geometry.dispose();
                leftMolding.geometry = new THREE.BoxGeometry(moldingWidth, newH, frameDepth);
                leftMolding.position.set(-newW / 2 - moldingWidth / 2, 0, 0);

                rightMolding.geometry.dispose();
                rightMolding.geometry = new THREE.BoxGeometry(moldingWidth, newH, frameDepth);
                rightMolding.position.set(newW / 2 + moldingWidth / 2, 0, 0);

                picMesh.geometry.dispose();
                picMesh.geometry = new THREE.PlaneGeometry(newW, newH);

                const updatedPlaqueW = Math.min(newW * 0.85, 2.2);
                const updatedPlaqueH = Math.max(0.24, updatedPlaqueW * (100 / 512));
                const updatedPlaqueY = -newH / 2 - moldingWidth - (updatedPlaqueH / 2 + 0.12);

                plaqueBaseMesh.geometry.dispose();
                plaqueBaseMesh.geometry = new THREE.BoxGeometry(updatedPlaqueW + 0.06, updatedPlaqueH + 0.04, 0.03);
                plaqueBaseMesh.position.set(0, updatedPlaqueY, 0);

                plaqueMesh.geometry.dispose();
                plaqueMesh.geometry = new THREE.PlaneGeometry(updatedPlaqueW, updatedPlaqueH);
                plaqueMesh.position.set(0, updatedPlaqueY, 0.018);
            }
        },
        undefined,
        (err) => {
            console.warn('Error al cargar imagen del cuadro:', picData.src, err);
        }
    );
}
}

export { GalleryBuilder };
