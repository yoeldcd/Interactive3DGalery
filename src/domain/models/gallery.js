/**
 * @file gallery.js
 * @description Entidad raíz de dominio Gallery.
 */

class Gallery {
    /**
     * @param {string} [id]
     * @param {string} [name]
     */
    constructor(id, name) {
        this.id = id || 'default_gallery';
        this.name = name || 'Mi Galería Virtual';
        this.rooms = [];
    }
}

export { Gallery };
