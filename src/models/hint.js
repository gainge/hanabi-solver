// Hint model and operations

import {HINT_TYPES, COLOR_NAMES} from '../utils/constants.js';

export class Hint {
    constructor(type, value, isNegative, affectedCards) {
        this.type = type;
        this.value = value;
        this.isNegative = isNegative;
        this.affectedCards = affectedCards; // Array of card positions
    }

    /**
     * Generate a natural language description of this hint
     */
    getDescription() {
        const cardCount = this.affectedCards.length;
        const cardText = cardCount === 1 ? 'This card' : 'These cards';

        if (this.type === HINT_TYPES.COLOR) {
            const colorName = COLOR_NAMES[this.value] || this.value;
            if (this.isNegative) {
                return cardCount === 1
                    ? `This card is not ${colorName.toLowerCase()}`
                    : `None of these cards are ${colorName.toLowerCase()}`;
            } else {
                return cardCount === 1
                    ? `This card is ${colorName.toLowerCase()}`
                    : `These cards are ${colorName.toLowerCase()}`;
            }
        } else if (this.type === HINT_TYPES.NUMBER) {
            if (this.isNegative) {
                return cardCount === 1 ? `This card is not ${this.value}` : `None of these cards are ${this.value}`;
            } else {
                return cardCount === 1 ? `This card is ${this.value}` : `These cards are ${this.value}`;
            }
        }

        return 'Invalid hint';
    }

    /**
     * Apply this hint to the specified cards
     */
    apply(cards) {
        const description = this.getDescription();

        // Step 1: Apply to affected cards
        this.affectedCards.forEach((position) => {
            const card = cards[position];
            if (!card) return;

            if (this.type === HINT_TYPES.COLOR) {
                if (this.isNegative) {
                    card.applyNegativeColorHint(this.value);
                } else {
                    card.applyPositiveColorHint(this.value);
                }
            } else if (this.type === HINT_TYPES.NUMBER) {
                if (this.isNegative) {
                    card.applyNegativeNumberHint(this.value);
                } else {
                    card.applyPositiveNumberHint(this.value);
                }
            }

            card.addToHistory(description);
        });

        // Step 2: Apply inverse to non-affected cards (only for affirmative hints)
        if (!this.isNegative) {
            const affectedSet = new Set(this.affectedCards);
            const inverseDescription = `Excluded from ${this.value} hint`;

            cards.forEach((card, index) => {
                if (!affectedSet.has(index)) {
                    // Apply the inverse (negative) hint
                    if (this.type === HINT_TYPES.COLOR) {
                        card.applyNegativeColorHint(this.value);
                    } else if (this.type === HINT_TYPES.NUMBER) {
                        card.applyNegativeNumberHint(this.value);
                    }

                    card.addToHistory(inverseDescription);
                }
            });
        }
    }

    /**
     * Validate that the hint is valid
     */
    isValid() {
        // Must have a type
        if (!this.type || (this.type !== HINT_TYPES.COLOR && this.type !== HINT_TYPES.NUMBER)) {
            return false;
        }

        // Must have a value
        if (this.value === null || this.value === undefined) {
            return false;
        }

        // Must have at least one affected card
        if (!this.affectedCards || this.affectedCards.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * Serialize hint to JSON
     */
    toJSON() {
        return {
            type: this.type,
            value: this.value,
            isNegative: this.isNegative,
            affectedCards: this.affectedCards,
        };
    }

    /**
     * Create hint from JSON
     */
    static fromJSON(json) {
        return new Hint(json.type, json.value, json.isNegative, json.affectedCards);
    }
}
