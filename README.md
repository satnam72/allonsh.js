# Allonsh.js

Lightweight, dependency-free drag-and-drop with precise native target detection and easy customization.

## Features

- Minimal, dependency-free drag-and-drop solution
- Uses native `elementFromPoint` to detect drop targets precisely
- Supports stacking of draggable elements inside dropzones
- Optionally restricts dragging to designated dropzones
- Touch and mouse support for modern browsers
- Customizable selectors for draggables, dropzones, and play area
- Simple API to add/remove draggable elements and reset layout
- Emits custom events (`allonsh-dragstart`, `allonsh-drop`, etc.) for easy integration

## Usage

Initialize Allonsh by importing the module and providing the required options.

```js
import Allonsh from './allonsh.js';

// Initialize Allonsh with options
const allonsh = new Allonsh({
  draggableSelector: 'allonsh-draggable',   // Required: class for draggable elements
  dropzoneSelector: 'allonsh-dropzone',     // Optional: class for dropzones
  playAreaSelector: 'play-area',             // Optional: class for the container area
  restrictToDropzones: false,                // Optional: restrict dragging to dropzones
  enableStacking: true,                      // Optional: enable stacking inside dropzones
  stackDirection: 'horizontal',              // Optional: 'horizontal' or 'vertical'
  stackSpacing: 8                            // Optional: spacing between stacked items (px)
});
```

## Demo

Try the demo by running a local server and opening the demo page:

```bash
# Install dependencies first
npm install

# Start a simple local server (Python example)
python3 -m http.server 8000

# Open in browser
http://localhost:8000/demo/index.html
```

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests to improve allonsh.js.

If you're unable to contribute, you can still support the project by giving it a ⭐️ on GitHub!
