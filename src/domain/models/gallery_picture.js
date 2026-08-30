/**
 * @file gallery_picture.js
 * @description Entidad de dominio GalleryPicture.
 */

class GalleryPicture {
    /**
     * @param {string} [id]
     * @param {string} [name]
     * @param {string} [description]
     * @param {string} [frameColor]
     * @param {string} [src]
     */
    constructor(id, name, description, frameColor, src) {
        this.id = id || crypto.randomUUID();
        this.name = name || 'Sin título';
        this.description = description || '';
        this.frameColor = frameColor || '#eab308';
        this.src = src || '';
    }
}

export { GalleryPicture };
