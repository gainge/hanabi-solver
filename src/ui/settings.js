// Settings UI component

import {DEFAULT_HAND_SIZE, MIN_HAND_SIZE, MAX_HAND_SIZE} from '../utils/constants.js';
import {gameState} from '../state/gameState.js';

/**
 * Create the settings panel
 */
export function createSettingsPanel(handSize, rainbowEnabled) {
    const panel = document.createElement('div');
    panel.className = 'settings-panel';

    const title = document.createElement('h3');
    title.textContent = 'Settings';
    panel.appendChild(title);

    // Hand size setting
    const handSizeContainer = document.createElement('div');
    handSizeContainer.className = 'setting-item';

    const handSizeLabel = document.createElement('label');
    handSizeLabel.textContent = 'Hand Size:';
    handSizeLabel.htmlFor = 'hand-size-input';

    const handSizeInput = document.createElement('input');
    handSizeInput.type = 'number';
    handSizeInput.id = 'hand-size-input';
    handSizeInput.className = 'hand-size-input';
    handSizeInput.min = MIN_HAND_SIZE;
    handSizeInput.max = MAX_HAND_SIZE;
    handSizeInput.value = handSize;

    handSizeInput.addEventListener('change', (e) => {
        const newSize = parseInt(e.target.value);
        if (newSize >= MIN_HAND_SIZE && newSize <= MAX_HAND_SIZE) {
            if (confirm('Changing hand size will reset the game. Continue?')) {
                gameState.setHandSize(newSize);
            } else {
                e.target.value = handSize;
            }
        }
    });

    handSizeContainer.appendChild(handSizeLabel);
    handSizeContainer.appendChild(handSizeInput);

    // Rainbow enabled setting
    const rainbowContainer = document.createElement('div');
    rainbowContainer.className = 'setting-item';

    const rainbowLabel = document.createElement('label');
    rainbowLabel.textContent = 'Enable Purple/Rainbow Cards:';
    rainbowLabel.htmlFor = 'rainbow-checkbox';

    const rainbowCheckbox = document.createElement('input');
    rainbowCheckbox.type = 'checkbox';
    rainbowCheckbox.id = 'rainbow-checkbox';
    rainbowCheckbox.className = 'rainbow-checkbox';
    rainbowCheckbox.checked = rainbowEnabled;

    rainbowCheckbox.addEventListener('change', (e) => {
        if (confirm('Changing rainbow setting will reset the game. Continue?')) {
            gameState.setRainbowEnabled(e.target.checked);
        } else {
            e.target.checked = rainbowEnabled;
        }
    });

    rainbowContainer.appendChild(rainbowLabel);
    rainbowContainer.appendChild(rainbowCheckbox);

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'reset-btn';
    resetBtn.textContent = 'Reset Game';
    resetBtn.addEventListener('click', () => {
        if (confirm('This will reset all cards and external cards. Continue?')) {
            gameState.reset();
        }
    });

    // Assemble panel
    panel.appendChild(handSizeContainer);
    panel.appendChild(rainbowContainer);
    panel.appendChild(resetBtn);

    return panel;
}

/**
 * Update settings panel
 */
export function updateSettingsPanel(panelElement, handSize, rainbowEnabled) {
    const handSizeInput = panelElement.querySelector('#hand-size-input');
    const rainbowCheckbox = panelElement.querySelector('#rainbow-checkbox');

    if (handSizeInput) {
        handSizeInput.value = handSize;
    }

    if (rainbowCheckbox) {
        rainbowCheckbox.checked = rainbowEnabled;
    }
}

/**
 * Render settings panel
 */
export function renderSettingsPanel(containerElement, handSize, rainbowEnabled) {
    containerElement.innerHTML = '';
    const panel = createSettingsPanel(handSize, rainbowEnabled);
    containerElement.appendChild(panel);
}
