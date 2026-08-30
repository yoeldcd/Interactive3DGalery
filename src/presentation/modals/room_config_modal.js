/**
 * @file room_config_modal.js
 * @description Componente modal para la configuración de un salón (nombre, descripción, colores, y carga de objeto 3D con preview).
 */

import * as THREE from 'three';
import { CustomBottomlineInput } from '../components/custom_bottomline_input.js';
import { CustomTextareaInput } from '../components/custom_textarea_input.js';
import { CustomColorChoiceInput } from '../components/custom_color_choice_input.js';
import { CustomSliderInput } from '../components/custom_slider_input.js';
import { readFileAsText } from '../../infrastructure/utils/file_utils.js';

export class RoomConfigModal {
    /**
     * Renderiza el markup HTML del modal de configuración de salón.
     * @param {object} options
     * @param {object} options.room - Instancia de GalleryRoom a configurar.
     * @returns {string} Markup HTML.
     */
    static render({ room }) {
        const wallColor = room.color || '#ece8e1';
        const lightColor = room.lightColor || '#ffffff';
        const currentScale = room.objectScale !== undefined ? room.objectScale : 1.0;
        const hasAsset = !!room.object;

        return `
            <div class="fixed inset-0 bg-black/85 flex items-center justify-center z-50 pointer-events-auto backdrop-blur-md p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[580px] overflow-hidden flex flex-col">
                    
                    <div class="h-[60px] px-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center flex-shrink-0">
                        <h3 class="text-base font-bold text-white tracking-wide">Configurar Salón</h3>
                        <button data-action="closeModal" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="h-[46px] flex border-b border-slate-800 bg-slate-950 px-6 gap-8 text-xs flex-shrink-0">
                        <button type="button" data-tab="tab-identidad" class="tab-btn active font-semibold text-slate-300 hover:text-amber-300 flex items-center cursor-pointer">
                            IDENTIDAD
                        </button>
                        <button type="button" data-tab="tab-colores" class="tab-btn font-semibold text-slate-400 hover:text-amber-300 flex items-center cursor-pointer">
                            COLORES
                        </button>
                        <button type="button" data-tab="tab-decoracion" class="tab-btn font-semibold text-slate-400 hover:text-amber-300 flex items-center cursor-pointer">
                            DECORACIÓN
                        </button>
                        <button type="button" data-tab="tab-soundtrack" class="tab-btn font-semibold text-slate-400 hover:text-amber-300 flex items-center cursor-pointer">
                            SOUNDTRACK
                        </button>
                    </div>

                    <div class="flex-1 p-6 overflow-hidden relative">
                        
                        <div id="tab-identidad" class="tab-content h-full flex flex-col justify-start space-y-6">
                            ${CustomBottomlineInput.render({
                                id: 'cfg-name',
                                label: 'Nombre del Salón',
                                value: room.name,
                                placeholder: 'Nombre de la sala'
                            })}
                            ${CustomTextareaInput.render({
                                id: 'cfg-desc',
                                label: 'Descripción Curatorial',
                                value: room.description || '',
                                placeholder: 'Escribe aquí la descripción curatorial del salón...'
                            })}
                        </div>

                        <div id="tab-colores" class="tab-content hidden h-full flex flex-col justify-start space-y-6 pt-2">
                            ${CustomColorChoiceInput.render({
                                id: 'cfg-color',
                                label: 'Color de Paredes',
                                value: wallColor,
                                typePrefix: 'wall'
                            })}

                            <div class="h-px bg-slate-800/80 my-1"></div>

                            ${CustomColorChoiceInput.render({
                                id: 'cfg-light',
                                label: 'Color de Iluminación',
                                value: lightColor,
                                typePrefix: 'light'
                            })}
                        </div>

                        <div id="tab-decoracion" class="tab-content hidden h-full flex flex-col relative">
                            <div class="w-full flex-1 rounded-xl overflow-hidden relative bg-slate-950 flex items-center justify-center">
                                <canvas id="cfg-preview-canvas" class="w-full h-full block"></canvas>

                                <button type="button" id="btn-clear-obj" class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-rose-400/40 cursor-pointer ${hasAsset ? '' : 'hidden'}" title="Quitar Objeto 3D">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                                
                                <div id="obj-empty-prompt" class="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center ${hasAsset ? 'hidden' : ''}">
                                    <label class="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs cursor-pointer transition shadow-lg flex items-center gap-2 mb-3 transform hover:scale-105 active:scale-95">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        Cargar Objeto .OBJ
                                        <input type="file" id="cfg-obj" accept=".obj" class="hidden">
                                    </label>
                                    <input type="url" id="cfg-obj-url" placeholder="O pega URL directa de archivo .OBJ..." class="custom-bottomline-input text-xs text-center max-w-sm">
                                </div>

                                <div id="obj-loaded-controls" class="absolute inset-x-8 bottom-4 z-20 ${hasAsset ? '' : 'hidden'}">
                                    ${CustomSliderInput.render({
                                        id: 'cfg-scale',
                                        label: 'Escala del Objeto',
                                        min: 0.2,
                                        max: 5.0,
                                        step: 0.1,
                                        value: currentScale,
                                        badgeId: 'scale-badge'
                                    })}
                                </div>
                            </div>
                        </div>

                        <div id="tab-soundtrack" class="tab-content hidden h-full flex flex-col justify-start space-y-6 pt-2">
                            <div class="flex flex-col items-center gap-4 pt-4">
                                <label class="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs cursor-pointer transition shadow-lg flex items-center gap-2 transform hover:scale-105 active:scale-95">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                                    Cargar Archivo de Audio
                                    <input type="file" id="cfg-soundtrack-file" accept="audio/*,.mp3,.ogg,.wav,.flac,.aac" class="hidden">
                                </label>
                                <input type="url" id="cfg-soundtrack-url" value="${room.soundtrackSrc || ''}" placeholder="O pega URL directa de archivo de audio..." class="custom-bottomline-input text-xs text-center max-w-sm">
                                <p class="text-xs text-slate-500 text-center">El soundtrack se reproducirá automáticamente al entrar en este salón y se pausará al salir.</p>
                            </div>
                            <div id="soundtrack-preview-container" class="${room.soundtrackSrc ? '' : 'hidden'} flex flex-col gap-3">
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Vista Previa</label>
                                <audio id="cfg-soundtrack-preview" controls class="w-full h-10 rounded-lg" preload="metadata">
                                    ${room.soundtrackSrc ? '<source src="' + room.soundtrackSrc + '">' : ''}
                                </audio>
                            </div>
                            <button type="button" id="btn-clear-soundtrack" class="self-start px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition text-xs font-bold cursor-pointer ${room.soundtrackSrc ? '' : 'hidden'}">
                                Quitar Soundtrack
                            </button>
                        </div>

                    </div>

                    <div class="h-[76px] px-6 border-t border-slate-800 bg-slate-950 flex items-center flex-shrink-0">
                        <div class="grid grid-cols-3 gap-4 w-full">
                            <button data-action="deleteRoomConfirm" class="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Eliminar Salón
                            </button>
                            <button data-action="closeModal" class="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                Cancelar
                            </button>
                            <button data-action="saveRoomConfig" class="py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vincula los listeners de eventos para pestañas, selector de colores, preview 3D y carga de archivos .OBJ.
     */
    static bindEvents({ room, engine, getObject, setObject }) {
        let previewScene, previewCamera, previewRenderer, previewMesh, previewAnimFrame;

        const canvas = document.getElementById('cfg-preview-canvas');
        const emptyPrompt = document.getElementById('obj-empty-prompt');
        const loadedControls = document.getElementById('obj-loaded-controls');
        const btnClearObj = document.getElementById('btn-clear-obj');
        const scaleInput = document.getElementById('cfg-scale');

        const updatePreviewMesh = (source, scaleVal) => {
            if (previewMesh && previewScene) {
                previewScene.remove(previewMesh);
                previewMesh = null;
            }
            if (!source || !previewScene) return;

            const handleLoaded = (obj) => {
                engine.normalizeAndEnhanceMesh(obj);
                previewMesh = obj;
                const box = new THREE.Box3().setFromObject(previewMesh);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const norm = maxDim > 0 ? 2.2 / maxDim : 1.0;
                previewMesh.userData.normScale = norm;
                previewMesh.scale.setScalar(norm * (scaleVal || 1.0));

                const centeredBox = new THREE.Box3().setFromObject(previewMesh);
                const center = centeredBox.getCenter(new THREE.Vector3());
                previewMesh.position.sub(center);
                previewScene.add(previewMesh);
            };

            try {
                if (typeof source === 'string' && (source.includes('\nv ') || source.includes('\nf ') || source.startsWith('v ') || source.startsWith('#'))) {
                    const parsed = engine.objLoader.parse(source);
                    handleLoaded(parsed);
                } else if (typeof source === 'string' && source.startsWith('data:')) {
                    const base64Index = source.indexOf(';base64,');
                    if (base64Index !== -1) {
                        const decoded = atob(source.substring(base64Index + 8));
                        const parsed = engine.objLoader.parse(decoded);
                        handleLoaded(parsed);
                    } else {
                        engine.objLoader.load(source, handleLoaded);
                    }
                } else {
                    engine.objLoader.load(source, handleLoaded);
                }
            } catch(err) {
                console.error('Error al generar preview del OBJ:', err);
            }
        };

        if (canvas) {
            previewScene = new THREE.Scene();
            previewCamera = new THREE.PerspectiveCamera(45, (canvas.clientWidth || 600) / (canvas.clientHeight || 360), 0.1, 50);
            previewCamera.position.set(0, 0, 4.5);
            previewCamera.lookAt(0, 0, 0);

            previewRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            previewRenderer.setSize(canvas.clientWidth || 600, canvas.clientHeight || 360);

            const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
            hemi.position.set(0, 20, 0);
            previewScene.add(hemi);

            const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
            dirLight.position.set(4, 6, 5);
            previewScene.add(dirLight);

            const dirLightBack = new THREE.DirectionalLight(0x38bdf8, 0.8);
            dirLightBack.position.set(-4, -2, -4);
            previewScene.add(dirLightBack);

            const initialObj = getObject();
            if (initialObj) {
                updatePreviewMesh(initialObj, room ? room.objectScale : 1.0);
            }

            const animatePreview = () => {
                previewAnimFrame = requestAnimationFrame(animatePreview);
                if (previewMesh) previewMesh.rotation.y += 0.015;
                previewRenderer.render(previewScene, previewCamera);
            };
            animatePreview();
        }

        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.add('hidden'));

                btn.classList.add('active');
                const targetContent = document.getElementById(targetId);
                if (targetContent) targetContent.classList.remove('hidden');

                if (targetId === 'tab-decoracion' && canvas && previewRenderer) {
                    requestAnimationFrame(() => {
                        const w = canvas.clientWidth || 600;
                        const h = canvas.clientHeight || 360;
                        previewRenderer.setSize(w, h);
                        previewCamera.aspect = w / h;
                        previewCamera.updateProjectionMatrix();
                    });
                }
            });
        });

        CustomColorChoiceInput.bind({ id: 'cfg-color', typePrefix: 'wall' });
        CustomColorChoiceInput.bind({ id: 'cfg-light', typePrefix: 'light' });
        CustomSliderInput.bind({
            id: 'cfg-scale',
            badgeId: 'scale-badge',
            onChange: (val) => {
                if (previewMesh) {
                    const norm = previewMesh.userData.normScale || 1.0;
                    previewMesh.scale.setScalar(norm * val);
                    const box = new THREE.Box3().setFromObject(previewMesh);
                    const center = box.getCenter(new THREE.Vector3());
                    previewMesh.position.sub(center);
                }
            }
        });

        const objFile = document.getElementById('cfg-obj');
        const objUrlInput = document.getElementById('cfg-obj-url');

        const showAssetLoadedState = (src) => {
            setObject(src);
            if (emptyPrompt) emptyPrompt.classList.add('hidden');
            if (loadedControls) loadedControls.classList.remove('hidden');
            if (btnClearObj) btnClearObj.classList.remove('hidden');
            const currentS = scaleInput ? parseFloat(scaleInput.value) : 1.0;
            updatePreviewMesh(src, currentS);
        };

        if (objFile) {
            objFile.addEventListener('change', async () => {
                if (objFile.files.length > 0) {
                    const text = await readFileAsText(objFile.files[0]);
                    showAssetLoadedState(text);
                }
            });
        }

        if (objUrlInput) {
            objUrlInput.addEventListener('change', () => {
                const url = objUrlInput.value.trim();
                if (url) showAssetLoadedState(url);
            });
        }

        if (btnClearObj) {
            btnClearObj.addEventListener('click', () => {
                setObject(null);
                if (previewMesh && previewScene) {
                    previewScene.remove(previewMesh);
                    previewMesh = null;
                }
                if (emptyPrompt) emptyPrompt.classList.remove('hidden');
                if (loadedControls) loadedControls.classList.add('hidden');
                if (btnClearObj) btnClearObj.classList.add('hidden');
                if (objFile) objFile.value = '';
                if (objUrlInput) objUrlInput.value = '';
            });
        }

        const soundtrackUrlInput = document.getElementById('cfg-soundtrack-url');
        const soundtrackFileInput = document.getElementById('cfg-soundtrack-file');
        const soundtrackPreviewContainer = document.getElementById('soundtrack-preview-container');
        const soundtrackPreview = document.getElementById('cfg-soundtrack-preview');
        const btnClearSoundtrack = document.getElementById('btn-clear-soundtrack');

        const showSoundtrackLoaded = (src) => {
            if (soundtrackUrlInput) soundtrackUrlInput.value = src;
            if (soundtrackPreview) {
                soundtrackPreview.innerHTML = '<source src="' + src + '">';
                soundtrackPreview.load();
            }
            if (soundtrackPreviewContainer) soundtrackPreviewContainer.classList.remove('hidden');
            if (btnClearSoundtrack) btnClearSoundtrack.classList.remove('hidden');
        };

        if (soundtrackFileInput) {
            soundtrackFileInput.addEventListener('change', () => {
                if (soundtrackFileInput.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        showSoundtrackLoaded(e.target.result);
                    };
                    reader.readAsDataURL(soundtrackFileInput.files[0]);
                }
            });
        }

        if (soundtrackUrlInput) {
            soundtrackUrlInput.addEventListener('change', () => {
                const url = soundtrackUrlInput.value.trim();
                if (url) {
                    showSoundtrackLoaded(url);
                }
            });
        }

        if (btnClearSoundtrack) {
            btnClearSoundtrack.addEventListener('click', () => {
                if (soundtrackUrlInput) soundtrackUrlInput.value = '';
                if (soundtrackPreview) {
                    soundtrackPreview.pause();
                    soundtrackPreview.innerHTML = '';
                }
                if (soundtrackPreviewContainer) soundtrackPreviewContainer.classList.add('hidden');
                btnClearSoundtrack.classList.add('hidden');
            });
        }
    }
}
