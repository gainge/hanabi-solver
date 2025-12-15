// Card state operations

import {Card} from '../models/card.js';

/**
 * Initialize a hand of cards
 */
export function initializeHand(handSize, rainbowEnabled, externalCards = {}) {
    const cards = [];

    for (let i = 0; i < handSize; i++) {
        const card = new Card(`card-${i}`, i, rainbowEnabled);
        card.applyExternalCardConstraints(externalCards);
        cards.push(card);
    }

    return cards;
}

/**
 * Clear a card (reset to all possibilities)
 */
export function clearCard(card, rainbowEnabled, externalCards) {
    card.reset(rainbowEnabled, externalCards);
}

/**
 * Play or discard a card
 * - Removes the card at the specified position
 * - Cards to the LEFT of the removed card shift right (position increases)
 * - Adds a new card at position 0
 */
export function playDiscardCard(cards, position, rainbowEnabled, externalCards) {
    // Remove the card at position
    cards.splice(position, 1);

    // Only cards that were to the LEFT of the removed card need position updates
    // These are now at indices 0 through position-1
    for (let i = 0; i < position; i++) {
        cards[i].position++;
    }

    // Create a new card at position 0
    const newCard = new Card(`card-${Date.now()}`, 0, rainbowEnabled);
    newCard.applyExternalCardConstraints(externalCards);

    // Insert new card at beginning
    cards.unshift(newCard);

    return cards;
}

/**
 * Apply external card constraints to all cards in hand
 */
export function applyExternalConstraintsToHand(cards, externalCards) {
    cards.forEach((card) => {
        card.applyExternalCardConstraints(externalCards);
    });
}

/**
 * Update card IDs to match their positions (useful after reordering)
 */
export function updateCardIds(cards) {
    cards.forEach((card, index) => {
        card.id = `card-${index}`;
        card.position = index;
    });
}
