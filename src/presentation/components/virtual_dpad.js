/**
 * @file virtual_dpad.js
 * @description Componente de cruceta y palanca virtual bidireccional / 4 direcciones para dispositivos móviles y pantallas táctiles.
 */

export class VirtualDPad {
    /**
     * Renderiza el markup HTML de la cruceta / palanca virtual.
     * @param {object} [options={}]
     * @param {string} [options.id='virtual-dpad-container'] - ID del contenedor principal.
     * @returns {string} Markup HTML.
     */
    static render({ id = 'virtual-dpad-container' } = {}) {
        return `
            <div id="${id}" class="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 pointer-events-auto touch-none select-none flex flex-col items-center">
                <!-- Marco base de la cruceta -->
                <div id="dpad-base" class="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-950/80 backdrop-blur-lg border border-slate-700/80 shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex items-center justify-center overflow-hidden cursor-pointer">
                    
                    <!-- Anillos y guías visuales de fondo -->
                    <div class="absolute inset-2 rounded-full border border-slate-800/80 pointer-events-none"></div>
                    <div class="absolute inset-7 rounded-full border border-amber-400/20 pointer-events-none"></div>
                    <div class="absolute w-full h-[1px] bg-slate-800/60 pointer-events-none"></div>
                    <div class="absolute h-full w-[1px] bg-slate-800/60 pointer-events-none"></div>

                    <!-- Botón / Pétalo Dirección Arriba (W / Avanzar) -->
                    <div id="dpad-btn-up" class="dpad-direction-btn absolute top-1.5 left-1/2 -translate-x-1/2 z-10 w-10 h-9 rounded-xl bg-slate-900/70 text-slate-300 flex flex-col items-center justify-center transition-colors duration-150 border border-slate-700/50 pointer-events-none">
                        <svg class="w-3.5 h-3.5 text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path></svg>
                        <span class="text-[7.5px] font-mono font-bold text-amber-300/80 -mt-0.5">W</span>
                    </div>

                    <!-- Botón / Pétalo Dirección Izquierda (A / Girar Izq) -->
                    <div id="dpad-btn-left" class="dpad-direction-btn absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-9 h-10 rounded-xl bg-slate-900/70 text-slate-300 flex flex-col items-center justify-center transition-colors duration-150 border border-slate-700/50 pointer-events-none">
                        <svg class="w-3.5 h-3.5 text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        <span class="text-[7.5px] font-mono font-bold text-amber-300/80 -mt-0.5">A</span>
                    </div>

                    <!-- Botón / Pétalo Dirección Derecha (D / Girar Der) -->
                    <div id="dpad-btn-right" class="dpad-direction-btn absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-9 h-10 rounded-xl bg-slate-900/70 text-slate-300 flex flex-col items-center justify-center transition-colors duration-150 border border-slate-700/50 pointer-events-none">
                        <svg class="w-3.5 h-3.5 text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                        <span class="text-[7.5px] font-mono font-bold text-amber-300/80 -mt-0.5">D</span>
                    </div>

                    <!-- Botón / Pétalo Dirección Abajo (S / Retroceder) -->
                    <div id="dpad-btn-down" class="dpad-direction-btn absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 w-10 h-9 rounded-xl bg-slate-900/70 text-slate-300 flex flex-col items-center justify-center transition-colors duration-150 border border-slate-700/50 pointer-events-none">
                        <span class="text-[7.5px] font-mono font-bold text-amber-300/80 -mb-0.5">S</span>
                        <svg class="w-3.5 h-3.5 text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>

                    <!-- Palanca / Pomo Central Superpuesto (Joystick Knob) -->
                    <div id="dpad-knob" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.55)] border-2 border-amber-200 pointer-events-none will-change-transform">
                        <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 9l4-4 4 4m0 6l-4 4-4-4M9 8l-4 4 4 4m6 0l4-4-4-4"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vincula los controladores de eventos táctiles y de puntero para controlar el motor 3D.
     * @param {object} options
     * @param {import('../../infrastructure/rendering/threejs_engine.js').ThreeJSEngine} options.engine - Instancia de ThreeJSEngine.
     * @param {string} [options.containerId='virtual-dpad-container'] - ID del elemento contenedor.
     */
    static bind({ engine, containerId = 'virtual-dpad-container' }) {
        const container = document.getElementById(containerId);
        const base = document.getElementById('dpad-base');
        const knob = document.getElementById('dpad-knob');
        if (!container || !base || !knob || !engine) return;

        const btnUp = document.getElementById('dpad-btn-up');
        const btnDown = document.getElementById('dpad-btn-down');
        const btnLeft = document.getElementById('dpad-btn-left');
        const btnRight = document.getElementById('dpad-btn-right');

        let activePointerId = null;

        const updateHighlight = (forward, backward, left, right) => {
            if (btnUp) btnUp.classList.toggle('dpad-btn-active', Boolean(forward));
            if (btnDown) btnDown.classList.toggle('dpad-btn-active', Boolean(backward));
            if (btnLeft) btnLeft.classList.toggle('dpad-btn-active', Boolean(left));
            if (btnRight) btnRight.classList.toggle('dpad-btn-active', Boolean(right));
        };

        const setMovement = (forward, backward, left, right) => {
            engine.moveForward = forward;
            engine.moveBackward = backward;
            engine.turnLeft = left;
            engine.turnRight = right;
            updateHighlight(forward, backward, left, right);
        };

        const processPointer = (clientX, clientY) => {
            const rect = base.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const maxRadius = (rect.width / 2) - 18;

            let dx = clientX - centerX;
            let dy = clientY - centerY;
            const distance = Math.hypot(dx, dy);

            let clampedX = dx;
            let clampedY = dy;
            if (distance > maxRadius) {
                clampedX = (dx / distance) * maxRadius;
                clampedY = (dy / distance) * maxRadius;
            }

            knob.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;

            const deadZone = 5;
            if (distance < deadZone) {
                setMovement(false, false, 0, 0);
                return;
            }

            const forward = dy < -7;
            const backward = dy > 7;

            // Curva suave progresiva para giro horizontal analógico
            const normX = clampedX / maxRadius;
            let leftRatio = 0;
            let rightRatio = 0;
            if (normX < -0.10) {
                leftRatio = Math.pow(Math.abs(normX), 1.3);
            } else if (normX > 0.10) {
                rightRatio = Math.pow(normX, 1.3);
            }

            setMovement(forward, backward, leftRatio, rightRatio);
        };

        const resetKnob = () => {
            activePointerId = null;
            knob.style.transform = 'translate(-50%, -50%)';
            setMovement(false, false, 0, 0);
        };

        base.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            activePointerId = e.pointerId;
            base.setPointerCapture?.(e.pointerId);
            processPointer(e.clientX, e.clientY);
        });

        base.addEventListener('pointermove', (e) => {
            if (activePointerId === e.pointerId) {
                e.preventDefault();
                e.stopPropagation();
                processPointer(e.clientX, e.clientY);
            }
        });

        base.addEventListener('pointerup', (e) => {
            if (activePointerId === e.pointerId) {
                e.preventDefault();
                e.stopPropagation();
                resetKnob();
            }
        });

        base.addEventListener('pointercancel', (e) => {
            if (activePointerId === e.pointerId) {
                resetKnob();
            }
        });
    }
}
