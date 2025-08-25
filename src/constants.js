/**
 * Allonsh Constants
 * Centralized configuration for all hardcoded values used throughout the library
 */

export const Z_INDEX = {
  GHOST: 999,
  DRAGGING: 1000,
  DROPPED: 9999,
  HEADER: 10,
  THEME_TOGGLE: 9,
  CONTROL_PANEL: 5,
  FREEMODE_TITLE: 5,
};

export const DEFAULTS = {
  STACK_SPACING: 5,
  STACK_SPACING_DEMO: 10,
  STACK_DIRECTION: 'horizontal',
  STACK_DIRECTION_VERTICAL: 'vertical',
  STACK_DIRECTION_HORIZONTAL: 'horizontal',
};

export const CSS_CLASSES = {
  DROPZONE: 'allonsh-dropzone',
  HIGHLIGHT: 'allonsh-highlight',
  DRAGGABLE: 'allonsh-draggable',
  RESTRICTED: 'restricted',
};

export const CSS_POSITIONS = {
  RELATIVE: 'relative',
  ABSOLUTE: 'absolute',
};

export const CSS_CURSORS = {
  GRAB: 'grab',
  GRABBING: 'grabbing',
};

export const OPACITY = {
  GHOST: '0.3',
  FULL: '1',
};

export const EVENTS = {
  DRAG_START: 'allonsh-dragstart',
  DROP: 'allonsh-drop',
  DRAG_ENTER: 'allonsh-dragenter',
  DRAG_LEAVE: 'allonsh-dragleave',
};

export const FLEX_DIRECTIONS = {
  ROW: 'row',
  COLUMN: 'column',
};

export const FLEX_WRAP = 'wrap';

export const DISPLAY_MODES = {
  FLEX: 'flex',
  NONE: 'none',
};

export const POINTER_EVENTS = {
  NONE: 'none',
  AUTO: 'auto',
};
