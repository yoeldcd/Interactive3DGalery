/**
 * @file app_state.js
 * @description Gestor de estado de la aplicación.
 */

import { Gallery } from '../../domain/models/gallery.js';
import { GalleryRoom } from '../../domain/models/gallery_room.js';
import { GalleryPicture } from '../../domain/models/gallery_picture.js';
import { IndexedDBGalleryRepository } from '../../infrastructure/persistence/indexeddb_gallery_repository.js';

class AppState {
    constructor() {
        this.repository = new IndexedDBGalleryRepository();
        this.gallery = null;
        this.currentMode = 'START';
        this.previousMode = null;
        this.selectedRoomId = null;
        
        this.onStateChange = () => {};
        this.onSpectatorEnter = () => {};
    }

    async hasSavedData() {
        const savedGallery = await this.repository.get('default_gallery');
        return Boolean(savedGallery);
    }

    async loadDefaultGallery() {
        this.gallery = new Gallery();
        const room1 = new GalleryRoom(null, 'Sala Renacimiento', 'Colección de arte clásico de maestros europeos.', '#ece8e1', null, '#fff5ea', null, null, 1.0);
        const room2 = new GalleryRoom(null, 'Sala Vanguardia', 'Exploraciones contemporáneas, abstracciones y formas modernas.', '#2b2d42', null, '#8ecae6', null, null, 1.0);
        this.gallery.rooms.push(room1, room2);
        if (this.gallery.rooms.length > 0) {
            this.selectedRoomId = this.gallery.rooms[0].id;
        }
        await this.repository.save(this.gallery);
        this.notify();
    }

    async loadInitialData() {
        let savedGallery = await this.repository.get('default_gallery');
        if (!savedGallery) {
            await this.loadDefaultGallery();
        } else {
            this.gallery = savedGallery;
            if (this.gallery.rooms.length > 0) {
                this.selectedRoomId = this.gallery.rooms[0].id;
            }
            this.notify();
        }
    }

    async save() {
        await this.repository.save(this.gallery);
        this.notify();
    }

    addRoom() {
        const newRoom = new GalleryRoom();
        newRoom.name = `Salón ${this.gallery.rooms.length + 1}`;
        this.gallery.rooms.push(newRoom);
        this.selectedRoomId = newRoom.id;
        this.save();
    }

    deleteRoom(id) {
        this.gallery.rooms = this.gallery.rooms.filter(r => r.id !== id);
        if (this.selectedRoomId === id) {
            this.selectedRoomId = this.gallery.rooms.length > 0 ? this.gallery.rooms[0].id : null;
        }
        this.save();
    }

    updateRoom(id, data) {
        const room = this.gallery.rooms.find(r => r.id === id);
        if (room) {
            Object.assign(room, data);
            this.save();
        }
    }

    addPicture(roomId, pictureData) {
        const room = this.gallery.rooms.find(r => r.id === roomId);
        if (room) {
            room.pictures.push(new GalleryPicture(null, pictureData.name, pictureData.description, pictureData.frameColor || '#eab308', pictureData.src));
            this.save();
        }
    }

    addPictures(roomId, picturesDataArray) {
        const room = this.gallery.rooms.find(r => r.id === roomId);
        if (room && Array.isArray(picturesDataArray)) {
            picturesDataArray.forEach(picData => {
                room.pictures.push(new GalleryPicture(null, picData.name, picData.description, picData.frameColor || '#eab308', picData.src));
            });
            this.save();
        }
    }

    updatePicture(roomId, picId, data) {
        const room = this.gallery.rooms.find(r => r.id === roomId);
        if (room) {
            const pic = room.pictures.find(p => p.id === picId);
            if (pic) {
                Object.assign(pic, data);
                this.save();
            }
        }
    }

    deletePicture(roomId, picId) {
        const room = this.gallery.rooms.find(r => r.id === roomId);
        if (room) {
            room.pictures = room.pictures.filter(p => p.id !== picId);
            this.save();
        }
    }

    setMode(mode, targetRoomId = null) {
        this.previousMode = this.currentMode;
        this.currentMode = mode;
        this.notify();
        if (mode === 'SPECTATOR') {
            this.onSpectatorEnter(targetRoomId);
        }
    }

    exportGallery() {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.gallery, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `${(this.gallery.name || 'galeria').toLowerCase().replace(/\s+/g, '_')}_export.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    async importGallery(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed && Array.isArray(parsed.rooms)) {
                this.gallery = new Gallery(parsed.id || 'default_gallery', parsed.name || 'Mi Galería Virtual');
                this.gallery.rooms = parsed.rooms.map(r => {
                    const room = new GalleryRoom(r.id, r.name, r.description, r.color, r.texture, r.lightColor, r.sound, r.object, r.objectScale, r.soundtrackSrc);
                    room.pictures = (r.pictures || []).map(p => new GalleryPicture(p.id, p.name, p.description, p.frameColor || '#eab308', p.src));
                    return room;
                });
                if (this.gallery.rooms.length > 0) {
                    this.selectedRoomId = this.gallery.rooms[0].id;
                } else {
                    this.selectedRoomId = null;
                }
                await this.save();
            }
        } catch (err) {
            console.error('Error al importar la galería:', err);
        }
    }

    notify() {
        if (typeof this.onStateChange === 'function') {
            this.onStateChange();
        }
    }
}

export { AppState };
