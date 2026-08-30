/**
 * @file main.js
 * @description Punto de entrada principal y bootstrap de la Galería 3D Interactiva.
 */

import { AppState } from './application/state/app_state.js';
import { ThreeJSEngine } from './infrastructure/rendering/threejs_engine.js';
import { UIManager } from './presentation/ui_manager.js';

/**
 * Clase principal de inicialización de la aplicación.
 */
export class MainApp {
    constructor() {
        this.state = new AppState();
        this.engine = new ThreeJSEngine('canvas-container');
        this.ui = new UIManager(this.state, this.engine);
    }

    /**
     * Inicia la carga de datos y renderiza la pantalla de inicio.
     */
    async start() {
        try {
            const hasData = await this.state.hasSavedData();
            if (!hasData) {
                // Arrancando de cero sin DB previa: sincronización automática desde galery.json si existe
                await this.ui.syncGallery({
                    isInitial: true,
                    onComplete: async (synced) => {
                        if (!synced) {
                            await this.state.loadDefaultGallery();
                        }
                        this.state.setMode('START');
                    }
                });
            } else {
                await this.state.loadInitialData();
                this.state.setMode('START');
            }
        } catch (error) {
            console.error("Error al iniciar la aplicación:", error);
            const uiLayer = document.getElementById('ui-layer');
            if (uiLayer) {
                uiLayer.innerHTML = `<div class="p-8 text-rose-400 bg-slate-950 h-full flex items-center justify-center font-medium">Error al cargar la base de datos local: ${error.message}</div>`;
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const app = new MainApp();
    app.start();
});
