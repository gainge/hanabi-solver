// External cards UI component

import {NUMBERS, COLOR_HEX} from '../utils/constants.js';
import {getActiveColors, getCardKey, getCardDistribution} from '../utils/helpers.js';
import {gameState} from '../state/gameState.js';

let selectedCards = new Set();

/**
 * Create the external cards panel
 */
export function createExternalCardsPanel(rainbowEnabled) {
    const panel = document.createElement('div');
    panel.className = 'external-cards-panel';

    const title = document.createElement('h3');
    title.textContent = 'External Cards';
    panel.appendChild(title);

    // Grid
    const grid = createExternalCardsGrid(rainbowEnabled);
    panel.appendChild(grid);

    // Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'external-cards-buttons';

    const markSeenBtn = document.createElement('button');
    markSeenBtn.className = 'mark-seen-btn';
    markSeenBtn.textContent = 'Mark Seen';
    markSeenBtn.addEventListener('click', handleMarkSeen);

    const clearSelectionBtn = document.createElement('button');
    clearSelectionBtn.className = 'clear-selection-btn';
    clearSelectionBtn.textContent = 'Clear Selection';
    clearSelectionBtn.addEventListener('click', handleClearSelection);

    buttonsContainer.appendChild(markSeenBtn);
    buttonsContainer.appendChild(clearSelectionBtn);

    panel.appendChild(buttonsContainer);

    return panel;
}

/**
 * Create the external cards grid
 */
function createExternalCardsGrid(rainbowEnabled) {
    const grid = document.createElement('div');
    grid.className = 'external-cards-grid';

    const colors = getActiveColors(rainbowEnabled);

    colors.forEach((color) => {
        NUMBERS.forEach((number) => {
            const cell = document.createElement('div');
            cell.className = 'external-card-cell';
            cell.dataset.color = color;
            cell.dataset.number = number;

            const key = getCardKey(color, number);
            const seenCount = gameState.getExternalCardCount(color, number);
            const maxCount = getCardDistribution(number);

            cell.style.backgroundColor = COLOR_HEX[color];
            cell.title = `${color} ${number} (${seenCount}/${maxCount})`;

            // Create count indicator
            const countIndicator = document.createElement('div');
            countIndicator.className = 'count-indicator';
            countIndicator.textContent = `${seenCount}/${maxCount}`;
            cell.appendChild(countIndicator);

            // Click to select/deselect
            cell.addEventListener('click', () => {
                toggleCellSelection(cell, key);
            });

            grid.appendChild(cell);
        });
    });

    return grid;
}

/**
 * Toggle cell selection
 */
function toggleCellSelection(cell, cardKey) {
    if (selectedCards.has(cardKey)) {
        selectedCards.delete(cardKey);
        cell.classList.remove('selected');
    } else {
        selectedCards.add(cardKey);
        cell.classList.add('selected');
    }
}

/**
 * Handle mark seen button click
 */
function handleMarkSeen() {
    if (selectedCards.size === 0) {
        alert('Please select cards to mark as seen');
        return;
    }

    const success = gameState.markExternalCards(Array.from(selectedCards));

    if (success) {
        selectedCards.clear();
        // UI will update via state listener
    }
}

/**
 * Handle clear selection button click
 */
function handleClearSelection() {
    selectedCards.clear();
    document.querySelectorAll('.external-card-cell.selected').forEach((cell) => {
        cell.classList.remove('selected');
    });
}

/**
 * Update the external cards panel
 */
export function updateExternalCardsPanel(panelElement, rainbowEnabled) {
    const oldGrid = panelElement.querySelector('.external-cards-grid');
    const newGrid = createExternalCardsGrid(rainbowEnabled);
    oldGrid.replaceWith(newGrid);

    // Clear selection after update
    selectedCards.clear();
}

/**
 * Render the external cards panel
 */
export function renderExternalCardsPanel(containerElement, rainbowEnabled) {
    containerElement.innerHTML = '';
    const panel = createExternalCardsPanel(rainbowEnabled);
    containerElement.appendChild(panel);
}
