// Game constants for Hanabi

export const COLORS = {
    RED: 'red',
    YELLOW: 'yellow',
    GREEN: 'green',
    BLUE: 'blue',
    WHITE: 'white',
    PURPLE: 'purple',
};

export const COLOR_ORDER = [COLORS.RED, COLORS.YELLOW, COLORS.GREEN, COLORS.BLUE, COLORS.WHITE, COLORS.PURPLE];

export const COLOR_NAMES = {
    [COLORS.RED]: 'Red',
    [COLORS.YELLOW]: 'Yellow',
    [COLORS.GREEN]: 'Green',
    [COLORS.BLUE]: 'Blue',
    [COLORS.WHITE]: 'White',
    [COLORS.PURPLE]: 'Purple',
};

export const COLOR_HEX = {
    [COLORS.RED]: '#e74c3c',
    [COLORS.YELLOW]: '#f1c40f',
    [COLORS.GREEN]: '#2ecc71',
    [COLORS.BLUE]: '#3498db',
    [COLORS.WHITE]: '#ecf0f1',
    [COLORS.PURPLE]: '#9b59b6',
};

export const NUMBERS = [1, 2, 3, 4, 5];

// Card distribution per color in standard Hanabi
// Three 1s, two 2s, two 3s, two 4s, one 5
export const CARD_DISTRIBUTION = {
    1: 3,
    2: 2,
    3: 2,
    4: 2,
    5: 1,
};

export const DEFAULT_HAND_SIZE = 4;
export const MIN_HAND_SIZE = 2;
export const MAX_HAND_SIZE = 6;

export const HINT_TYPES = {
    COLOR: 'color',
    NUMBER: 'number',
};
