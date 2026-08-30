/**
 * @file start_layout.js
 * @description Componente de layout para la pantalla de inicio (Hero gráfico SVG, título y botones de acceso).
 */

export class StartLayout {
    /**
     * Renderiza el markup HTML de la pantalla de inicio.
     * @param {object} options
     * @param {string} [options.galleryName='VIRTUAL GALLERY'] - Nombre de la galería a mostrar.
     * @returns {string} Markup HTML.
     */
    static render({ galleryName = 'VIRTUAL GALLERY' }) {
        return `
                    <div class="w-full h-full bg-[#070b14] relative flex items-center justify-center pointer-events-auto overflow-hidden select-none">
                        
                        <div class="absolute inset-0 pointer-events-none overflow-hidden">
                            <div class="absolute -top-32 -left-32 w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[130px] anim-aura"></div>
                            <div class="absolute top-1/2 -right-40 w-[650px] h-[650px] bg-sky-500/15 rounded-full blur-[150px] anim-aura" style="animation-delay: -3s;"></div>
                            <div class="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] anim-aura" style="animation-delay: -5s;"></div>
                            <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0); background-size: 32px 32px;"></div>
                        </div>

                        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <svg class="w-full h-full max-w-6xl max-h-[850px] opacity-80" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#fef08a" />
                                        <stop offset="50%" stop-color="#facc15" />
                                        <stop offset="100%" stop-color="#ca8a04" />
                                    </linearGradient>
                                    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#38bdf8" />
                                        <stop offset="100%" stop-color="#0369a1" />
                                    </linearGradient>
                                    <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#c084fc" stop-opacity="0.6" />
                                        <stop offset="100%" stop-color="#6366f1" stop-opacity="0.1" />
                                    </linearGradient>
                                    <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stop-color="#facc15" stop-opacity="0.25" />
                                        <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.08" />
                                        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
                                    </radialGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                <circle cx="500" cy="500" r="380" fill="url(#portalGlow)" />

                                <g class="anim-spin-slow">
                                    <circle cx="500" cy="500" r="320" stroke="url(#goldGrad)" stroke-width="1.2" stroke-opacity="0.3" class="anim-dash" />
                                    <circle cx="500" cy="500" r="280" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="6, 18" />
                                    <circle cx="500" cy="180" r="4" fill="#facc15" filter="url(#glow)" />
                                    <circle cx="500" cy="820" r="4" fill="#38bdf8" filter="url(#glow)" />
                                    <circle cx="180" cy="500" r="3" fill="#ffffff" />
                                    <circle cx="820" cy="500" r="3" fill="#ffffff" />
                                </g>

                                <g class="anim-spin-rev">
                                    <circle cx="500" cy="500" r="360" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.15" stroke-dasharray="20, 40" />
                                    <polygon points="500,160 788,326 788,674 500,840 212,674 212,326" stroke="url(#cyanGrad)" stroke-width="1.2" stroke-opacity="0.25" fill="none" />
                                </g>

                                <g class="anim-float" style="transform-origin: 180px 280px;">
                                    <rect x="110" y="210" width="130" height="150" rx="14" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="2" filter="url(#glow)" opacity="0.85" />
                                    <rect x="122" y="222" width="106" height="100" rx="8" fill="#1e293b" />
                                    <circle cx="175" cy="265" r="24" fill="url(#goldGrad)" opacity="0.7" />
                                    <path d="M125 315 L155 285 L180 305 L210 270 L225 315 Z" fill="#334155" opacity="0.8" />
                                    <rect x="135" y="334" width="80" height="6" rx="3" fill="#facc15" opacity="0.6" />
                                </g>

                                <g class="anim-float-rev" style="transform-origin: 820px 320px;">
                                    <rect x="750" y="250" width="140" height="160" rx="14" fill="#0f172a" stroke="url(#cyanGrad)" stroke-width="2" filter="url(#glow)" opacity="0.85" />
                                    <rect x="762" y="262" width="116" height="110" rx="8" fill="#0c4a6e" fill-opacity="0.4" />
                                    <path d="M820 280 L855 300 L855 340 L820 360 L785 340 L785 300 Z" stroke="#38bdf8" stroke-width="2" fill="none" />
                                    <path d="M820 280 L820 360 M820 320 L855 300 M820 320 L785 300" stroke="#38bdf8" stroke-width="1.5" />
                                    <rect x="778" y="384" width="84" height="6" rx="3" fill="#38bdf8" opacity="0.6" />
                                </g>

                                <g class="anim-float" style="transform-origin: 220px 720px; animation-delay: -2s;">
                                    <path d="M220 660 L270 690 L270 750 L220 780 L170 750 L170 690 Z" fill="url(#violetGrad)" stroke="#c084fc" stroke-width="1.5" opacity="0.75" />
                                    <path d="M220 660 L220 780 M220 720 L270 690 M220 720 L170 690" stroke="#e9d5ff" stroke-width="1.2" opacity="0.5" />
                                </g>

                                <g class="anim-float-rev" style="transform-origin: 790px 710px; animation-delay: -4s;">
                                    <rect x="720" y="640" width="125" height="140" rx="12" fill="#0f172a" stroke="#facc15" stroke-width="1.5" stroke-opacity="0.6" opacity="0.8" />
                                    <circle cx="782" cy="700" r="28" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="5, 5" fill="none" />
                                    <path d="M765 700 L800 700 M782 683 L782 718" stroke="#facc15" stroke-width="2" />
                                </g>

                                <line x1="500" y1="500" x2="175" y2="285" stroke="url(#goldGrad)" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="4, 8" />
                                <line x1="500" y1="500" x2="820" y2="330" stroke="url(#cyanGrad)" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="4, 8" />
                                <line x1="500" y1="500" x2="220" y2="720" stroke="#c084fc" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="4, 8" />
                                <line x1="500" y1="500" x2="782" y2="710" stroke="#facc15" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="4, 8" />
                            </svg>
                        </div>

                        <div class="relative z-10 max-w-2xl w-full mx-6 flex flex-col items-center justify-center text-center">
                            
                            <h1 class="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] mb-10 title-glow">
                                <span class="gradient-text-vibrant">${galleryName}</span>
                            </h1>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                                <button data-action="setMode" data-mode="SPECTATOR" class="group relative px-6 py-4 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black rounded-2xl transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 cursor-pointer overflow-hidden">
                                    <div class="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <svg class="w-5 h-5 text-slate-950 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    <span class="text-xs uppercase tracking-wider">VISITAR</span>
                                </button>

                                <button data-action="setMode" data-mode="EDITOR" class="group px-6 py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-700/80 hover:border-amber-400/50 backdrop-blur-md transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-lg flex items-center justify-center gap-3 cursor-pointer">
                                    <svg class="w-5 h-5 text-amber-400 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    <span class="text-xs uppercase tracking-wider text-slate-200 group-hover:text-white">ESTUDIO</span>
                                </button>
                            </div>

                        </div>
                    </div>
                `;
    }
}
