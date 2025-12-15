// Hint panel UI component

import {NUMBERS, HINT_TYPES, COLOR_NAMES, COLOR_HEX} from '../utils/constants.js';
import {getActiveColors} from '../utils/helpers.js';
import {Hint} from '../models/hint.js';
import {gameState} from '../state/gameState.js';

let selectedColor = null;
let colorIsNegative = false;
let selectedNumber = null;
let numberIsNegative = false;
let selectedCardPositions = new Set();

/**
 * Create the hint panel
 */
export function createHintPanel(handSize, rainbowEnabled) {
    const panel = document.createElement('div');
    panel.className = 'hint-panel';

    const title = document.createElement('h3');
    title.textContent = 'Hint';
    panel.appendChild(title);

    // Color buttons
    const colorRow = createColorButtons(rainbowEnabled);
    panel.appendChild(colorRow);

    // Number buttons
    const numberRow = createNumberButtons();
    panel.appendChild(numberRow);

    // Card checkboxes
    const checkboxContainer = createCardCheckboxes(handSize);
    panel.appendChild(checkboxContainer);

    // Hint preview
    const preview = document.createElement('div');
    preview.className = 'hint-preview';
    preview.id = 'hint-preview';
    preview.textContent = 'Select a hint and card(s)';
    panel.appendChild(preview);

    // Apply button
    const applyBtn = document.createElement('button');
    applyBtn.className = 'apply-hint-btn';
    applyBtn.textContent = 'Apply Hint';
    applyBtn.addEventListener('click', handleApplyHint);
    panel.appendChild(applyBtn);

    return panel;
}

/**
 * Create color selection buttons
 */
function createColorButtons(rainbowEnabled) {
    const container = document.createElement('div');
    container.className = 'color-buttons';

    const label = document.createElement('label');
    label.textContent = 'Color:';
    container.appendChild(label);

    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'button-row';

    const colors = getActiveColors(rainbowEnabled);

    colors.forEach((color) => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.dataset.color = color;
        btn.textContent = COLOR_NAMES[color];
        btn.style.backgroundColor = COLOR_HEX[color];

        // Add click handlers for left/right click
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleColorButtonClick(color, false);
        });

        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            handleColorButtonClick(color, true);
        });

        buttonsRow.appendChild(btn);
    });

    container.appendChild(buttonsRow);
    return container;
}

/**
 * Create number selection buttons
 */
function createNumberButtons() {
    const container = document.createElement('div');
    container.className = 'number-buttons';

    const label = document.createElement('label');
    label.textContent = 'Number:';
    container.appendChild(label);

    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'button-row';

    NUMBERS.forEach((number) => {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.dataset.number = number;
        btn.textContent = number;

        // Add click handlers for left/right click
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleNumberButtonClick(number, false);
        });

        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            handleNumberButtonClick(number, true);
        });

        buttonsRow.appendChild(btn);
    });

    container.appendChild(buttonsRow);
    return container;
}

/**
 * Create card selection checkboxes
 */
function createCardCheckboxes(handSize) {
    const container = document.createElement('div');
    container.className = 'card-checkboxes';

    const label = document.createElement('label');
    label.textContent = 'Cards:';
    container.appendChild(label);

    const checkboxRow = document.createElement('div');
    checkboxRow.className = 'checkbox-row';

    for (let i = 0; i < handSize; i++) {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'card-checkbox';
        checkbox.dataset.position = i;
        checkbox.addEventListener('change', (e) => {
            handleCardCheckboxChange(i, e.target.checked);
        });

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode(` Card ${i + 1}`));

        checkboxRow.appendChild(checkboxLabel);
    }

    container.appendChild(checkboxRow);
    return container;
}

/**
 * Handle color button click
 */
function handleColorButtonClick(color, isNegative) {
    // If same color clicked with same type, deselect
    if (selectedColor === color && colorIsNegative === isNegative) {
        selectedColor = null;
        colorIsNegative = false;
    } else {
        selectedColor = color;
        colorIsNegative = isNegative;
        // Clear number selection
        selectedNumber = null;
        numberIsNegative = false;
    }

    updateButtonStates();
    updateHintPreview();
}

/**
 * Handle number button click
 */
