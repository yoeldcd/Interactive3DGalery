/**
 * @file confirm_dialog.js
 * @description Componente modal de confirmación con opciones Sí/No.
 */

export class ConfirmDialog {
    /**
     * Muestra un cuadro de confirmación modal.
     * @param {string} message - Mensaje o pregunta a confirmar.
     * @param {Function} [onConfirm] - Callback ejecutado si el usuario acepta.
     * @param {Function} [onCancel] - Callback ejecutado si el usuario cancela o rechaza.
     */
    static show(message, onConfirm, onCancel) {
        const existing = document.getElementById('confirm-dialog-wrapper');
        if (existing) existing.remove();

        const dialogHtml = `
            <div id="confirm-dialog-wrapper" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] pointer-events-auto backdrop-blur-sm p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
                    <div class="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h4 class="text-sm font-bold text-white mb-2 tracking-wide">Confirmación</h4>
                    <p class="text-xs text-slate-300 mb-6 leading-relaxed">${message}</p>
                    <div class="grid grid-cols-2 gap-3 w-full">
                        <button type="button" id="btn-confirm-no" class="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            NO
                        </button>
                        <button type="button" id="btn-confirm-yes" class="py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            SÍ
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHtml);

        document.getElementById('btn-confirm-no')?.addEventListener('click', () => {
            document.getElementById('confirm-dialog-wrapper')?.remove();
            if (onCancel) onCancel();
        });

        document.getElementById('btn-confirm-yes')?.addEventListener('click', () => {
            document.getElementById('confirm-dialog-wrapper')?.remove();
            if (onConfirm) onConfirm();
        });
    }
}