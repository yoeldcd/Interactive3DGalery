/**
 * @file threejs_engine.js
 * @description Orquestador principal del motor 3D Three.js.
 * Coordina escena, cámara, renderizador WebGL, controles PointerLock,
 * culling de salas, ciclo de animación y delega a subsistemas especializados.
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { AssetLoader } from './asset_loader.js';
import { CollisionSystem } from './collision_system.js';
import { RaycasterManager } from './raycaster_manager.js';
import { MinimapRenderer } from './minimap_renderer.js';
import { GalleryBuilder } from './gallery_builder.js';

/**
 * Orquestador principal ThreeJSEngine.
 */
class ThreeJSEngine {

    /**
     * @param {string} containerId - ID del contenedor DOM para el lienzo WebGL.
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 120);
        this.camera.position.set(0, 1.7, 4);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
            precision: 'highp',
            powerPreference: 'high-performance'
        });

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
        const maxDpr = isMobile ? 1.25 : 1.75;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);

        this.controls = new PointerLockControls(this.camera, document.body);

        this.projScreenMatrix = new THREE.Matrix4();
        this.frustum = new THREE.Frustum();

        // Subsistemas modulares
        this.assetLoader = new AssetLoader();
        this.collisionSystem = new CollisionSystem();
        this.raycasterManager = new RaycasterManager();
        this.minimapRenderer = new MinimapRenderer('minimap-canvas');
        this.galleryBuilder = new GalleryBuilder();

        this.galleryGroup = new THREE.Group();
        this.scene.add(this.galleryGroup);

        this.playerRadius = 0.45;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveForward = false;
        this.moveBackward = false;
        this.turnLeft = false;
        this.turnRight = false;
        this.prevTime = performance.now();
        this.lastMinimapUpdate = 0;

        this.baseCameraY = 1.7;
        this.bobTimer = 0;
        this.bobOffset = 0;

        this.rotatingObjects = [];
        this.roomList = [];
        this.roomDoorData = {};

        this.minimapLayout = {
            startZ: 0,
            endZ: 0,
            hallWidth: 6.4,
            rooms: []
        };

        this.onLookAtPicture = null;

        this.currentInsideRoom = null;
        this.roomAudioElements = {};
        this.roomAudioVolume = 0.5;

        this.isSpectatorActive = false;
        this.setupEventListeners();
        this.animate();
    }

    /**
     * Accesor al cargador OBJLoader subyacente.
     * @returns {import('three/addons/loaders/OBJLoader.js').OBJLoader}
     */
    get objLoader() {
        return this.assetLoader.objLoader;
    }

    /**
     * Delega la normalización del objeto 3D al AssetLoader.
     * @param {THREE.Object3D} obj - Objeto 3D a normalizar.
     * @param {number} [customColor=0xfacc15] - Color hexadecimal base.
     * @returns {void}
     */
    normalizeAndEnhanceMesh(obj, customColor = 0xfacc15) {
        this.assetLoader.normalizeAndEnhanceMesh(obj, customColor);
    }

    /**
     * Configura los listeners de teclado, táctiles y redimensionamiento.
     * @returns {void}
     */
    setupEventListeners() {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.turnLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.turnRight = true;
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.turnLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.turnRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        // Control de orientación y vista por deslizamiento táctil (Touch Look)
        let touchLookId = null;
        let prevTouchX = 0;
        let prevTouchY = 0;
        const lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');

        const onTouchStart = (e) => {
            if (!this.isSpectatorActive && !this.controls.isLocked) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                if (target && target.closest('button, input, textarea, select, a, label, #modal-container, #virtual-dpad-container, #minimap-container')) {
                    continue;
                }
                if (touchLookId === null) {
                    touchLookId = touch.identifier;
                    prevTouchX = touch.clientX;
                    prevTouchY = touch.clientY;
                    break;
                }
            }
        };

