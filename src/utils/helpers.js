// Utility helper functions

import {COLORS, COLOR_ORDER, CARD_DISTRIBUTION} from './constants.js';

/**
 * Get the maximum count for a given card type (color-number combination)
 */
export function getCardDistribution(number) {
    return CARD_DISTRIBUTION[number] || 0;
}

/**
 * Generate a card key from color and number
 */
export function getCardKey(color, number) {
    return `${color}-${number}`;
}

/**
 * Parse a card key into color and number
 */
export function parseCardKey(key) {
    const [color, numberStr] = key.split('-');
    return {color, number: parseInt(numberStr)};
}

/**
 * Get active colors based on rainbow setting
 */
export function getActiveColors(rainbowEnabled) {
    if (rainbowEnabled) {
        return COLOR_ORDER;
    }
    return COLOR_ORDER.filter((c) => c !== COLORS.PURPLE);
}

/**
 * Create a new empty possibilities object
 */
export function createEmptyPossibilities(rainbowEnabled) {
    const possibilities = {};
    const colors = getActiveColors(rainbowEnabled);

    colors.forEach((color) => {
        possibilities[color] = [false, false, false, false, false]; // Numbers 1-5
    });

    return possibilities;
}

/**
 * Create a new full possibilities object (all enabled)
 */
export function createFullPossibilities(rainbowEnabled) {
    const possibilities = {};
    const colors = getActiveColors(rainbowEnabled);

    colors.forEach((color) => {
        possibilities[color] = [true, true, true, true, true]; // Numbers 1-5
    });

    return possibilities;
}

/**
 * Clone a possibilities object
 */
export function clonePossibilities(possibilities) {
    const clone = {};
    Object.keys(possibilities).forEach((color) => {
        clone[color] = [...possibilities[color]];
    });
    return clone;
}

/**
 * Count total remaining possibilities for a card
 */
export function countPossibilities(possibilities) {
    let count = 0;
    Object.keys(possibilities).forEach((color) => {
        possibilities[color].forEach((possible) => {
            if (possible) count++;
        });
    });
    return count;
}

/**
 * Check if all cards of a type have been seen
 */
export function isCardExhausted(color, number, externalCards) {
    const key = getCardKey(color, number);
    const seen = externalCards[key] || 0;
    const max = getCardDistribution(number);
    return seen >= max;
}
