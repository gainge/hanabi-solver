// Central game state management

import {DEFAULT_HAND_SIZE} from '../utils/constants.js';
import {getCardKey, getCardDistribution} from '../utils/helpers.js';
import {initializeHand, clearCard, playDiscardCard, applyExternalConstraintsToHand} from './cardState.js';
import {Card} from '../models/card.js';

class GameState {
    constructor() {
        this.handSize = DEFAULT_HAND_SIZE;
        this.rainbowEnabled = false;
        this.cards = [];
        this.externalCards = {}; // { 'color-number': count }
        this.listeners = [];
    }

    /**
     * Initialize the game state
     */
    initialize() {
        this.cards = initializeHand(this.handSize, this.rainbowEnabled, this.externalCards);
        this.notifyListeners();
    }

    /**
     * Update hand size (reinitializes the hand)
     */
    setHandSize(size) {
        this.handSize = size;
        this.initialize();
    }

    /**
     * Toggle rainbow/purple cards (reinitializes the hand)
     */
    setRainbowEnabled(enabled) {
        this.rainbowEnabled = enabled;
        this.initialize();
    }

    /**
     * Clear a specific card
     */
    clearCardAtPosition(position) {
        const card = this.cards[position];
        if (card) {
            clearCard(card, this.rainbowEnabled, this.externalCards);
            this.notifyListeners();
        }
    }

    /**
     * Play or discard a card at the specified position
     */
    playDiscard(position) {
        this.cards = playDiscardCard(this.cards, position, this.rainbowEnabled, this.externalCards);
        this.notifyListeners();
    }

    /**
     * Apply a hint to the hand
     */
    applyHint(hint) {
        if (!hint.isValid()) {
            console.error('Invalid hint:', hint);
            return false;
        }

        hint.apply(this.cards);
        this.notifyListeners();
        return true;
    }

    /**
     * Mark external cards as seen
     */
    markExternalCards(cardKeys) {
        let updated = false;

        cardKeys.forEach((key) => {
            const currentCount = this.externalCards[key] || 0;
            const [color, numberStr] = key.split('-');
            const number = parseInt(numberStr);
            const maxCount = getCardDistribution(number);

            if (currentCount < maxCount) {
                this.externalCards[key] = currentCount + 1;
                updated = true;
            } else {
                console.warn(`Cannot mark more ${key} cards - already at maximum (${maxCount})`);
            }
        });

        if (updated) {
            // Apply new external constraints to all cards in hand
            applyExternalConstraintsToHand(this.cards, this.externalCards);
            this.notifyListeners();
        }

        return updated;
    }

    /**
     * Get the count of a specific external card type
     */
    getExternalCardCount(color, number) {
        const key = getCardKey(color, number);
        return this.externalCards[key] || 0;
    }

    /**
     * Reset all external cards
     */
    resetExternalCards() {
        this.externalCards = {};
        applyExternalConstraintsToHand(this.cards, this.externalCards);
        this.notifyListeners();
    }

    /**
     * Reset the entire game state
     */
    reset() {
        this.externalCards = {};
        this.initialize();
    }

    /**
     * Subscribe to state changes
     */
    subscribe(listener) {
        this.listeners.push(listener);
    }

    /**
     * Unsubscribe from state changes
     */
    unsubscribe(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    /**
     * Notify all listeners of state change
     */
    notifyListeners() {
        this.listeners.forEach((listener) => listener(this));
    }

    /**
     * Serialize state to JSON
     */
    toJSON() {
        return {
            handSize: this.handSize,
            rainbowEnabled: this.rainbowEnabled,
            cards: this.cards.map((card) => card.toJSON()),
            externalCards: this.externalCards,
        };
    }

    /**
     * Load state from JSON
     */
    fromJSON(json) {
        this.handSize = json.handSize;
        this.rainbowEnabled = json.rainbowEnabled;
        this.externalCards = json.externalCards || {};
        this.cards = json.cards.map((cardJson) => Card.fromJSON(cardJson));
        this.notifyListeners();
    }
}

// Export singleton instance
export const gameState = new GameState();
