// Card panel UI component

import {NUMBERS, COLOR_HEX} from '../utils/constants.js';
import {getActiveColors} from '../utils/helpers.js';
import {gameState} from '../state/gameState.js';

/**
 * Create a card panel element
 */
export function createCardPanel(card, rainbowEnabled) {
    const panel = document.createElement('div');
    panel.className = 'card-panel';
    panel.dataset.cardId = card.id;
    panel.dataset.position = card.position;

    // Header with card number and clear button
    const header = document.createElement('div');
    header.className = 'card-header';

    const cardLabel = document.createElement('span');
    cardLabel.className = 'card-label';
    cardLabel.textContent = `${card.position + 1}`;

    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => {
        gameState.clearCardAtPosition(card.position);
    });

    header.appendChild(cardLabel);
    header.appendChild(clearBtn);

    // Grid visualization
    const grid = createCardGrid(card, rainbowEnabled);

    // Hint history
    const historyContainer = document.createElement('div');
    historyContainer.className = 'hint-history';

    const historyList = document.createElement('div');
    historyList.className = 'hint-history-list';
    card.hintHistory.forEach((hint, index) => {
        const hintItem = document.createElement('div');
        hintItem.className = 'hint-item';
        hintItem.textContent = `${index + 1}. ${hint}`;
        historyList.appendChild(hintItem);
    });

    historyContainer.appendChild(historyList);

    // Play/Discard button
    const playDiscardBtn = document.createElement('button');
    playDiscardBtn.className = 'play-discard-btn';
    playDiscardBtn.textContent = 'Play/Discard';
    playDiscardBtn.addEventListener('click', () => {
        gameState.playDiscard(card.position);
    });

    // Assemble panel
    panel.appendChild(header);
    panel.appendChild(grid);
    panel.appendChild(historyContainer);
    panel.appendChild(playDiscardBtn);

    return panel;
}

/**
 * Create the card possibility grid
 */
function createCardGrid(card, rainbowEnabled) {
    const grid = document.createElement('div');
    grid.className = 'card-grid';

    const colors = getActiveColors(rainbowEnabled);

    // Set grid columns to match number of colors
    grid.style.gridTemplateColumns = `repeat(${colors.length}, 1fr)`;

    NUMBERS.forEach((number, numberIndex) => {
        colors.forEach((color) => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.color = color;
            cell.dataset.number = number;

            const isPossible = card.possibilities[color] && card.possibilities[color][numberIndex];

            if (isPossible) {
                cell.classList.add('enabled');
                cell.style.backgroundColor = COLOR_HEX[color];
            } else {
                cell.classList.add('disabled');
            }

            // Add a small label for accessibility
            cell.title = `${color} ${number}`;

            grid.appendChild(cell);
        });
    });

    return grid;
}

/**
 * Update an existing card panel
 */
export function updateCardPanel(panelElement, card, rainbowEnabled) {
    // Update card label and position
    const cardLabel = panelElement.querySelector('.card-label');
    cardLabel.textContent = `${card.position + 1}`;
    panelElement.dataset.position = card.position;

    // Update grid
    const oldGrid = panelElement.querySelector('.card-grid');
    const newGrid = createCardGrid(card, rainbowEnabled);
    oldGrid.replaceWith(newGrid);

    // Update hint history
    const historyList = panelElement.querySelector('.hint-history-list');
    historyList.innerHTML = '';
    card.hintHistory.forEach((hint, index) => {
        const hintItem = document.createElement('div');
        hintItem.className = 'hint-item';
        hintItem.textContent = `${index + 1}. ${hint}`;
        historyList.appendChild(hintItem);
    });

    // Update event listeners with current position
    const clearBtn = panelElement.querySelector('.clear-btn');
    const newClearBtn = clearBtn.cloneNode(true);
    newClearBtn.addEventListener('click', () => {
        gameState.clearCardAtPosition(card.position);
    });
    clearBtn.replaceWith(newClearBtn);

    const playDiscardBtn = panelElement.querySelector('.play-discard-btn');
    const newPlayDiscardBtn = playDiscardBtn.cloneNode(true);
    newPlayDiscardBtn.addEventListener('click', () => {
        gameState.playDiscard(card.position);
    });
    playDiscardBtn.replaceWith(newPlayDiscardBtn);
}

/**
 * Render all card panels in a container
 */
export function renderCardPanels(containerElement, cards, rainbowEnabled) {
    containerElement.innerHTML = '';

    cards.forEach((card) => {
        const panel = createCardPanel(card, rainbowEnabled);
        containerElement.appendChild(panel);
    });
}
