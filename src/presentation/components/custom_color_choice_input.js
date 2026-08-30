/**
 * @file custom_color_choice_input.js
 * @description Componente de selección de colores con presets y selector nativo.
 */

import { SHARED_COLOR_PRESETS } from './color_presets.js';

class CustomColorChoiceInput {
    static render({ id, label, value = '#ef4444', typePrefix, extraClass = '' }) {
        const isCustom = !SHARED_COLOR_PRESETS.some(p => p.hex.toLowerCase() === value.toLowerCase());
        const customBg = isCustom ? `background-color: ${value};` : '';
        const customClass = isCustom ? '' : 'rainbow-swatch';

        return `
            <div class="space-y-3 ${extraClass}">
                ${label ? `<label class="block text-xs font-bold text-amber-400 uppercase tracking-wider">${label}</label>` : ''}
                <div class="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    ${SHARED_COLOR_PRESETS.map(p => {
                        const active = p.hex.toLowerCase() === value.toLowerCase();
                        return `
                            <button type="button" data-type="${typePrefix}-preset" data-color="${p.hex}" title="${p.name}" 
                                    style="background-color: ${p.hex}" 
                                    class="w-11 h-11 rounded-full border border-white/20 shadow hover:scale-110 transition active:scale-95 cursor-pointer ${active ? 'ring-2 ring-amber-400 scale-105' : ''}"></button>
                        `;
                    }).join('')}
                    <label id="${id}-custom-label" style="${customBg}" class="relative w-11 h-11 rounded-full ${customClass} cursor-pointer shadow hover:scale-110 transition border border-white/40 flex items-center justify-center ${isCustom ? 'ring-2 ring-amber-400 scale-105' : ''}" title="Color Personalizado">
                        <input type="color" id="${id}" value="${value}" class="opacity-0 absolute inset-0 w-full h-full cursor-pointer">
                    </label>
                </div>
            </div>
        `;
    }

    static bind({ id, typePrefix, onChange }) {
        const input = document.getElementById(id);
        const customLabel = document.getElementById(`${id}-custom-label`);
        const presetBtns = document.querySelectorAll(`[data-type="${typePrefix}-preset"]`);

        const updateCustomState = (color, isCustomPicked) => {
            if (isCustomPicked) {
                if (customLabel) {
                    customLabel.classList.remove('rainbow-swatch');
                    customLabel.style.backgroundColor = color;
                    customLabel.classList.add('ring-2', 'ring-amber-400', 'scale-105');
                }
                presetBtns.forEach(btn => btn.classList.remove('ring-2', 'ring-amber-400', 'scale-105'));
            } else {
                if (customLabel) {
                    customLabel.classList.add('rainbow-swatch');
                    customLabel.style.backgroundColor = '';
                    customLabel.classList.remove('ring-2', 'ring-amber-400', 'scale-105');
                }
            }
            if (onChange) onChange(color);
        };

        if (input) {
            input.addEventListener('input', (e) => {
                updateCustomState(e.target.value, true);
            });
        }

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                if (input) input.value = color;
                presetBtns.forEach(b => {
                    const isMatch = b.dataset.color.toLowerCase() === color.toLowerCase();
                    b.classList.toggle('ring-2', isMatch);
                    b.classList.toggle('ring-amber-400', isMatch);
                    b.classList.toggle('scale-105', isMatch);
                });
                updateCustomState(color, false);
            });
        });
    }
}

export { CustomColorChoiceInput };
