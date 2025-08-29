import {
  CSS_CLASSES,
  CSS_POSITIONS,
  CSS_CURSORS,
  OPACITY,
  Z_INDEX,
  FLEX_DIRECTIONS,
  FLEX_WRAP,
  DISPLAY_MODES,
  POINTER_EVENTS,
  STACK_DIRECTION,
} from './constants.js';

export class StyleManager {
  applyDraggableStyles(element) {
    element.style.cursor = CSS_CURSORS.GRAB;
    element.classList.add(CSS_CLASSES.DRAGGABLE);
  }

  applyDraggingStyles(element) {
    element.style.cursor = CSS_CURSORS.GRABBING;
    element.style.zIndex = Z_INDEX.DRAGGING;
  }

  applyGhostStyles(element) {
    element.style.pointerEvents = POINTER_EVENTS.NONE;
    element.style.position = CSS_POSITIONS.ABSOLUTE;
    element.style.zIndex = Z_INDEX.GHOST;
    element.style.opacity = OPACITY.FULL;
  }

  applyAbsolutePositioning(element) {
    element.style.position = CSS_POSITIONS.ABSOLUTE;
  }

  applyStackingStyles(dropzone, { stackDirection, stackSpacing }) {
    dropzone.style.display = DISPLAY_MODES.FLEX;
    dropzone.style.flexDirection =
      stackDirection === STACK_DIRECTION.VERTICAL
        ? FLEX_DIRECTIONS.COLUMN
        : FLEX_DIRECTIONS.ROW;
    dropzone.style.gap = `${stackSpacing}px`;
    dropzone.style.flexWrap = FLEX_WRAP;
  }

  removeStackingStyles(dropzone) {
    dropzone.style.display = '';
    dropzone.style.flexDirection = '';
    dropzone.style.gap = '';
    dropzone.style.flexWrap = '';
  }

  resetPosition(element) {
    element.style.left = '';
    element.style.top = '';
    element.style.position = CSS_POSITIONS.RELATIVE;
  }

  resetDraggableStyles(element) {
    element.style.cursor = CSS_CURSORS.GRAB;
    element.style.zIndex = '';
    element.style.opacity = OPACITY.FULL;
  }

  applyPlayAreaStyles(playAreaElement) {
    playAreaElement.style.position = CSS_POSITIONS.RELATIVE;
  }
}
