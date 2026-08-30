/**
 * @file ui_manager.js
 * @description Gestor de interfaz de usuario (UIManager) que coordina los layouts, modales,
 * eventos del DOM, transiciones de vista y comunicación con el estado y motor 3D.
 */

import { StartLayout } from './layouts/start_layout.js';
import { SpectatorLayout } from './layouts/spectator_layout.js';
import { EditorLayout } from './layouts/editor_layout.js';
import { RoomConfigModal } from './modals/room_config_modal.js';
import { PictureEditModal } from './modals/picture_edit_modal.js';
import { ConfirmDialog } from './modals/confirm_dialog.js';
import { InfoModal } from './modals/info_modal.js';
import { LoadingOverlay } from './modals/loading_overlay.js';
import { readFileAsDataURL } from '../infrastructure/utils/file_utils.js';

export class UIManager {
    /**
     * @param {import('../application/state/app_state.js').AppState} appState - Gestor de estado de la aplicación.
     * @param {import('../infrastructure/rendering/threejs_engine.js').ThreeJSEngine} engine3D - Motor de renderizado 3D.
     */
    constructor(appState, engine3D) {
        this.state = appState;
        this.engine = engine3D;
        this.layer = document.getElementById('ui-layer');
        this.hasVisitedOnce = false;
        this.currentConfiguredObject = null;
        
        this.state.onStateChange = () => this.render();
        this.state.onSpectatorEnter = (targetRoomId) => this.enterSpectatorMode(targetRoomId);
        this.engine.onLookAtPicture = (data) => this.updateHUD(data);

        this.layer.addEventListener('click', (e) => this.handleClick(e));
        this.layer.addEventListener('change', (e) => this.handleChange(e));
        this.layer.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.layer.addEventListener('focusout', (e) => this.handleFocusOut(e));
        this.layer.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.layer.addEventListener('drop', (e) => this.handleDrop(e));
        document.addEventListener('paste', (e) => this.handlePaste(e));
    }

    canAddPictures() {
        return this.state.currentMode === 'EDITOR' && Boolean(this.state.selectedRoomId);
    }

