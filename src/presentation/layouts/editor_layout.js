/**
 * @file editor_layout.js
 * @description Componente de layout para el modo Estudio / Editor de galería.
 */

export class EditorLayout {
    /**
     * Renderiza el markup HTML del modo Editor.
     * @param {object} options
     * @param {object} options.gallery - Instancia de Gallery.
     * @param {string|null} options.selectedRoomId - ID del salón seleccionado.
     * @returns {string} Markup HTML.
     */
    static render({ gallery, selectedRoomId }) {
        const activeRoom = gallery.rooms.find(r => r.id === selectedRoomId);

        const roomListHTML = gallery.rooms.map(room => `
            <div data-action="selectRoom" data-id="${room.id}" 
                 class="p-3.5 cursor-pointer border-b border-slate-800/80 transition flex items-center justify-between ${room.id === selectedRoomId ? 'bg-amber-950/40 border-l-4 border-l-amber-400 text-amber-200' : 'hover:bg-slate-800/40 text-slate-300'}">
                <div class="truncate pr-2">
                    <h3 class="font-semibold text-sm truncate">${room.name}</h3>
                    <p class="text-[11px] text-slate-400">${room.pictures.length} cuadros</p>
                </div>
            </div>
        `).join('');

        let picturesHTML = '';
        if (activeRoom) {
            picturesHTML = activeRoom.pictures.map(pic => `
                <div data-action="editPicture" data-id="${pic.id}" class="aspect-square bg-slate-900 rounded-xl border border-slate-800 p-2 relative cursor-pointer group hover:border-amber-400 transition overflow-hidden flex flex-col items-center justify-center shadow-md">
                    <img src="${pic.src}" class="max-w-full max-h-full object-contain rounded" alt="${pic.name}">
                    <div class="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition p-3 text-center">
                        <span class="text-white font-bold text-xs truncate w-full mb-1">${pic.name}</span>
                        <span class="text-amber-400 text-xs font-semibold">Editar</span>
                    </div>
                </div>
            `).join('');
        }

        return `
                    <div class="w-full h-full flex flex-col bg-slate-950 pointer-events-auto text-sm text-slate-200 font-sans overflow-hidden">
                        <header class="w-full h-16 min-h-[64px] bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-30 shadow-md flex-shrink-0">
                            <div class="flex items-center gap-4">
                                <button data-action="setMode" data-mode="START" class="group relative w-10 h-10 rounded-xl bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-400/30 hover:border-amber-400 transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow hover:scale-105 active:scale-95 cursor-pointer" title="Ir a la Pantalla de Inicio">
                                    <svg class="w-5 h-5 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    <svg class="w-5 h-5 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                </button>
                                <div class="flex items-center">
                                    <input type="text" id="gallery-title-input" value="${gallery.name}" class="custom-bottomline-input !py-0.5 text-base font-extrabold text-white tracking-tight cursor-text min-w-[200px] max-w-sm" placeholder="Nombre de la Galería..." title="Presiona Enter para guardar el nombre">
                                </div>
                            </div>

                            <div class="flex items-center gap-3">
                                <button data-action="syncGallery" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-2 text-xs font-semibold cursor-pointer" title="Sincronizar con archivo galery.json del servidor">
                                    <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    <span>Sincronizar</span>
                                </button>

                                <label class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-2 text-xs font-semibold" title="Importar Galería desde archivo JSON">
                                    <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    <span>Importar</span>
                                    <input type="file" accept=".json" class="hidden" data-action="importGalleryFile">
                                </label>

                                <button data-action="exportGallery" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-2 text-xs font-semibold cursor-pointer" title="Exportar Galería a archivo JSON">
                                    <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    <span>Exportar</span>
                                </button>
                            </div>
                        </header>

                        <div class="flex-1 flex w-full overflow-hidden relative">
                            <aside class="w-[18vw] min-w-[240px] max-w-[320px] h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 flex-shrink-0">
                                <div class="h-16 min-h-[64px] px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 flex-shrink-0">
                                    <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        <span>Salones (${gallery.rooms.length})</span>
                                    </div>
                                    <button data-action="addRoom" class="w-9 h-9 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition flex items-center justify-center shadow hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0" title="Crear Nuevo Salón">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                </div>
                                <div class="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                                    ${roomListHTML}
                                </div>
                            </aside>

                            <main class="flex-1 h-full flex flex-col bg-slate-950 overflow-hidden">
                                ${activeRoom ? `
                                <div class="h-16 min-h-[64px] border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/60 backdrop-blur flex-shrink-0">
                                    <div class="flex items-center">
                                        <h2 class="text-base font-bold text-white">
                                            ${activeRoom.name}
                                        </h2>
                                    </div>
                                    <div class="flex items-center gap-2.5">
                                        <label class="h-9 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl cursor-pointer transition font-bold text-xs flex items-center gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-95 shadow">
                                            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                            <span>AGREGAR</span>
                                            <input type="file" accept="image/*" multiple class="hidden" data-action="uploadPicture">
                                        </label>
                                        <button data-action="openRoomConfig" class="h-9 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition font-bold text-xs flex items-center gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-95 shadow cursor-pointer">
                                            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            <span>CONFIGURAR</span>
                                        </button>
                                        <button data-action="setMode" data-mode="SPECTATOR" data-room-id="${activeRoom.id}" class="h-9 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl transition transform hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20 text-xs flex items-center gap-2 uppercase tracking-wider cursor-pointer">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            <span>VISITAR</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="flex-1 overflow-y-auto p-8">
                                    ${activeRoom.pictures.length === 0 ? 
                                        `<div class="h-full flex flex-col items-center justify-center text-slate-500">
                                            <svg class="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            <p class="font-medium">No hay cuadros en esta sala</p>
                                            <p class="text-xs text-slate-600 mt-1">Usa el botón "Agregar" para colgar obras</p>
                                        </div>` : 
                                        `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">${picturesHTML}</div>`
                                    }
                                </div>
                                ` : `<div class="flex-1 flex items-center justify-center text-slate-500">Selecciona o crea una sala en el menú izquierdo.</div>`}
                            </main>
                        </div>
                    </div>
                    <div id="modal-container"></div>
                `;
    }
}
