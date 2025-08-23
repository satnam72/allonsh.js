# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-08-23

### Stable Release

This is the first stable release of Allonsh.js, promoted from `0.1.0-rc` without further changes.

## [0.1.0-rc] - 2025-08-22

### Added

- Added documentation file `docs/allonsh.md`.
- Minor updates to the demo page for improved clarity and usability.
- Added initial test coverage for core draggable functionality.

## [0.1.0-beta.2] - 2025-08-20

### Added

- Improved stacking logic for dropzones when `enableStacking` is enabled. The dropzone now correctly applies `flex` styles to align dragged items either horizontally or vertically with adjustable spacing (`stackSpacing`).
- The ghost element is now cloned more efficiently when dragging outside the play area, and it's removed correctly when the drag ends.
- Additional public API methods:
  - `update(newOptions)`: Allows updating the options of the instance after initialization (e.g., change selectors, enable/disable stacking).
  - `resetAll()`: Resets the position of all draggable elements back to their original placement in the play area.
- Added a demo page that showcases the current version's features, including stacking, drag restrictions, and event handling.

### Changed

- Added a default `relative` position to the play area and improved flexibility for handling drag operations, including when the dragged element is outside the play area.
- Optimized event handler binding for both mouse and touch devices, ensuring smoother drag interactions.
- When dropping, the element is now only appended to the dropzone if valid, otherwise returned to its original position (respecting `restrictToDropzones`).
- Reset styles after dragging, ensuring that the dragged element's position is correctly returned to `relative` on drop or cancel.

### Fixed

- Fixed the issue where touch dragging might cause unexpected scrolling or behavior inconsistencies.
- Corrected the dragging boundaries when the element is moved near the edge of the play area, preventing overflow.
- Ensured proper cleanup of ghost elements and event listeners to prevent memory leaks.

**Full Changelog**: https://github.com/satnam72/allonsh.js/compare/v0.1.0-beta.1...v0.1.0-beta.2

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

## [0.0.1] - 2024-12-01

### Added

- Basic drag-and-drop support for mouse input.
- Initial implementation of draggable elements.
- Dropzone highlighting.
- Basic event dispatching on drag start and drop.
