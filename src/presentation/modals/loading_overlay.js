/**
 * @file loading_overlay.js
 * @description Componente modal de indicador de carga a pantalla completa con spinner.
 */

export class LoadingOverlay {
    /**
     * Muestra el overlay de carga con el mensaje proporcionado.
     * @param {string} [text='Cargando...'] - Texto del indicador de carga.
     */
    static show(text = 'Cargando...') {
        this.hide();
        const loadingHtml = `
            <div id="app-loading-overlay" class="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[70] pointer-events-auto backdrop-blur-sm">
                <div class="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-sm font-bold text-amber-300 tracking-wide">${text}</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHtml);
    }

    /**
     * Oculta y remueve el overlay de carga del DOM.
     */
    static hide() {
        const el = document.getElementById('app-loading-overlay');
        if (el) el.remove();
    }
}