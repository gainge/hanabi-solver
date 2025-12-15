# Hanabi Solver

Generated as an experiment with Claude

A web-based vanilla JavaScript tool to help track possible card states in the cooperative card game Hanabi.

## About Hanabi

Hanabi is a cooperative card game where players can see each other's cards but not their own. Players give hints about colors and numbers to help teammates deduce what cards they're holding. This solver helps manage the complex deduction process by tracking which cards are possible given the hints received.

## Features

- **Card Tracking**: Track up to 6 cards (configurable) with visual possibility grids
- **Hint System**: Apply positive and negative hints for both colors and numbers
- **External Card Tracking**: Mark cards seen in other players' hands or played/discarded
- **Card Distribution**: Accounts for actual Hanabi card distribution (3-2-2-2-1 per color)
- **Rainbow/Purple Cards**: Optional 6th color support
- **Hint History**: View all hints applied to each card
- **Play/Discard**: Simulate card actions with automatic hand shifting

## Running the Application

Since this application uses ES6 modules, you'll need to serve it through a local web server (not via `file://` protocol).

### Option 1: Python (recommended)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open http://localhost:8000 in your browser.

### Option 2: Node.js

```bash
npx http-server -p 8000
```

### Option 3: VS Code Live Server

Install the "Live Server" extension and click "Go Live" in the bottom right.

## How to Use

### Card Panels (Left Section)

Each card panel shows:

- **Card number** (1-4 by default)
- **Possibility grid**: Shows which card combinations are possible
  - Colored cells = possible
  - Greyed cells = eliminated
- **Hint history**: List of all hints applied to this card
- **Clear button**: Reset card to all possibilities
- **Play/Discard button**: Remove the card and deal a new one

### External Cards Panel (Right Section)

Mark cards you've seen outside your hand:

1. Click cells to select cards
2. Click "Mark Seen" to record them
3. The solver automatically eliminates impossible cards from your hand based on distribution limits

Each cell shows a counter (e.g., "2/3" means 2 of 3 red 1s have been seen).

### Hint Panel

Apply hints to your cards:

1. Select a color or number:
   - **Left-click**: Positive hint ("this card IS blue")
   - **Right-click**: Negative hint ("this card is NOT blue")
   - Click again to deselect
2. Check which cards the hint applies to
3. Review the hint preview
4. Click "Apply Hint"

The solver will update card possibilities accordingly.

### Settings Panel

- **Hand Size**: Change number of cards (2-6), default 4
- **Purple/Rainbow Cards**: Enable the 6th color
- **Reset Game**: Clear all state and start over

Note: Changing settings resets the game state.

## Technical Details

### Project Structure

```
hanabi-solver/
├── index.html           # Main HTML
├── styles/
│   └── main.css        # All styling
├── src/
│   ├── main.js         # Entry point
│   ├── state/
│   │   ├── gameState.js     # State management
│   │   └── cardState.js     # Card operations
│   ├── models/
│   │   ├── card.js          # Card model
│   │   └── hint.js          # Hint model
│   ├── ui/
│   │   ├── cardPanel.js     # Card UI
│   │   ├── externalCards.js # External cards UI
│   │   ├── hintPanel.js     # Hint UI
│   │   └── settings.js      # Settings UI
│   └── utils/
│       ├── constants.js     # Game constants
│       └── helpers.js       # Utilities
```

### Card Distribution

Standard Hanabi deck has 50 cards (60 with rainbow):

- **Per color**: Three 1s, two 2s, two 3s, two 4s, one 5
- **Colors**: Red, Yellow, Green, Blue, White (+ Purple if enabled)

The solver enforces these limits when marking external cards.

## Tips for Play

1. Start by marking any cards you can see immediately
2. Apply hints as they're given to you
3. Use negative hints to narrow down possibilities after affirmative hints
4. Cross-reference multiple hints to deduce exact cards
5. The possibility grid updates automatically based on all constraints

## Browser Compatibility

Works in all modern browsers that support ES6 modules:

- Chrome/Edge 61+
- Firefox 60+
- Safari 11+

## License

This is an educational tool for the game Hanabi by Antoine Bauza.
