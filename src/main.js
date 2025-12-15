// Main application entry point

import {gameState} from './state/gameState.js';
import {renderCardPanels, updateCardPanel} from './ui/cardPanel.js';
import {renderExternalCardsPanel, updateExternalCardsPanel} from './ui/externalCards.js';
import {renderHintPanel, updateHintPanel} from './ui/hintPanel.js';
import {renderSettingsPanel, updateSettingsPanel} from './ui/settings.js';

/**
 * Initialize the application
 */
function init() {
    // Initialize game state
    gameState.initialize();

    // Get container elements
    const cardsContainer = document.getElementById('cards-container');
    const externalCardsContainer = document.getElementById('external-cards-container');
    const hintContainer = document.getElementById('hint-container');
    const settingsContainer = document.getElementById('settings-container');

    // Render initial UI
    renderCardPanels(cardsContainer, gameState.cards, gameState.rainbowEnabled);
    renderExternalCardsPanel(externalCardsContainer, gameState.rainbowEnabled);
    renderHintPanel(hintContainer, gameState.handSize, gameState.rainbowEnabled);
    renderSettingsPanel(settingsContainer, gameState.handSize, gameState.rainbowEnabled);

    // Subscribe to state changes
    gameState.subscribe(handleStateChange);
}

/**
 * Handle state changes
 */
function handleStateChange(state) {
    const cardsContainer = document.getElementById('cards-container');
    const externalCardsContainer = document.getElementById('external-cards-container');
    const hintContainer = document.getElementById('hint-container');
    const settingsContainer = document.getElementById('settings-container');

    // Update card panels
    const existingPanels = cardsContainer.querySelectorAll('.card-panel');

    // Check if we need to re-render completely (hand size changed)
    if (existingPanels.length !== state.cards.length) {
        renderCardPanels(cardsContainer, state.cards, state.rainbowEnabled);
        renderHintPanel(hintContainer, state.handSize, state.rainbowEnabled);
    } else {
        // Update existing panels
        state.cards.forEach((card, index) => {
            const panel = existingPanels[index];
            if (panel) {
                updateCardPanel(panel, card, state.rainbowEnabled);
            }
        });
    }

    // Update external cards panel
    updateExternalCardsPanel(externalCardsContainer, state.rainbowEnabled);

    // Update hint panel if rainbow changed
    const currentHintPanel = hintContainer.querySelector('.hint-panel');
    if (currentHintPanel) {
        updateHintPanel(currentHintPanel, state.handSize, state.rainbowEnabled);
    }

    // Update settings panel
    const currentSettingsPanel = settingsContainer.querySelector('.settings-panel');
    if (currentSettingsPanel) {
        updateSettingsPanel(currentSettingsPanel, state.handSize, state.rainbowEnabled);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
