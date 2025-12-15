// Card model and operations

import {NUMBERS} from '../utils/constants.js';
import {createFullPossibilities, clonePossibilities, isCardExhausted} from '../utils/helpers.js';

export class Card {
    constructor(id, position, rainbowEnabled) {
        this.id = id;
        this.position = position;
        this.possibilities = createFullPossibilities(rainbowEnabled);
        this.hintHistory = [];
    }

    /**
     * Reset card to all possibilities enabled
     */
    reset(rainbowEnabled, externalCards) {
        this.possibilities = createFullPossibilities(rainbowEnabled);
        this.hintHistory = [];
        this.applyExternalCardConstraints(externalCards);
    }

    /**
     * Apply external card constraints to eliminate impossible cards
     */
    applyExternalCardConstraints(externalCards) {
        Object.keys(this.possibilities).forEach((color) => {
            NUMBERS.forEach((number, index) => {
                if (isCardExhausted(color, number, externalCards)) {
                    this.possibilities[color][index] = false;
                }
            });
        });
    }

    /**
     * Apply a positive color hint (this card IS the specified color)
     */
    applyPositiveColorHint(color) {
        Object.keys(this.possibilities).forEach((c) => {
            if (c !== color) {
                // Disable all other colors
                this.possibilities[c] = [false, false, false, false, false];
            }
        });
    }

    /**
     * Apply a negative color hint (this card is NOT the specified color)
     */
    applyNegativeColorHint(color) {
        if (this.possibilities[color]) {
            this.possibilities[color] = [false, false, false, false, false];
        }
    }

    /**
     * Apply a positive number hint (this card IS the specified number)
     */
    applyPositiveNumberHint(number) {
        const numberIndex = number - 1;
        Object.keys(this.possibilities).forEach((color) => {
            this.possibilities[color] = this.possibilities[color].map((possible, index) => {
                return index === numberIndex ? possible : false;
            });
        });
    }

    /**
     * Apply a negative number hint (this card is NOT the specified number)
     */
    applyNegativeNumberHint(number) {
        const numberIndex = number - 1;
        Object.keys(this.possibilities).forEach((color) => {
            this.possibilities[color][numberIndex] = false;
        });
    }

    /**
     * Add a hint description to history
     */
    addToHistory(description) {
        this.hintHistory.push(description);
    }

    /**
     * Clone this card
     */
    clone() {
        const cloned = Object.create(Card.prototype);
        cloned.id = this.id;
        cloned.position = this.position;
        cloned.possibilities = clonePossibilities(this.possibilities);
        cloned.hintHistory = [...this.hintHistory];
        return cloned;
    }

    /**
     * Serialize card to JSON
     */
    toJSON() {
        return {
            id: this.id,
            position: this.position,
            possibilities: this.possibilities,
            hintHistory: this.hintHistory,
        };
    }

    /**
     * Create card from JSON
     */
    static fromJSON(json) {
        const card = Object.create(Card.prototype);
        card.id = json.id;
        card.position = json.position;
        card.possibilities = json.possibilities;
        card.hintHistory = json.hintHistory || [];
        return card;
    }
}
