/**
 * @file custom_textarea_input.js
 * @description Componente de área de texto curatorial.
 */

class CustomTextareaInput {
    static render({ id, label, value = '', placeholder = '', extraClass = '' }) {
        return `
            <div class="space-y-2 flex-1 flex flex-col ${extraClass}">
                ${label ? `<label class="block text-xs font-bold text-amber-400 uppercase tracking-wider">${label}</label>` : ''}
                <textarea id="${id}" class="custom-textarea flex-1 resize-none leading-relaxed" placeholder="${placeholder}">${value}</textarea>
            </div>
        `;
    }
}

export { CustomTextareaInput };
