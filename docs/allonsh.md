# Allonsh Docs

Create dynamic drag-and-drop interfaces with customizable behaviors like restricted dropzones, element stacking, and ghost visuals for seamless user interaction.

---

## Constructor

`new Allonsh(options)`

Creates a new Allonsh instance.

### Parameters

- `options` (Object) — Configuration options:
  - `draggableSelector` (string, **required**) — CSS class name for draggable elements.
  - `dropzoneSelector` (string, optional) — CSS class name for dropzone elements.
  - `playAreaSelector` (string, optional) — CSS class name for the play area container. Defaults to `document.body`.
  - `restrictToDropzones` (boolean, optional) — If `true`, dragging outside dropzones will return element to origin. Default: `false`.
  - `enableStacking` (boolean, optional) — Enables stacking layout in dropzones. Default: `false`.
  - `stackDirection` (string, optional) — `'horizontal'` or `'vertical'` stacking direction. Default: `'horizontal'`.
  - `stackSpacing` (number, optional) — Space in pixels between stacked elements. Default: `5`.
  - `useGhostEffect` (boolean, optional) — Uses a semi-transparent clone as a "ghost" while dragging. Default: `false`.

---

## Methods

### `update(newOptions)`

Updates the Allonsh instance with new configuration options. Accepts the same options as the constructor (all optional).

### `resetAll()`

Resets all draggable elements back to their original positions inside the play area.

### `addDraggable(element)`

Adds a new element as draggable. The element will be styled and event listeners attached.

- `element` (HTMLElement) — The DOM element to add as draggable.

### `removeDraggable(element)`

Removes a draggable element and detaches related event listeners.

- `element` (HTMLElement) — The DOM element to remove from draggable functionality.

### `setDropzones(selector)`

Sets or updates the dropzone elements.

- `selector` (string) — CSS class name for dropzone elements.

---

## Events

Allonsh dispatches the following custom events on relevant elements:

- `allonsh-dragstart` — Fired on the element when dragging starts.
- `allonsh-drop` — Fired on a dropzone when an element is dropped into it.
- `allonsh-dragenter` — Fired on a dropzone when a draggable enters it.
- `allonsh-dragleave` — Fired on a dropzone when a draggable leaves it.

---

## Behavior

- Draggable elements are moved within the bounds of the play area.
- When `restrictToDropzones` is enabled, dragged elements will snap back if dropped outside any dropzone.
- When `enableStacking` is enabled, dropzones layout their children in a stack with specified direction and spacing.
- The ghost effect shows a semi-transparent clone of the element while dragging for better visual feedback.
- The library automatically manages event listeners for mouse and touch events.

---

## Usage Example

```js
import Allonsh from 'allonsh';

const dragDrop = new Allonsh({
  draggableSelector: 'draggable',
  dropzoneSelector: 'dropzone',
  playAreaSelector: 'play-area',
  restrictToDropzones: true,
  enableStacking: true,
  stackDirection: 'vertical',
  stackSpacing: 10,
  useGhostEffect: true,
});
```
