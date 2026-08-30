/**
 * @file asset_loader.js
 * @description Gestor de carga y normalización de objetos 3D (.OBJ) y texturas.
 */

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

/**
 * Gestor AssetLoader.
 */
class AssetLoader {

    /**
     * Inicializa el cargador de assets.
     */
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.objLoader = new OBJLoader();
    }

    /**
     * Normaliza los vectores normales y aplica material estándar a un objeto 3D.
     * @param {THREE.Object3D} obj - Objeto 3D a procesar.
     * @param {number} [customColor=0xfacc15] - Color hexadecimal base.
     * @returns {void}
     */
    normalizeAndEnhanceMesh(obj, customColor = 0xfacc15) {
        obj.traverse((child) => {
            if (child.isMesh) {
                if (child.geometry) {
                    child.geometry.computeVertexNormals();
                }
                child.material = new THREE.MeshStandardMaterial({
                    color: customColor,
                    metalness: 0.45,
                    roughness: 0.25,
                    side: THREE.DoubleSide
                });
            }
        });
    }

    /**
     * Carga o analiza un recurso .OBJ desde texto, data URI o URL.
     * @param {string} source - Contenido OBJ o URL.
     * @param {Function} onLoad - Callback al completar la carga.
     * @param {Function} [onError] - Callback en caso de error.
     * @returns {void}
     */
    loadOBJ(source, onLoad, onError) {
        try {
            if (typeof source === 'string' && (source.includes('\nv ') || source.includes('\nf ') || source.startsWith('v ') || source.startsWith('#'))) {
                const parsed = this.objLoader.parse(source);
                onLoad(parsed);
            } else if (typeof source === 'string' && source.startsWith('data:')) {
                const base64Index = source.indexOf(';base64,');
                if (base64Index !== -1) {
                    const decoded = atob(source.substring(base64Index + 8));
                    const parsed = this.objLoader.parse(decoded);
                    onLoad(parsed);
                } else {
                    this.objLoader.load(source, onLoad, undefined, onError);
                }
            } else {
                this.objLoader.load(source, onLoad, undefined, onError);
            }
        } catch (err) {
            if (onError) {
                onError(err);
            } else {
                console.error('Error al cargar OBJ:', err);
            }
        }
    }
}

export { AssetLoader };
