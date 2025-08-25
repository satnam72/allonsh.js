# Allonsh Constants Refactor Summary

## Overview

This document summarizes the refactoring work done to replace hardcoded values with meaningful constants throughout the Allonsh library.

## Files Created/Modified

### 1. New Constants File: `src/constants.js`

- **Z_INDEX**: Centralized z-index values (GHOST: 999, DRAGGING: 1000, DROPPED: 9999, etc.)
- **DEFAULTS**: Default configuration values (stack spacing, direction)
- **CSS_CLASSES**: Consistent CSS class names
- **CSS_POSITIONS**: Position values (relative, absolute)
- **CSS_CURSORS**: Cursor values (grab, grabbing)
- **OPACITY**: Opacity values (ghost: 0.3, full: 1)
- **EVENTS**: Custom event names
- **FLEX_DIRECTIONS**: Flexbox direction values
- **DISPLAY_MODES**: Display property values
- **POINTER_EVENTS**: Pointer-events values

### 2. Main Library: `src/allonsh.js`

**Replaced hardcoded values with constants:**

#### Z-Index Values:

- `999` → `Z_INDEX.GHOST`
- `1000` → `Z_INDEX.DRAGGING`
- `9999` → `Z_INDEX.DROPPED`

#### Default Values:

- `'horizontal'` → `DEFAULTS.STACK_DIRECTION`
- `5` → `DEFAULTS.STACK_SPACING`

#### CSS Class Names:

- `'allonsh-dropzone'` → `CSS_CLASSES.DROPZONE`
- `'allonsh-highlight'` → `CSS_CLASSES.HIGHLIGHT`
- `'allonsh-draggable'` → `CSS_CLASSES.DRAGGABLE`
- `'restricted'` → `CSS_CLASSES.RESTRICTED`

#### CSS Properties:

- `'relative'` → `CSS_POSITIONS.RELATIVE`
- `'absolute'` → `CSS_POSITIONS.ABSOLUTE`
- `'grab'` → `CSS_CURSORS.GRAB`
- `'grabbing'` → `CSS_CURSORS.GRABBING`
- `'flex'` → `DISPLAY_MODES.FLEX`
- `'row'` → `FLEX_DIRECTIONS.ROW`
- `'column'` → `FLEX_DIRECTIONS.COLUMN`
- `'wrap'` → `FLEX_WRAP`

#### Opacity Values:

- `'0.3'` → `OPACITY.GHOST`
- `'1'` → `OPACITY.FULL`

#### Pointer Events:

- `'none'` → `POINTER_EVENTS.NONE`
- `'auto'` → `POINTER_EVENTS.AUTO`

#### Event Names:

- `'allonsh-dragstart'` → `EVENTS.DRAG_START`
- `'allonsh-drop'` → `EVENTS.DROP`
- `'allonsh-dragenter'` → `EVENTS.DRAG_ENTER`
- `'allonsh-dragleave'` → `EVENTS.DRAG_LEAVE`

### 3. Demo Script: `demo/js/script.js`

- Imported constants for default values
- Replaced hardcoded `10` with `DEFAULTS.STACK_SPACING_DEMO`

### 4. Test File: `test/allonsh.test.js`

- Imported constants for event names
- Replaced hardcoded event name with `EVENTS.DROP`

### 5. CSS File: `demo/css/styles.css`

- Added comments indicating z-index values could be updated to use CSS custom properties
- Values remain hardcoded for now but are documented for future refactoring

## Benefits Achieved

1. **Maintainability**: All hardcoded values are now centralized in one location
2. **Consistency**: Values are guaranteed to be consistent across the codebase
3. **Self-documenting**: Constants have meaningful names that explain their purpose
4. **Easy Updates**: Changing a value requires updating only the constants file
5. **Type Safety**: Better IDE support and error detection
6. **Code Clarity**: Intent is clearer with named constants instead of magic numbers

## Future Improvements

1. **CSS Custom Properties**: Z-index values in CSS could be moved to CSS custom properties
2. **Theme System**: Constants could be extended to support theme-based values
3. **Configuration**: Constants could be made configurable at runtime
4. **Validation**: Add validation to ensure constant values are within expected ranges

## Impact

- **High Priority**: This was a quick win with massive maintainability improvement
- **Low Risk**: Changes are purely internal refactoring with no API changes
- **High Value**: Makes the codebase significantly easier to maintain and extend