function handleNumberButtonClick(number, isNegative) {
    // If same number clicked with same type, deselect
    if (selectedNumber === number && numberIsNegative === isNegative) {
        selectedNumber = null;
        numberIsNegative = false;
    } else {
        selectedNumber = number;
        numberIsNegative = isNegative;
        // Clear color selection
        selectedColor = null;
        colorIsNegative = false;
    }

    updateButtonStates();
    updateHintPreview();
}

/**
 * Handle card checkbox change
 */
function handleCardCheckboxChange(position, checked) {
    if (checked) {
        selectedCardPositions.add(position);
    } else {
        selectedCardPositions.delete(position);
    }

    updateHintPreview();
}

/**
 * Update button visual states
 */
function updateButtonStates() {
    // Update color buttons
    document.querySelectorAll('.color-btn').forEach((btn) => {
        const color = btn.dataset.color;
        btn.classList.remove('selected-affirmative', 'selected-negative');

        if (selectedColor === color) {
            if (colorIsNegative) {
                btn.classList.add('selected-negative');
            } else {
                btn.classList.add('selected-affirmative');
            }
        }
    });

    // Update number buttons
    document.querySelectorAll('.number-btn').forEach((btn) => {
        const number = parseInt(btn.dataset.number);
        btn.classList.remove('selected-affirmative', 'selected-negative');

        if (selectedNumber === number) {
            if (numberIsNegative) {
                btn.classList.add('selected-negative');
            } else {
                btn.classList.add('selected-affirmative');
            }
        }
    });
}

/**
 * Update hint preview text
 */
function updateHintPreview() {
    const preview = document.getElementById('hint-preview');

    if (!preview) return;

    // Check if we have a hint and cards selected
    const hasHint = selectedColor !== null || selectedNumber !== null;
    const hasCards = selectedCardPositions.size > 0;

    if (!hasHint || !hasCards) {
        preview.textContent = 'Select a hint and card(s)';
        return;
    }

    // Create temporary hint to get description
    let hint;
    if (selectedColor !== null) {
        hint = new Hint(HINT_TYPES.COLOR, selectedColor, colorIsNegative, Array.from(selectedCardPositions));
    } else {
        hint = new Hint(HINT_TYPES.NUMBER, selectedNumber, numberIsNegative, Array.from(selectedCardPositions));
    }

    preview.textContent = hint.getDescription();
}

/**
 * Handle apply hint button click
 */
function handleApplyHint() {
    const hasHint = selectedColor !== null || selectedNumber !== null;
    const hasCards = selectedCardPositions.size > 0;

    if (!hasHint) {
        alert('Please select a color or number hint');
        return;
    }

    if (!hasCards) {
        alert('Please select at least one card');
        return;
    }

    // Create hint
    let hint;
    if (selectedColor !== null) {
        hint = new Hint(HINT_TYPES.COLOR, selectedColor, colorIsNegative, Array.from(selectedCardPositions));
    } else {
        hint = new Hint(HINT_TYPES.NUMBER, selectedNumber, numberIsNegative, Array.from(selectedCardPositions));
    }

    // Apply hint
    const success = gameState.applyHint(hint);

    if (success) {
        // Clear selections
        resetHintPanel();
    }
}

/**
 * Reset hint panel selections
 */
function resetHintPanel() {
    selectedColor = null;
    colorIsNegative = false;
    selectedNumber = null;
    numberIsNegative = false;
    selectedCardPositions.clear();

    updateButtonStates();
    updateHintPreview();

    // Uncheck all checkboxes
    document.querySelectorAll('.card-checkbox').forEach((checkbox) => {
        checkbox.checked = false;
    });
}

/**
 * Update hint panel (e.g., when hand size changes)
 */
export function updateHintPanel(panelElement, handSize, rainbowEnabled) {
    // Reset selections
    resetHintPanel();

    // Update color buttons if rainbow changed
    const oldColorRow = panelElement.querySelector('.color-buttons');
    const newColorRow = createColorButtons(rainbowEnabled);
    oldColorRow.replaceWith(newColorRow);

    // Update checkboxes if hand size changed
    const oldCheckboxes = panelElement.querySelector('.card-checkboxes');
    const newCheckboxes = createCardCheckboxes(handSize);
    oldCheckboxes.replaceWith(newCheckboxes);
}

/**
 * Render hint panel
 */
export function renderHintPanel(containerElement, handSize, rainbowEnabled) {
    containerElement.innerHTML = '';
    const panel = createHintPanel(handSize, rainbowEnabled);
    containerElement.appendChild(panel);
}
