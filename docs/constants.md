# Allonsh.js Constants Documentation

This document provides a detailed reference for the constants defined in `src/constants.js` for the Allonsh.js project. These constants centralize configuration and hardcoded values used throughout the library, ensuring consistency and maintainability.

## Z_INDEX

Defines z-index values for various UI elements to control stacking order:

- `GHOST`: 99 — Used for ghost elements during drag operations.
- `DRAGGING`: 100 — Active dragging element.

## DEFAULTS

Default configuration values for stack layout and direction:

- `STACK_SPACING`: 5 — Default spacing between stack items.
- `STACK_DIRECTION`: 'horizontal' — Default stack direction.

## CSS_CLASSES

CSS class names used for styling and DOM selection:

- `DROPZONE`: 'allonsh-dropzone' — Dropzone area.
- `HIGHLIGHT`: 'allonsh-highlight' — Highlighted element.
- `DRAGGABLE`: 'allonsh-draggable' — Draggable element.
- `RESTRICTED`: 'restricted' — Restricted area or element.

## CSS_POSITIONS

CSS position values:

- `RELATIVE`: 'relative'
- `ABSOLUTE`: 'absolute'

## CSS_CURSORS

Cursor styles for drag-and-drop interactions:

- `GRAB`: 'grab'
- `GRABBING`: 'grabbing'

## OPACITY

Opacity values for UI elements:

- `GHOST`: '0.3' — Semi-transparent ghost element.
- `FULL`: '1' — Fully opaque element.

## EVENTS

Custom DOM event names for drag-and-drop lifecycle:

- `DRAG_START`: 'allonsh-dragstart'
- `DROP`: 'allonsh-drop'
- `DRAG_ENTER`: 'allonsh-dragenter'
- `DRAG_LEAVE`: 'allonsh-dragleave'

## FLEX_DIRECTIONS

Flexbox direction values:

- `ROW`: 'row'
- `COLUMN`: 'column'

## FLEX_WRAP

Flexbox wrap mode:

- `'wrap'`

## DISPLAY_MODES

Display property values:

- `FLEX`: 'flex'
- `NONE`: 'none'

## POINTER_EVENTS

Pointer event values:

- `NONE`: 'none' — Disables pointer events.
- `AUTO`: 'auto' — Enables pointer events.

## Usage

Below are examples of how constants from `src/constants.js` are used throughout the Allonsh.js project:

### Importing Constants

In the main source file (`src/allonsh.js`):

```js
import {
  Z_INDEX,
  DEFAULTS,
  CSS_CLASSES,
  CSS_POSITIONS,
  CSS_CURSORS,
  OPACITY,
  EVENTS,
  FLEX_DIRECTIONS,
  FLEX_WRAP,
  DISPLAY_MODES,
  POINTER_EVENTS,
} from './constants.js';
```

### Using Constants in the Library

- **Default values:**
  ```js
  stackDirection = DEFAULTS.STACK_DIRECTION;
  stackSpacing = DEFAULTS.STACK_SPACING;
  ```
- **Styling elements:**
  ```js
  element.style.cursor = CSS_CURSORS.GRAB;
  element.style.position = CSS_POSITIONS.RELATIVE;
  element.style.zIndex = Z_INDEX.DRAGGING;
  element.style.opacity = OPACITY.GHOST;
  dropzone.classList.add(CSS_CLASSES.DROPZONE);
  dropzone.classList.remove(CSS_CLASSES.HIGHLIGHT);
  ```
- **Flexbox and display:**
  ```js
  dropzone.style.display = DISPLAY_MODES.FLEX;
  dropzone.style.flexDirection = FLEX_DIRECTIONS.ROW;
  dropzone.style.flexWrap = FLEX_WRAP;
  ```
- **Pointer events:**
  ```js
  element.style.pointerEvents = POINTER_EVENTS.NONE;
  ```
- **Custom events:**
  ```js
  element.dispatchEvent(new CustomEvent(EVENTS.DRAG_START, { detail: { ... } }));
  dropzone.dispatchEvent(new CustomEvent(EVENTS.DROP, { detail: { ... } }));
  ```

### Usage in Tests

In `test/allonsh.test.js`:

```js
import { EVENTS } from '../src/constants.js';

// Example: Listening for custom drop event
const dropHandler = vi.fn();
dropzone.addEventListener(EVENTS.DROP, dropHandler);
```
