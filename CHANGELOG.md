# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-beta.1] - 2025-08-16

### Added
- Support for stacking draggable elements inside dropzones (`enableStacking`, `stackDirection`, `stackSpacing` options).
- Restrict dragging to dropzones only (`restrictToDropzones` option).
- Ghost element cloning for dragging elements originally outside the play area.
- Public API methods: `addDraggable(element)`, `removeDraggable(element)`, `setDropzones(selector)`.
- New custom events: `allonsh-dragstart`, `allonsh-drop`, `allonsh-dragenter`, `allonsh-dragleave`.
- Dropzones highlight during dragging using `allonsh-highlight` CSS class.

### Changed
- Set play area position to `relative` by default for proper containment.
- Improved event binding and handling for mouse and touch interactions.
- Dragging constrained within play area boundaries.
- Enhanced error handling and warnings throughout the code.
- Proper resetting of dragged element styles and position on drop or cancel.

### Fixed
- Prevent default scrolling on touch devices during dragging.
- Dragged elements outside play area handled correctly via ghost element.
- Removed ghost element cleanup to avoid orphaned nodes.

---

# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.5.0] - 2025-08-16 

### Added
- Initial release of the `Allonsh` JavaScript drag-and-drop utility with mouse and touch support.
- Configurable options for:
  - `draggableSelector`
  - `dropzoneSelector`
  - `playAreaSelector`
  - `restrictToDropzones`
  - `enableStacking`
  - `stackDirection` and `stackSpacing`
- Dropzone support with optional stacking (horizontal or vertical layout).
- Custom event dispatching:
  - `allonsh-dragstart`
  - `allonsh-drop`
  - `allonsh-dragenter`
  - `allonsh-dragleave`
- Utility methods:
  - `addDraggable(element)`
  - `removeDraggable(element)`
  - `resetAll()`
  - `setDropzones(selector)`

### Changed
- Internal event handling rewritten to support both mouse and touch devices with consistent behavior.
- Stacking implemented using Flexbox (`flexDirection`, `gap`, `flexWrap`).
- Refactored DOM traversal to use `Set` for performance in dropzone detection.
- Improved error logging with detailed try-catch blocks throughout.

### Fixed
- Ghost element cleanup to avoid DOM leaks.
- Position clamping to keep dragged elements within play area bounds.
- Accurate relative positioning for dropzones and drag targets.
- Cursor state handling during drag operations.

---

## [0.0.1] - 2024-12-01

### Added
- Basic drag-and-drop support for mouse input.
- Initial implementation of draggable elements.
- Dropzone highlighting.
- Basic event dispatching on drag start and drop.

---

