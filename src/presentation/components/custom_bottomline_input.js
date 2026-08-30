/**
 * @file custom_bottomline_input.js
 * @description Componente de campo de entrada con línea inferior dorada.
 */

class CustomBottomlineInput {
    static render({ id, label, value = '', placeholder = '', type = 'text', extraClass = '' }) {
        return `
            <div class="space-y-2 ${extraClass}">
                ${label ? `<label class="block text-xs font-bold text-amber-400 uppercase tracking-wider">${label}</label>` : ''}
                <input type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" class="custom-bottomline-input text-base font-medium">
            </div>
        `;
    }
}

export { CustomBottomlineInput };