    handleDragOver(e) {
        if (this.canAddPictures() && Array.from(e.dataTransfer?.items || []).some(item => item.type.startsWith('image/'))) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }
    }

    async handleDrop(e) {
        const files = Array.from(e.dataTransfer?.files || []).filter(file => file.type.startsWith('image/'));
        if (!this.canAddPictures() || files.length === 0) return;

        e.preventDefault();
        await this.addPictureFiles(files);
    }

    async handlePaste(e) {
        const files = Array.from(e.clipboardData?.items || [])
            .filter(item => item.type.startsWith('image/'))
            .map(item => item.getAsFile())
            .filter(Boolean);
        if (!this.canAddPictures() || files.length === 0) return;

        e.preventDefault();
        await this.addPictureFiles(files);
    }

    async addPictureFiles(files) {
        const room = this.state.gallery.rooms.find(r => r.id === this.state.selectedRoomId);
        if (!room) return;

        const startIdx = room.pictures.length;
        const picturesToLoad = [];
        for (let i = 0; i < files.length; i++) {
            try {
                const src = await readFileAsDataURL(files[i]);
                picturesToLoad.push({
                    name: `image${startIdx + i + 1}`,
                    description: '',
                    frameColor: '#eab308',
                    src
                });
            } catch (err) {
                console.error('Error al cargar imagen', err);
            }
        }

        if (picturesToLoad.length > 0) {
            this.state.addPictures(this.state.selectedRoomId, picturesToLoad);
        }
    }

    handleKeyDown(e) {
        if (e.target && e.target.id === 'gallery-title-input' && e.key === 'Enter') {
            e.preventDefault();
            const newName = e.target.value.trim() || 'Mi Galería Virtual';
            e.target.value = newName;
            this.state.gallery.name = newName;
            this.state.save();
            e.target.blur();
        }
    }

    handleFocusOut(e) {
        if (e.target && e.target.id === 'gallery-title-input') {
            const newName = e.target.value.trim() || 'Mi Galería Virtual';
            if (this.state.gallery.name !== newName) {
                this.state.gallery.name = newName;
                this.state.save();
            }
        }
    }

    render() {
        if (this.state.currentMode === 'START') {
            this.renderStartScreen();
        } else if (this.state.currentMode === 'EDITOR') {
            this.renderEditor();
        } else if (this.state.currentMode === 'SPECTATOR') {
            this.renderSpectatorHUD();
        }
    }

    renderStartScreen() {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) crosshair.style.display = 'none';

        const minimap = document.getElementById('minimap-container');
        if (minimap) minimap.style.display = 'none';

        this.layer.innerHTML = StartLayout.render({
            galleryName: this.state.gallery?.name || 'VIRTUAL GALLERY'
        });
    }

    renderSpectatorHUD() {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) crosshair.style.display = 'block';

        const minimap = document.getElementById('minimap-container');
        if (minimap) minimap.style.display = 'block';

        this.layer.innerHTML = SpectatorLayout.render({
            galleryName: this.state.gallery?.name || 'Galería Virtual',
            hasVisitedOnce: this.hasVisitedOnce
        });

        SpectatorLayout.bindEvents({
            engine: this.engine,
            onStartTour: () => {
                this.hasVisitedOnce = true;
            }
        });
    }

    renderEditor() {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) crosshair.style.display = 'none';

        const minimap = document.getElementById('minimap-container');
        if (minimap) minimap.style.display = 'none';

        document.exitPointerLock?.();
        
        this.layer.innerHTML = EditorLayout.render({
            gallery: this.state.gallery,
            selectedRoomId: this.state.selectedRoomId
        });
    }

    showRoomConfigModal() {
        const room = this.state.gallery.rooms.find(r => r.id === this.state.selectedRoomId);
        if (!room) return;

        this.currentConfiguredObject = room.object;
        document.getElementById('modal-container').innerHTML = RoomConfigModal.render({ room });
        RoomConfigModal.bindEvents({
            room,
            engine: this.engine,
            getObject: () => this.currentConfiguredObject,
            setObject: (obj) => {
                this.currentConfiguredObject = obj;
            }
        });
    }

    showPictureEditModal(picId) {
        const room = this.state.gallery.rooms.find(r => r.id === this.state.selectedRoomId);
        if (!room) return;
        const pic = room.pictures.find(p => p.id === picId);
        if (!pic) return;

        document.getElementById('modal-container').innerHTML = PictureEditModal.render({ pic });
        PictureEditModal.bindEvents();
    }

    showConfirmDialog(message, onConfirm, onCancel) {
        ConfirmDialog.show(message, onConfirm, onCancel);
    }

    async syncGallery({ isInitial = false, onComplete = null } = {}) {
        this.showLoading('Buscando galery.json en el servidor...');
        try {
            let res = await fetch('galery.json');
            if (!res.ok) {
                res = await fetch('gallery.json');
            }
            if (!res.ok) {
                this.hideLoading();
                if (!isInitial) {
                    this.showInfoModal('Archivo no encontrado', 'No se pudo encontrar el archivo "galery.json" en el servidor (HTTP ' + res.status + ').');
                }
                if (onComplete) onComplete(false);
                return false;
            }
            const text = await res.text();
            let parsed = null;
            try {
                parsed = JSON.parse(text);
            } catch (e) {
                this.hideLoading();
                if (!isInitial) {
                    this.showInfoModal('Error de formato', 'El archivo "galery.json" no es un JSON válido.');
                }
                if (onComplete) onComplete(false);
                return false;
            }

            if (!parsed || !Array.isArray(parsed.rooms)) {
                this.hideLoading();
                if (!isInitial) {
                    this.showInfoModal('Datos Inválidos', 'El archivo "galery.json" no contiene una estructura de galería válida.');
                }
                if (onComplete) onComplete(false);
                return false;
            }
            this.hideLoading();

            const roomsCount = parsed.rooms.length;
            const galleryName = parsed.name || 'Galería';
            const question = isInitial
                ? `Se detectó el archivo de galería "${galleryName}" con ${roomsCount} salón(es) en el servidor. ¿Deseas importar esta galería para comenzar?`
                : `Se validó el archivo "${galleryName}" con ${roomsCount} salón(es). ¿Deseas reemplazar la galería actual con estos datos?`;

            this.showConfirmDialog(
                question,
                async () => {
                    this.showLoading('Sincronizando galería...');
                    try {
                        await this.state.importGallery(text);
                        this.hideLoading();
                        if (onComplete) onComplete(true);
                    } catch (err) {
                        this.hideLoading();
                        this.showInfoModal('Error de Sincronización', err.message || 'Error al aplicar los datos de la galería.');
                        if (onComplete) onComplete(false);
                    }
                },
                () => {
                    if (onComplete) onComplete(false);
                }
            );
            return true;
        } catch (err) {
            this.hideLoading();
            if (!isInitial) {
                this.showInfoModal('Error de Sincronización', 'No se pudo conectar o leer el archivo galery.json: ' + err.message);
            }
            if (onComplete) onComplete(false);
            return false;
        }
    }

    showLoading(text = 'Cargando...') {
        LoadingOverlay.show(text);
    }

    hideLoading() {
        LoadingOverlay.hide();
    }

    showInfoModal(title, message) {
        InfoModal.show(title, message);
    }

    enterSpectatorMode(targetRoomId = null) {
        this.hasVisitedOnce = false;
        this.engine.buildGallery(this.state.gallery);

        const targetId = targetRoomId || (this.state.previousMode === 'EDITOR' ? this.state.selectedRoomId : null);
        
        let spawnX = 0;
        let spawnZ = (this.engine.minimapLayout ? this.engine.minimapLayout.startZ : 6) - 1.0;
        let spawnYaw = 0;

        if (targetId && this.engine.roomDoorData && this.engine.roomDoorData[targetId]) {
            const doorInfo = this.engine.roomDoorData[targetId];
            spawnX = doorInfo.x;
            spawnZ = doorInfo.z;
            spawnYaw = doorInfo.yaw;
        }

        this.engine.velocity.set(0, 0, 0);
        this.engine.direction.set(0, 0, 0);
        this.engine.moveForward = false;
        this.engine.moveBackward = false;
        this.engine.turnLeft = false;
        this.engine.turnRight = false;

        this.engine.camera.position.set(spawnX, this.engine.baseCameraY, spawnZ);
        this.engine.camera.rotation.set(0, spawnYaw, 0, 'YXZ');

        const playerObj = this.engine.controls.getObject();
        if (playerObj) {
            playerObj.position.set(spawnX, this.engine.baseCameraY, spawnZ);
            playerObj.rotation.set(0, spawnYaw, 0, 'YXZ');
        }

        this.engine.camera.updateMatrixWorld();
        this.engine.renderMinimap();
    }

    updateHUD(data) {
        const hud = document.getElementById('info-hud');
        if (!hud) return;

        const descText = (data && data.description) ? data.description.trim() : '';

        if (data && descText.length > 0) {
            const descEl = document.getElementById('hud-desc');
            if (descEl) descEl.innerText = descText;
            hud.classList.remove('opacity-0', 'translate-y-4');
            hud.classList.add('opacity-100', 'translate-y-0');
        } else {
            hud.classList.remove('opacity-100', 'translate-y-0');
            hud.classList.add('opacity-0', 'translate-y-4');
        }
    }

            async handleClick(e) {
                const btn = e.target.closest('[data-action]');
                if (!btn) return;

                const action = btn.dataset.action;
                const id = btn.dataset.id;

                if (action === 'setMode') {
                    const targetMode = btn.dataset.mode;
                    const targetRoomId = btn.dataset.roomId || (targetMode === 'SPECTATOR' && this.state.currentMode === 'EDITOR' ? this.state.selectedRoomId : null);
                    this.state.setMode(targetMode, targetRoomId);
                } else if (action === 'syncGallery') {
                    await this.syncGallery();
                } else if (action === 'exportGallery') {
                    this.showConfirmDialog('¿Deseas exportar la galería actual a un archivo JSON descargable?', () => {
                        this.showLoading('Generando archivo JSON...');
                        setTimeout(() => {
                            this.state.exportGallery();
                            this.hideLoading();
                        }, 300);
                    });
                } else if (action === 'addRoom') {
                    this.state.addRoom();
                } else if (action === 'selectRoom') {
                    this.state.selectedRoomId = id;
                    this.render();
                } else if (action === 'openRoomConfig') {
                    this.showRoomConfigModal();
                } else if (action === 'closeModal') {
                    document.getElementById('modal-container').innerHTML = '';
                } else if (action === 'saveRoomConfig') {
                    const scaleInput = document.getElementById('cfg-scale');
                    const soundtrackInput = document.getElementById('cfg-soundtrack-url');
                    const updateData = {
                        name: document.getElementById('cfg-name').value,
                        description: document.getElementById('cfg-desc').value,
                        color: document.getElementById('cfg-color').value,
                        lightColor: document.getElementById('cfg-light').value,
                        objectScale: scaleInput ? parseFloat(scaleInput.value) : 1.0,
                        soundtrackSrc: soundtrackInput ? (soundtrackInput.value.trim() || null) : null
                    };
                    if (this.currentConfiguredObject !== undefined) {
                        updateData.object = this.currentConfiguredObject;
                    }

                    this.state.updateRoom(this.state.selectedRoomId, updateData);
                    document.getElementById('modal-container').innerHTML = '';
                } else if (action === 'deleteRoomConfirm') {
                    this.showConfirmDialog('¿Deseas eliminar este salón y todos sus cuadros?', () => {
                        this.state.deleteRoom(this.state.selectedRoomId);
                        document.getElementById('modal-container').innerHTML = '';
                    });
                } else if (action === 'editPicture') {
                    this.showPictureEditModal(id);
                } else if (action === 'savePicConfig') {
                    this.state.updatePicture(this.state.selectedRoomId, id, {
                        name: document.getElementById('pic-name').value,
                        description: document.getElementById('pic-desc').value,
                        frameColor: document.getElementById('pic-frame').value
                    });
                    document.getElementById('modal-container').innerHTML = '';
                } else if (action === 'deletePicConfirm') {
                    this.showConfirmDialog('¿Eliminar este cuadro del salón?', () => {
                        this.state.deletePicture(this.state.selectedRoomId, id);
                        document.getElementById('modal-container').innerHTML = '';
                    });
                }
            }


            async handleChange(e) {
                const target = e.target;
                if (target.dataset.action === 'uploadPicture' && target.files.length > 0) {
                    await this.addPictureFiles(Array.from(target.files));
                    target.value = '';
                } else if (target.dataset.action === 'importGalleryFile' && target.files.length > 0) {
                    const file = target.files[0];
                    this.showLoading(`Leyendo "${file.name}"...`);
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        try {
                            const content = event.target.result;
                            const parsed = JSON.parse(content);
                            if (!parsed || !Array.isArray(parsed.rooms)) {
                                this.hideLoading();
                                this.showInfoModal('Archivo Inválido', `"${file.name}" no contiene una estructura de galería válida.`);
                                return;
                            }
                            this.hideLoading();
                            const roomsCount = parsed.rooms.length;
                            const galleryName = parsed.name || file.name;
                            this.showConfirmDialog(`Se validó el archivo "${galleryName}" (${roomsCount} salón(es)). ¿Deseas reemplazar la galería actual?`, async () => {
                                this.showLoading('Importando datos...');
                                try {
                                    await this.state.importGallery(content);
                                    this.hideLoading();
                                } catch (err) {
                                    this.hideLoading();
                                    this.showInfoModal('Error al Importar', err.message || 'No se pudo guardar la galería importada.');
                                }
                            });
                        } catch (err) {
                            this.hideLoading();
                            this.showInfoModal('Error al Importar', 'El archivo seleccionado no tiene un formato JSON válido.');
                        }
                    };
                    reader.onerror = () => {
                        this.hideLoading();
                        this.showInfoModal('Error al Importar', 'No se pudo leer el archivo seleccionado.');
                    };
                    reader.readAsText(file);
                    target.value = '';
                }
            }

}
