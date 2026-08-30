/**
 * @file info_modal.js
 * @description Componente modal para alertas y mensajes informativos.
 */

export class InfoModal {
    /**
     * Muestra un diálogo informativo en pantalla.
     * @param {string} title - Título del diálogo.
     * @param {string} message - Mensaje o descripción.
     */
    static show(title, message) {
        const existing = document.getElementById('info-dialog-wrapper');
        if (existing) existing.remove();

        const dialogHtml = `
            <div id="info-dialog-wrapper" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[65] pointer-events-auto backdrop-blur-sm p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
                    <div class="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h4 class="text-sm font-bold text-white mb-2 tracking-wide">${title}</h4>
                    <p class="text-xs text-slate-300 mb-6 leading-relaxed">${message}</p>
                    <button type="button" id="btn-info-ok" class="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer">
                        Aceptar
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
        document.getElementById('btn-info-ok')?.addEventListener('click', () => {
            document.getElementById('info-dialog-wrapper')?.remove();
        });
    }
}