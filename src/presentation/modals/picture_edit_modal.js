/**
 * @file picture_edit_modal.js
 * @description Componente modal para la edición de una obra pictórica (título, descripción, color de marco con preview).
 */

import { CustomBottomlineInput } from '../components/custom_bottomline_input.js';
import { CustomTextareaInput } from '../components/custom_textarea_input.js';
import { CustomColorChoiceInput } from '../components/custom_color_choice_input.js';

export class PictureEditModal {
    /**
     * Renderiza el markup HTML del modal de edición de obra.
     * @param {object} options
     * @param {object} options.pic - Instancia de GalleryPicture a editar.
     * @returns {string} Markup HTML.
     */
    static render({ pic }) {
        const currentFrameColor = pic.frameColor || '#eab308';

        return `
            <div class="fixed inset-0 bg-black/85 flex items-center justify-center z-50 pointer-events-auto backdrop-blur-md p-4">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl h-[540px] overflow-hidden flex flex-col md:flex-row">
                    
                    <div class="w-full md:w-[42%] bg-slate-950 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800 relative">
                        <div class="relative max-w-full max-h-full flex flex-col items-center justify-center">
                            <div class="p-1.5 bg-slate-900/80 rounded-xl shadow-2xl border border-white/5 flex items-center justify-center">
                                <img id="pic-preview-img" src="${pic.src}" class="max-h-60 max-w-full object-contain rounded transition-all duration-200 border-[7px] shadow-lg" style="border-color: ${currentFrameColor};" alt="${pic.name}">
                            </div>
                        </div>
                    </div>

                    <div class="w-full md:w-[58%] flex flex-col h-full bg-slate-900">
                        <div class="h-[60px] px-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center flex-shrink-0">
                            <h3 class="text-base font-bold text-white tracking-wide">Editar Cuadro</h3>
                            <button data-action="closeModal" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div class="h-[46px] flex border-b border-slate-800 bg-slate-950 px-6 gap-8 text-xs flex-shrink-0">
                            <button type="button" data-pictab="pictab-identidad" class="tab-btn active font-semibold text-slate-300 hover:text-amber-300 flex items-center cursor-pointer">
                                IDENTIDAD
                            </button>
                            <button type="button" data-pictab="pictab-apariencia" class="tab-btn font-semibold text-slate-400 hover:text-amber-300 flex items-center cursor-pointer">
                                APARIENCIA
                            </button>
                        </div>

                        <div class="flex-1 p-6 overflow-hidden relative">
                            
                            <div id="pictab-identidad" class="pictab-content h-full flex flex-col justify-start space-y-6">
                                ${CustomBottomlineInput.render({
                                    id: 'pic-name',
                                    label: 'Título de la Obra',
                                    value: pic.name,
                                    placeholder: 'Título de la obra'
                                })}
                                ${CustomTextareaInput.render({
                                    id: 'pic-desc',
                                    label: 'Descripción Curatorial',
                                    value: pic.description || '',
                                    placeholder: 'Escribe aquí la descripción y contexto histórico de la obra...'
                                })}
                            </div>

                            <div id="pictab-apariencia" class="pictab-content hidden h-full flex flex-col justify-start space-y-6 pt-2">
                                ${CustomColorChoiceInput.render({
                                    id: 'pic-frame',
                                    label: 'Color del Marco',
                                    value: currentFrameColor,
                                    typePrefix: 'frame'
                                })}
                                <p class="text-[11px] text-slate-500 leading-normal">Los cambios de color se reflejan en tiempo real en la vista previa del marco.</p>
                            </div>

                        </div>

                        <div class="h-[76px] px-6 border-t border-slate-800 bg-slate-950 flex items-center flex-shrink-0">
                            <div class="grid grid-cols-3 gap-3 w-full">
                                <button data-action="deletePicConfirm" data-id="${pic.id}" class="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Eliminar
                                </button>
                                <button data-action="closeModal" class="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    Cancelar
                                </button>
                                <button data-action="savePicConfig" data-id="${pic.id}" class="py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    Guardar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vincula los listeners de eventos para pestañas y selector de color del marco.
     */
    static bindEvents() {
        const tabBtns = document.querySelectorAll('[data-pictab]');
        const tabContents = document.querySelectorAll('.pictab-content');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.pictab;
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.add('hidden'));

                btn.classList.add('active');
                const targetContent = document.getElementById(targetId);
                if (targetContent) targetContent.classList.remove('hidden');
            });
        });

        const previewImg = document.getElementById('pic-preview-img');
        CustomColorChoiceInput.bind({
            id: 'pic-frame',
            typePrefix: 'frame',
            onChange: (color) => {
                if (previewImg) previewImg.style.borderColor = color;
            }
        });
    }
}
