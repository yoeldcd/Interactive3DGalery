/**
 * @file spectator_layout.js
 * @description Componente de layout para el modo Espectador (Barra superior, Guía de navegación WASD, y tarjeta HUD flotante).
 */

import { VirtualDPad } from '../components/virtual_dpad.js';

export class SpectatorLayout {
    /**
     * Renderiza el markup HTML del modo espectador.
     * @param {object} options
     * @param {string} [options.galleryName='Galería Virtual'] - Nombre de la galería.
     * @param {boolean} [options.hasVisitedOnce=false] - Indica si ya se inició la visita previamente.
     * @returns {string} Markup HTML.
     */
    static render({ galleryName = 'Galería Virtual', hasVisitedOnce = false }) {
        const buttonLabel = hasVisitedOnce ? 'CONTINUAR' : 'EMPEZAR VISITA';

        return `
                    <div class="w-full h-full relative pointer-events-none flex flex-col justify-between p-4 sm:p-6">
                        <div class="flex justify-between items-center w-full pointer-events-auto relative z-30 gap-2">
                            <div class="h-9 sm:h-10 bg-slate-900/80 backdrop-blur-md px-3.5 sm:px-4 rounded-xl border border-slate-700/60 shadow-lg flex items-center gap-2.5 max-w-[50%] sm:max-w-none">
                                <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></div>
                                <span class="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">${galleryName}</span>
                            </div>

                            <div class="flex items-center gap-2 flex-shrink-0">
                                <button data-action="setMode" data-mode="EDITOR" class="h-9 sm:h-10 px-3 sm:px-4 bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 rounded-xl backdrop-blur-md transition text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer">
                                    <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    <span>ESTUDIO</span>
                                </button>
                                <button data-action="setMode" data-mode="START" class="h-9 sm:h-10 px-3 sm:px-4 bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 rounded-xl backdrop-blur-md transition text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer">
                                    <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                    <span>INICIO</span>
                                </button>
                            </div>
                        </div>

                        <div id="click-to-play-overlay" class="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-[2px]">
                            <div class="bg-slate-950/95 backdrop-blur-md px-6 sm:px-8 py-6 sm:py-7 rounded-2xl border border-amber-400/30 text-center shadow-2xl max-w-md w-full mx-4 transform transition">
                                <h3 class="text-base sm:text-lg font-extrabold text-white mb-1 tracking-wide">Guía de Exploración</h3>
                                <p class="text-[11px] sm:text-xs text-slate-400 mb-4 leading-relaxed">Controla el desplazamiento y la orientación con teclas o la cruceta táctil:</p>

                                <div class="grid grid-cols-3 grid-rows-3 gap-2 w-64 mx-auto my-3 items-center justify-items-center">
                                    <div class="col-start-2 row-start-1 flex flex-col items-center justify-center w-20 py-2 px-1 rounded-xl bg-slate-900/90 border border-amber-400/40 shadow-md">
                                        <div class="flex items-center gap-1 font-mono font-bold text-[11px] text-amber-300">
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">W</kbd>
                                            <span>/</span>
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">↑</kbd>
                                        </div>
                                        <span class="text-[9px] text-slate-300 font-semibold mt-1 uppercase tracking-wide">Avanzar</span>
                                    </div>

                                    <div class="col-start-1 row-start-2 flex flex-col items-center justify-center w-20 py-2 px-1 rounded-xl bg-slate-900/90 border border-amber-400/40 shadow-md">
                                        <div class="flex items-center gap-1 font-mono font-bold text-[11px] text-amber-300">
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">A</kbd>
                                            <span>/</span>
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">←</kbd>
                                        </div>
                                        <span class="text-[9px] text-slate-300 font-semibold mt-1 uppercase tracking-wide">Girar Izq.</span>
                                    </div>

                                    <div class="col-start-2 row-start-2 w-11 h-11 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
                                        <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                                        </svg>
                                    </div>

                                    <div class="col-start-3 row-start-2 flex flex-col items-center justify-center w-20 py-2 px-1 rounded-xl bg-slate-900/90 border border-amber-400/40 shadow-md">
                                        <div class="flex items-center gap-1 font-mono font-bold text-[11px] text-amber-300">
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">D</kbd>
                                            <span>/</span>
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">→</kbd>
                                        </div>
                                        <span class="text-[9px] text-slate-300 font-semibold mt-1 uppercase tracking-wide">Girar Der.</span>
                                    </div>

                                    <div class="col-start-2 row-start-3 flex flex-col items-center justify-center w-20 py-2 px-1 rounded-xl bg-slate-900/90 border border-amber-400/40 shadow-md">
                                        <div class="flex items-center gap-1 font-mono font-bold text-[11px] text-amber-300">
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">S</kbd>
                                            <span>/</span>
                                            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">↓</kbd>
                                        </div>
                                        <span class="text-[9px] text-slate-300 font-semibold mt-1 uppercase tracking-wide">Retroceder</span>
                                    </div>
                                </div>

                                <p class="text-[11px] text-slate-400 mt-2 mb-4 font-medium">En móviles, usa la cruceta derecha para moverte y desliza la pantalla para mirar</p>

                                <button id="btn-start-tour" class="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span id="btn-start-tour-label">${buttonLabel}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Cruceta / Palanca virtual en la derecha -->
                        ${VirtualDPad.render()}

                        <!-- HUD de descripción de obra (Arriba en móviles con margen aumentado y height variable, abajo en escritorio) -->
                        <div class="fixed sm:absolute top-20 sm:top-auto sm:bottom-6 left-3.5 right-3.5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-30 pointer-events-none flex justify-center">
                            <div id="info-hud" class="w-full sm:w-[50dvw] sm:max-w-xl h-auto max-h-44 sm:max-h-56 bg-slate-950/90 sm:bg-black/50 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 text-white shadow-2xl opacity-0 transform -translate-y-3 sm:translate-y-4 transition-all duration-300 pointer-events-none flex flex-col justify-start">
                                <div class="flex items-center gap-2 mb-1.5 flex-shrink-0">
                                    <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#facc15]"></span>
                                    <span class="text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-widest drop-shadow-sm">Descripción de la Obra</span>
                                </div>
                                <div class="overflow-y-auto max-h-32 sm:max-h-40 pr-1">
                                    <p id="hud-desc" class="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed drop-shadow"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }

    /**
     * Vincula los listeners de eventos para iniciar el recorrido y la cruceta virtual.
     * @param {object} options
     * @param {object} options.engine - Instancia de ThreeJSEngine.
     * @param {Function} options.onStartTour - Callback al comenzar el tour.
     */
    static bindEvents({ engine, onStartTour }) {
        const btnStart = document.getElementById('btn-start-tour');
        const overlay = document.getElementById('click-to-play-overlay');
        const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        const startTour = (isTouch = false) => {
            if (onStartTour) onStartTour();
            if (overlay) overlay.style.display = 'none';
            engine.isSpectatorActive = true;
            if (!isTouch && !isTouchDevice()) {
                try {
                    engine.controls.lock();
                } catch (e) {
                    // Pointer lock no disponible
                }
            }
        };

        if (btnStart) {
            btnStart.addEventListener('click', (e) => {
                e.stopPropagation();
                startTour(e.pointerType === 'touch');
            });
            btnStart.addEventListener('touchend', (e) => {
                e.stopPropagation();
                startTour(true);
            });
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    startTour(e.pointerType === 'touch');
                }
            });
            overlay.addEventListener('touchend', (e) => {
                if (e.target === overlay) {
                    startTour(true);
                }
            });
        }

        engine.controls.addEventListener('lock', () => {
            engine.isSpectatorActive = true;
            if (overlay) overlay.style.display = 'none';
        });

        engine.controls.addEventListener('unlock', () => {
            const label = document.getElementById('btn-start-tour-label');
            if (label) label.innerText = 'CONTINUAR';
        });

        // Enlazar eventos de la cruceta / palanca virtual
        VirtualDPad.bind({ engine });
    }
}
