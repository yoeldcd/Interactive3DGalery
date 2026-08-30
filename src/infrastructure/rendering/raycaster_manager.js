/**
 * @file raycaster_manager.js
 * @description Gestor de raycasting para detección de obras observadas por el jugador.
 */

import * as THREE from 'three';

/**
 * Gestor RaycasterManager.
 */
class RaycasterManager {

    /**
     * Inicializa el raycaster y vector de pantalla central.
     * @returns {void}
     */
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.centerCoords = new THREE.Vector2(0, 0);
        this.objectsToRaycast = [];
        this.currentTarget = null;
        this.maxDistance = 8.5;
    }

    /**
     * Limpia la lista de objetos interactivos.
     * @returns {void}
     */
    clear() {
        this.objectsToRaycast = [];
        this.currentTarget = null;
    }

    /**
     * Registra un objeto 3D para ser testeado por el raycaster.
     * @param {THREE.Object3D} mesh - Malla 3D del cuadro.
     * @returns {void}
     */
    registerTarget(mesh) {
        this.objectsToRaycast.push(mesh);
    }

    /**
     * Ejecuta el trazado de rayos hacia el centro de la pantalla y notifica al callback.
     * @param {THREE.Camera} camera - Cámara activa.
     * @param {Function} [onLookAtCallback] - Callback que recibe los datos de la obra o null.
     * @returns {void}
     */
    update(camera, onLookAtCallback) {
        if (!onLookAtCallback) {
            return;
        }

        this.raycaster.setFromCamera(this.centerCoords, camera);
        const intersects = this.raycaster.intersectObjects(this.objectsToRaycast, true);

        if (intersects.length > 0 && intersects[0].distance < 8.0) {
            const targetData = intersects[0].object.userData;

            if (targetData && targetData.isPicture) {
                onLookAtCallback(targetData);
                return;
            }
        }

        onLookAtCallback(null);
    }
}

export { RaycasterManager };

