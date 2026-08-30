/**
 * @file indexeddb_gallery_repository.js
 * @description Repositorio IndexedDB para persistencia de galerías.
 */

import { Gallery } from '../../domain/models/gallery.js';
import { GalleryRoom } from '../../domain/models/gallery_room.js';
import { GalleryPicture } from '../../domain/models/gallery_picture.js';

class IndexedDBGalleryRepository {
    constructor() {
        this.dbName = 'GalleryDB';
        this.storeName = 'galleries';
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async save(gallery) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const plainGallery = JSON.parse(JSON.stringify(gallery));
            store.put(plainGallery);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async get(id) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);
            const request = store.get(id);
            request.onsuccess = () => {
                if (request.result) {
                    const g = new Gallery(request.result.id, request.result.name);
                    g.rooms = (request.result.rooms || []).map(r => {
                        const room = new GalleryRoom(r.id, r.name, r.description, r.color, r.texture, r.lightColor, r.sound, r.object, r.objectScale, r.soundtrackSrc);
                        room.pictures = (r.pictures || []).map(p => new GalleryPicture(p.id, p.name, p.description, p.frameColor, p.src));
                        return room;
                    });
                    resolve(g);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}

export { IndexedDBGalleryRepository };