        const onTouchMove = (e) => {
            if (touchLookId === null) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === touchLookId) {
                    const deltaX = touch.clientX - prevTouchX;
                    const deltaY = touch.clientY - prevTouchY;
                    prevTouchX = touch.clientX;
                    prevTouchY = touch.clientY;

                    const sensitivity = 0.0020;
                    lookEuler.setFromQuaternion(this.camera.quaternion);
                    lookEuler.y -= deltaX * sensitivity;
                    lookEuler.x -= deltaY * sensitivity;
                    lookEuler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, lookEuler.x));
                    lookEuler.z = 0;
                    this.camera.quaternion.setFromEuler(lookEuler);
                    this.camera.rotation.copy(lookEuler);
                    this.camera.updateMatrixWorld();
                    break;
                }
            }
        };

        const onTouchEnd = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === touchLookId) {
                    touchLookId = null;
                    break;
                }
            }
        };

        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('touchcancel', onTouchEnd, { passive: true });

        window.addEventListener('resize', () => {
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
            const maxDpr = isMobile ? 1.25 : 1.75;
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        let lastUnlockTime = 0;
        this.controls.addEventListener('unlock', () => {
            lastUnlockTime = performance.now();
        });

        window.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button, input, textarea, select, a, label, #modal-container, #virtual-dpad-container')) {
                return;
            }

            // En dispositivos / eventos táctiles ('touch'), NO bloquear el cursor para no interferir con la cruceta o gestos táctiles
            if (e.pointerType === 'touch' || navigator.maxTouchPoints > 0) {
                const minimap = document.getElementById('minimap-container');
                if (minimap && minimap.style.display !== 'none') {
                    const overlay = document.getElementById('click-to-play-overlay');
                    if (overlay) overlay.style.display = 'none';
                    this.isSpectatorActive = true;
                }
                return;
            }

            if (this.controls.isLocked) {
                this.controls.unlock();
            } else {
                if (performance.now() - lastUnlockTime > 150) {
                    const minimap = document.getElementById('minimap-container');
                    if (minimap && minimap.style.display !== 'none') {
                        const overlay = document.getElementById('click-to-play-overlay');
                        if (overlay) overlay.style.display = 'none';
                        this.isSpectatorActive = true;
                        try {
                            this.controls.lock();
                        } catch (err) {}
                    }
                }
            }
        });
    }

    /**
     * Limpia la galería actual y restablece los colisionadores y objetos.
     * @returns {void}
     */
    clearGallery() {
        while (this.galleryGroup.children.length > 0) {
            const obj = this.galleryGroup.children[0];
            this.galleryGroup.remove(obj);
        }
        this.collisionSystem.clear();
        this.raycasterManager.clear();
        this.rotatingObjects = [];
        this.roomList = [];
        this.roomDoorData = {};
        if (this.minimapLayout) {
            this.minimapLayout.rooms = [];
        }
    }

    /**
     * Construye la galería utilizando el GalleryBuilder.
     * @param {object} galleryData - Datos completos de la galería.
     * @returns {void}
     */
    buildGallery(galleryData) {
        this.clearGallery();
        this.galleryBuilder.buildGallery({
            galleryData,
            galleryGroup: this.galleryGroup,
            collisionSystem: this.collisionSystem,
            raycasterManager: this.raycasterManager,
            assetLoader: this.assetLoader,
            rotatingObjects: this.rotatingObjects,
            roomList: this.roomList,
            roomDoorData: this.roomDoorData,
            minimapLayout: this.minimapLayout
        });
        this.minimapRenderer.setLayout(this.minimapLayout, this.roomList);
    }

    /**
     * Renderiza el minimapa en el lienzo 2D.
     * @returns {void}
     */
    renderMinimap() {
        this.minimapRenderer.setLayout(this.minimapLayout, this.roomList);
        this.minimapRenderer.render(this.camera);
    }

    /**
     * Bucle principal de renderizado y animación con culling dinámico de salas.
     * @returns {void}
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now();
        const delta = Math.min((time - this.prevTime) / 1000, 0.1);

        const playerX = this.camera.position.x;
        const playerZ = this.camera.position.z;
        const hw = this.minimapLayout ? (this.minimapLayout.hallWidth / 2) : 3.2;

        let insideRoom = null;

        for (let i = 0; i < this.roomList.length; i++) {
            const r = this.roomList[i];
            const distToCenter = Math.hypot(playerX - r.x, playerZ - r.z);
            const inCorridor = (Math.abs(playerZ - r.doorZ) <= 2.2 && Math.sign(playerX) === r.sideSign && Math.abs(playerX) >= (hw - 0.4));

            if (distToCenter <= r.radius + 1.2 || inCorridor) {
                insideRoom = r;
                break;
            }
        }

        if (insideRoom !== this.currentInsideRoom) {
            if (this.currentInsideRoom && this.currentInsideRoom.soundtrackSrc) {
                const prevAudio = this.roomAudioElements[this.currentInsideRoom.id];
                if (prevAudio) {
                    prevAudio.pause();
                }
            }

            if (insideRoom && insideRoom.soundtrackSrc) {
                let audio = this.roomAudioElements[insideRoom.id];
                if (!audio) {
                    audio = new Audio(insideRoom.soundtrackSrc);
                    audio.loop = true;
                    audio.volume = this.roomAudioVolume;
                    this.roomAudioElements[insideRoom.id] = audio;
                }
                audio.play().catch(() => {});
            }

            this.currentInsideRoom = insideRoom;
        }

        this.camera.updateMatrixWorld(true);
        this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert();
        this.projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        this.frustum.setFromProjectionMatrix(this.projScreenMatrix);

        const camDir = new THREE.Vector3();
        this.camera.getWorldDirection(camDir);

        this.raycasterManager.clear();
        const MAX_HALLWAY_VIEW_DIST = 7.5;

        for (let i = 0; i < this.roomList.length; i++) {
            const r = this.roomList[i];
            let shouldRender = false;

            if (r === insideRoom) {
                shouldRender = true;
            } else {
                const distZ = Math.abs(playerZ - r.doorZ);
                if (distZ <= MAX_HALLWAY_VIEW_DIST) {
                    const toDoorX = r.doorX - playerX;
                    const toDoorZ = r.doorZ - playerZ;
                    const forwardDot = toDoorX * camDir.x + toDoorZ * camDir.z;

                    if (forwardDot > 0.1 && r.portalBox && this.frustum.intersectsBox(r.portalBox)) {
                        shouldRender = true;
                    }
                }
            }

            if (r.object3D.visible !== shouldRender) {
                r.object3D.visible = shouldRender;
            }

            if (r.lights && r.lights.length > 0) {
                for (let j = 0; j < r.lights.length; j++) {
                    r.lights[j].visible = shouldRender;
                }
            }

            if (shouldRender && r.picMeshes) {
                for (let k = 0; k < r.picMeshes.length; k++) {
                    this.raycasterManager.registerTarget(r.picMeshes[k]);
                }
            }
        }

        this.rotatingObjects.forEach(obj => {
            let parent = obj.parent;
            let isParentVisible = true;
            while (parent && parent !== this.scene) {
                if (parent.visible === false) {
                    isParentVisible = false;
                    break;
                }
                parent = parent.parent;
            }
            if (isParentVisible) {
                obj.rotation.y += 0.4 * delta;
            }
        });

        const canMove = this.controls.isLocked || this.isSpectatorActive;
        if (canMove) {
            this.collisionSystem.updateMovement({
                camera: this.camera,
                controls: this.controls,
                velocity: this.velocity,
                direction: this.direction,
                moveForward: this.moveForward,
                moveBackward: this.moveBackward,
                turnLeft: this.turnLeft,
                turnRight: this.turnRight,
                delta,
                playerRadius: this.playerRadius
            });

            // Efecto de balanceo de cámara (Head Bobbing)
            const isMoving = this.moveForward || this.moveBackward;
            if (isMoving) {
                this.bobTimer += delta * 12.0;
                this.bobOffset = Math.sin(this.bobTimer) * 0.045;
            } else {
                this.bobOffset = THREE.MathUtils.lerp(this.bobOffset, 0, delta * 10.0);
            }
            this.camera.position.y = this.baseCameraY + this.bobOffset;
        }

        this.raycasterManager.update(this.camera, this.onLookAtPicture);

        const minimapInterval = (navigator.maxTouchPoints > 0) ? 66 : 33;
        if (time - this.lastMinimapUpdate > minimapInterval) {
            this.renderMinimap();
            this.lastMinimapUpdate = time;
        }

        this.prevTime = time;
        this.renderer.render(this.scene, this.camera);
    }
}

export { ThreeJSEngine };
