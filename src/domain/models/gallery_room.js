/**
 * @file gallery_room.js
 * @description Entidad de dominio GalleryRoom.
 */

class GalleryRoom {
    /**
     * @param {string} [id]
     * @param {string} [name]
     * @param {string} [description]
     * @param {string} [color]
     * @param {string|null} [texture]
     * @param {string} [lightColor]
     * @param {string|null} [sound]
     * @param {string|null} [object]
     * @param {number} [objectScale=1.0]
     * @param {string|null} [soundtrackSrc]
     */
    constructor(id, name, description, color, texture, lightColor, sound, object, objectScale, soundtrackSrc) {
        this.id = id || crypto.randomUUID();
        this.name = name || 'Nuevo Salón';
        this.description = description || '';
        this.color = color || '#ece8e1';
        this.texture = texture || null;
        this.lightColor = lightColor || '#ffffff';
        this.sound = sound || null;
        this.object = object || null;
        this.objectScale = objectScale !== undefined ? objectScale : 1.0;
        this.soundtrackSrc = soundtrackSrc || null;
        this.pictures = [];
    }
}

export { GalleryRoom };

