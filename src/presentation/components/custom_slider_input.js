/**
 * @file custom_slider_input.js
 * @description Componente de control deslizante rectangular.
 */

class CustomSliderInput {
    static render({ id, label, min = 0.2, max = 5.0, step = 0.1, value = 1.0, badgeId }) {
        return `
            <div class="space-y-2">
                <div class="flex justify-between items-center text-xs">
                    ${label ? `<span class="font-bold text-white">${label}</span>` : ''}
                    <span class="font-mono text-amber-400 font-bold" id="${badgeId}">${parseFloat(value).toFixed(1)}x</span>
                </div>
                <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" class="rectangular-slider">
            </div>
        `;
    }

    static bind({ id, badgeId, onChange }) {
        const input = document.getElementById(id);
        const badge = document.getElementById(badgeId);

        const updateFill = (val) => {
            if (!input) return;
            const min = parseFloat(input.min) || 0.2;
            const max = parseFloat(input.max) || 5.0;
            const pct = ((val - min) / (max - min)) * 100;
            input.style.background = `linear-gradient(to right, #facc15 0%, #facc15 ${pct}%, #1e293b ${pct}%, #1e293b 100%)`;
        };

        if (input) {
            updateFill(input.value);
            input.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                if (badge) badge.innerText = `${val.toFixed(1)}x`;
                updateFill(val);
                if (onChange) onChange(val);
            });
        }
    }
}

export { CustomSliderInput };
