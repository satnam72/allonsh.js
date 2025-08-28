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
  STACK_DIRECTION,
} from './constants.js';

class Allonsh {
  constructor(options = {}) {
    const {
      draggableSelector,
      dropzoneSelector = null,
      playAreaSelector = null,
      restrictToDropzones = false,
      enableStacking = false,
      stackDirection = DEFAULTS.STACK_DIRECTION,
      stackSpacing = DEFAULTS.STACK_SPACING,
      useGhostEffect = false,
    } = options;

    if (!draggableSelector) {
      throw new Error(
        "Allonsh Error: 'draggableSelector' is required in options."
      );
    }

    this.restrictToDropzones = restrictToDropzones;
    this.enableStacking = enableStacking;
    this.stackDirection = stackDirection;
    this.stackSpacing = stackSpacing;
    this.useGhostEffect = useGhostEffect;

    if (playAreaSelector) {
      this.playAreaElement = document.querySelector(`.${playAreaSelector}`);
      if (!this.playAreaElement) {
        throw new Error(
          `Allonsh Error: Play area element with class '${playAreaSelector}' not found.`
        );
      }
    } else {
      this.playAreaElement = document.body;
    }

    this.draggableElements = this.playAreaElement.querySelectorAll(
      `.${draggableSelector}`
    );
    if (this.draggableElements.length === 0) {
      console.warn(
        `Allonsh Warning: No draggable elements found with selector '.${draggableSelector}'.`
      );
    } else {
      this.draggableElements.forEach((element) => {
        if (!element.classList.contains(CSS_CLASSES.DRAGGABLE)) {
          element.classList.add(CSS_CLASSES.DRAGGABLE);
        }
      });
    }

    if (dropzoneSelector) {
      this.dropzoneElements = this.playAreaElement.querySelectorAll(
        `.${dropzoneSelector}`
      );
      if (this.dropzoneElements.length === 0) {
        console.warn(
          `Allonsh Warning: No dropzone elements found with selector '.${dropzoneSelector}'.`
        );
      }
    } else {
      this.dropzoneElements = [];
    }

    this._dropzoneSet = new Set(this.dropzoneElements);

    this.currentDraggedElement = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.ghostElement = null;
    this.originalParent = null;
    this.originalDropzone = null;

    this._boundMouseMoveHandler = this._onMouseMove.bind(this);
    this._boundMouseUpHandler = this._onMouseUp.bind(this);
    this._boundTouchMoveHandler = this._onTouchMove.bind(this);
    this._boundTouchEndHandler = this._onTouchEnd.bind(this);
    this._boundMouseDown = this._onMouseDown.bind(this);
    this._boundTouchStart = this._onTouchStart.bind(this);

    try {
      this._initialize();
    } catch (error) {
      console.error('Allonsh Initialization Error:', error);
    }
  }

  update(newOptions = {}) {
    const {
      draggableSelector,
      dropzoneSelector,
      playAreaSelector,
      restrictToDropzones,
      enableStacking,
      stackDirection,
      stackSpacing,
      useGhostEffect,
    } = newOptions;

    if (restrictToDropzones !== undefined)
      this.restrictToDropzones = restrictToDropzones;
    if (enableStacking !== undefined) this.enableStacking = enableStacking;
    if (stackDirection !== undefined) this.stackDirection = stackDirection;
    if (stackSpacing !== undefined) this.stackSpacing = stackSpacing;
    if (useGhostEffect !== undefined) this.useGhostEffect = useGhostEffect;

    if (playAreaSelector) {
      const newPlayArea = document.querySelector(`.${playAreaSelector}`);
      if (newPlayArea) {
        this.playAreaElement = newPlayArea;
        this.playAreaElement.style.position = CSS_POSITIONS.RELATIVE;
      } else {
        console.warn(
          `Allonsh Warning: Play area element with class '${playAreaSelector}' not found.`
        );
      }
    }

    this.draggableElements = this.playAreaElement.querySelectorAll(
      `.${draggableSelector}`
    );

    this.draggableElements.forEach((element) => {
      this._unbindEventListeners();
      element.style.cursor = CSS_CURSORS.GRAB;
      element.addEventListener('mousedown', this._boundMouseDown);
      element.addEventListener('touchstart', this._boundTouchStart, {
        passive: false,
      });
    });

    if (dropzoneSelector) {
      this.dropzoneElements = this.playAreaElement.querySelectorAll(
        `.${dropzoneSelector}`
      );
      this._dropzoneSet = new Set(this.dropzoneElements);
    }

    if (this.enableStacking) {
      if (this.dropzoneElements) {
        this.dropzoneElements.forEach((dropzone) => {
          this._applyStackingStyles(dropzone);
        });
      }
    } else {
      if (this.dropzoneElements) {
        this.dropzoneElements.forEach((dropzone) => {
          this._removeStackingStyles(dropzone);
        });
      }
    }
  }

  _initialize() {
    if (!this.playAreaElement) {
      throw new Error(
        'Allonsh Initialization Error: Play area element is not defined.'
      );
    }
    this.playAreaElement.style.position = CSS_POSITIONS.RELATIVE;

    if (!this.draggableElements || this.draggableElements.length === 0) {
      console.warn('Allonsh Warning: No draggable elements to initialize.');
      return;
    }

    this.draggableElements.forEach((element) => {
      try {
        element.style.cursor = CSS_CURSORS.GRAB;
        element.addEventListener('mousedown', this._onMouseDown.bind(this));
        element.addEventListener('touchstart', this._onTouchStart.bind(this), {
          passive: false,
        });
      } catch (err) {
        console.error(
          'Allonsh Error attaching event listeners to draggable element:',
          err
        );
      }
    });

    if (this.dropzoneElements) {
      this.dropzoneElements.forEach((dropzone) => {
        try {
          dropzone.classList.add(CSS_CLASSES.DROPZONE);
          if (this.enableStacking) {
            this._applyStackingStyles(dropzone);
          }
        } catch (err) {
          console.error('Allonsh Error initializing dropzone element:', err);
        }
      });
    }
  }

  _unbindEventListeners() {
    if (!this.draggableElements) return;

    this.draggableElements.forEach((element) => {
      element.removeEventListener('mousedown', this._boundMouseDown);
      element.removeEventListener('touchstart', this._boundTouchStart);
    });
  }

  _applyStackingStyles(dropzone) {
    try {
      dropzone.style.display = DISPLAY_MODES.FLEX;
      dropzone.style.flexDirection =
        this.stackDirection === STACK_DIRECTION.VERTICAL
          ? FLEX_DIRECTIONS.COLUMN
          : FLEX_DIRECTIONS.ROW;
      dropzone.style.gap = `${this.stackSpacing}px`;
      dropzone.style.flexWrap = FLEX_WRAP;
    } catch (err) {
      console.error('Allonsh Error applying stacking styles:', err);
    }
  }

  _removeStackingStyles(dropzone) {
    try {
      dropzone.style.display = '';
      dropzone.style.flexDirection = '';
      dropzone.style.gap = '';
      dropzone.style.flexWrap = '';
    } catch (err) {
      console.error('Allonsh Error removing stacking styles:', err);
    }
  }

  _onMouseDown(event) {
    try {
      this._onPointerDown(event.clientX, event.clientY, event);
      document.addEventListener('mousemove', this._boundMouseMoveHandler);
      document.addEventListener('mouseup', this._boundMouseUpHandler);
    } catch (err) {
      console.error('Allonsh Error during mousedown event:', err);
    }
  }

  _onTouchStart(event) {
    try {
      event.preventDefault();
      const touchPoint = event.touches[0];
      this._onPointerDown(touchPoint.clientX, touchPoint.clientY, event);
      document.addEventListener('touchmove', this._boundTouchMoveHandler, {
        passive: false,
      });
      document.addEventListener('touchend', this._boundTouchEndHandler);
    } catch (err) {
      console.error('Allonsh Error during touchstart event:', err);
    }
  }

  _onPointerDown(clientX, clientY, event) {
    this._startDrag(event, clientX, clientY);
  }

  _onMouseMove(event) {
    try {
      this._updateDragPosition(event.clientX, event.clientY);
    } catch (err) {
      console.error('Allonsh Error during mousemove event:', err);
    }
  }

  _onTouchMove(event) {
    try {
      event.preventDefault();
      const touchPoint = event.touches[0];
      this._updateDragPosition(touchPoint.clientX, touchPoint.clientY);
    } catch (err) {
      console.error('Allonsh Error during touchmove event:', err);
    }
  }

  _onMouseUp(event) {
    try {
      this._onPointerUp(event.clientX, event.clientY, event);
      document.removeEventListener('mousemove', this._boundMouseMoveHandler);
      document.removeEventListener('mouseup', this._boundMouseUpHandler);
    } catch (err) {
      console.error('Allonsh Error during mouseup event:', err);
    }
  }

  _onTouchEnd(event) {
    try {
      const touchPoint = event.changedTouches[0];
      this._onPointerUp(touchPoint.clientX, touchPoint.clientY, event);
      document.removeEventListener('touchmove', this._boundTouchMoveHandler);
      document.removeEventListener('touchend', this._boundTouchEndHandler);
    } catch (err) {
      console.error('Allonsh Error during touchend event:', err);
    }
  }

  _onPointerUp(clientX, clientY, event) {
    this.currentDraggedElement.style.opacity = OPACITY.FULL;
    this._handleDrop(clientX, clientY, event);
  }

  _startDrag(event, clientX, clientY) {
    try {
      this.currentDraggedElement = event.currentTarget;
      this.currentDraggedElement.style.cursor = CSS_CURSORS.GRABBING;

      this.originalParent = this.currentDraggedElement.parentElement;
      this.originalDropzone = this._findClosestDropzone(
        this.currentDraggedElement
      );

      if (!this.currentDraggedElement) {
        throw new Error('Dragged element is null or undefined.');
      }

      const playAreaRect = this.playAreaElement.getBoundingClientRect();
      const rect = this.currentDraggedElement.getBoundingClientRect();

      if (this.originalParent !== this.playAreaElement && this.useGhostEffect) {
        if (this.ghostElement && this.ghostElement.parentElement) {
          this.ghostElement.parentElement.removeChild(this.ghostElement);
          this.ghostElement = null;
        }

        this.ghostElement = this.currentDraggedElement.cloneNode(true);
        this.ghostElement.style.pointerEvents = POINTER_EVENTS.NONE;
        this.ghostElement.style.position = CSS_POSITIONS.ABSOLUTE;

        this.ghostElement.style.zIndex = Z_INDEX.GHOST;

        this.currentDraggedElement.style.opacity = OPACITY.GHOST;
        this.playAreaElement.appendChild(this.ghostElement);

        this.ghostElement.style.left = `${rect.left - playAreaRect.left}px`;
        this.ghostElement.style.top = `${rect.top - playAreaRect.top}px`;
      } else {
        this.ghostElement = null;
      }

      this.dragOffsetX = clientX - rect.left;
      this.dragOffsetY = clientY - rect.top;

      this.currentDraggedElement.style.cursor = CSS_CURSORS.GRABBING;
      this.currentDraggedElement.style.zIndex = Z_INDEX.DRAGGING;

      this.currentDraggedElement.dispatchEvent(
        new CustomEvent(EVENTS.DRAG_START, {
          detail: { originalEvent: event },
        })
      );

      this._toggleDropzoneHighlight(true);
    } catch (err) {
      console.error('Allonsh Error in _startDrag:', err);
    }
  }

  _handleElementDrag(element, isGhost = false) {
    try {
      if (!element) {
        throw new Error('Element is null or undefined.');
      }

      const style = element.style;

      if (isGhost) {
        style.pointerEvents = POINTER_EVENTS.NONE;
        style.position = CSS_POSITIONS.ABSOLUTE;
        style.zIndex = Z_INDEX.GHOST;
        style.opacity = OPACITY.GHOST;
      } else {
        style.cursor = CSS_CURSORS.GRABBING;
        style.zIndex = Z_INDEX.DRAGGING;
      }

      if (isGhost && element !== this.ghostElement) {
        this.ghostElement = element;
        this.playAreaElement.appendChild(this.ghostElement);
      }
    } catch (err) {
      console.error(
        `Allonsh Error handling ${isGhost ? 'ghost' : 'dragged'} element:`,
        err
      );
    }
  }

  _updateDragPosition(clientX, clientY) {
    if (!this.currentDraggedElement) {
      console.warn('Allonsh Warning: No element is currently being dragged.');
      return;
    }

    try {
      if (this.ghostElement) {
        const playAreaRect = this.playAreaElement.getBoundingClientRect();

        let newLeft = clientX - playAreaRect.left - this.dragOffsetX;
        let newTop = clientY - playAreaRect.top - this.dragOffsetY;

        const ghostRect = this.ghostElement.getBoundingClientRect();

        const maxLeft = playAreaRect.width - ghostRect.width;
        const maxTop = playAreaRect.height - ghostRect.height;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        this.ghostElement.style.left = `${newLeft}px`;
        this.ghostElement.style.top = `${newTop}px`;
      } else {
        this.currentDraggedElement.style.position = CSS_POSITIONS.ABSOLUTE;

        const playAreaRect = this.playAreaElement.getBoundingClientRect();
        const draggedRect = this.currentDraggedElement.getBoundingClientRect();

        let newLeft = clientX - playAreaRect.left - this.dragOffsetX;
        let newTop = clientY - playAreaRect.top - this.dragOffsetY;

        const maxLeft = this.playAreaElement.clientWidth - draggedRect.width;
        const maxTop = this.playAreaElement.clientHeight - draggedRect.height;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        this.currentDraggedElement.style.left = `${newLeft}px`;
        this.currentDraggedElement.style.top = `${newTop}px`;
      }
    } catch (err) {
      console.error('Allonsh Error updating drag position:', err);
    }
  }

  _handleDrop(clientX, clientY, event) {
    if (!this.currentDraggedElement) {
      console.warn(
        'Allonsh Warning: Drop attempted without a dragged element.'
      );
      return;
    }

    try {
      const playAreaRect = this.playAreaElement.getBoundingClientRect();

      const clampedX = Math.min(
        Math.max(clientX, playAreaRect.left + 1),
        playAreaRect.right - 1
      );
      const clampedY = Math.min(
        Math.max(clientY, playAreaRect.top + 1),
        playAreaRect.bottom - 1
      );

      this.currentDraggedElement.style.pointerEvents = POINTER_EVENTS.NONE;
      let elementBelow = document.elementFromPoint(clampedX, clampedY);
      this.currentDraggedElement.style.pointerEvents = POINTER_EVENTS.AUTO;

      if (!elementBelow) {
        if (this.restrictToDropzones) {
          this._returnToOrigin();
        }
        this._resetDraggedElementState();
        return;
      }

      let dropzoneFound = null;
      let el = elementBelow;

      while (el && el !== this.playAreaElement) {
        if (this._dropzoneSet.has(el)) {
          dropzoneFound = el;
          break;
        }
        el = el.parentElement;
      }

      if (dropzoneFound) {
        this.currentDropzone = dropzoneFound;

        if (this.enableStacking) {
          this._applyStackingStyles(this.currentDropzone);
        }

        this._resetPositionToRelative(this.currentDraggedElement);

        if (this.ghostElement && this.ghostElement.parentElement) {
          this.ghostElement.parentElement.removeChild(this.ghostElement);
          this.ghostElement = null;
        }

        try {
          this.currentDropzone.appendChild(this.currentDraggedElement);
        } catch (e) {
          console.warn(
            'Allonsh Warning: Could not append dragged element to dropzone.',
            e
          );
        }

        this.currentDropzone.dispatchEvent(
          new CustomEvent(EVENTS.DROP, {
            detail: {
              draggedElement: this.currentDraggedElement,
              originalEvent: event,
            },
          })
        );

        this.currentDropzone.dispatchEvent(
          new CustomEvent(EVENTS.DRAG_ENTER, {
            detail: { draggedElement: this.currentDraggedElement },
          })
        );
        this.currentDropzone.dispatchEvent(
          new CustomEvent(EVENTS.DRAG_LEAVE, {
            detail: { draggedElement: this.currentDraggedElement },
          })
        );

        this.currentDropzone.classList.remove(CSS_CLASSES.HIGHLIGHT);
        this.currentDropzone = null;
      } else {
        if (this.ghostElement && this.ghostElement.parentElement) {
          try {
            this.ghostElement.parentElement.removeChild(this.ghostElement);
            this.ghostElement = null;
          } catch (e) {
            console.warn('Allonsh Warning: Failed to remove ghost element.', e);
          }
        }

        if (this.restrictToDropzones) {
          this._returnToOrigin();
        } else {
          if (
            this.currentDraggedElement.parentElement !== this.playAreaElement
          ) {
            try {
              this.playAreaElement.appendChild(this.currentDraggedElement);

              const offsetX = clampedX - playAreaRect.left - this.dragOffsetX;
              const offsetY = clampedY - playAreaRect.top - this.dragOffsetY;

              this.currentDraggedElement.style.position =
                CSS_POSITIONS.ABSOLUTE;
              this.currentDraggedElement.style.left = `${offsetX}px`;
              this.currentDraggedElement.style.top = `${offsetY}px`;
              this.currentDraggedElement.style.zIndex = Z_INDEX.DRAGGING;
            } catch (e) {
              console.warn(
                'Allonsh Warning: Could not append dragged element back to play area.',
                e
              );
            }
          }
        }
      }

      this._resetDraggedElementState();
    } catch (err) {
      console.error('Allonsh Error handling drop:', err);
      if (this.restrictToDropzones) {
        this._returnToOrigin();
      }
      this._resetDraggedElementState();
    }
  }

  _returnToOrigin() {
    try {
      if (
        this.originalDropzone &&
        !this._isDropzoneRestricted(this.originalDropzone)
      ) {
        if (this.enableStacking) {
          this._applyStackingStyles(this.originalDropzone);
        }
        this._resetPositionToRelative(this.currentDraggedElement);
        this.originalDropzone.appendChild(this.currentDraggedElement);
      } else {
        this._resetPositionToRelative(this.currentDraggedElement);
        this.playAreaElement.appendChild(this.currentDraggedElement);
      }
    } catch (err) {
      console.error('Allonsh Error returning element to origin:', err);
    }
  }

  _isDropzoneRestricted(dropzone) {
    return dropzone && dropzone.classList.contains(CSS_CLASSES.RESTRICTED);
  }

  _resetDraggedElementState() {
    if (!this.currentDraggedElement) return;

    try {
      this.currentDraggedElement.style.cursor = CSS_CURSORS.GRAB;
      this.currentDraggedElement.style.zIndex = '';
      this._toggleDropzoneHighlight(false);

      if (
        this.useGhostEffect &&
        this.ghostElement &&
        this.ghostElement.parentElement
      ) {
        this.ghostElement.parentElement.removeChild(this.ghostElement);
        this.ghostElement = null;
      }
    } catch (err) {
      console.error('Allonsh Error resetting dragged element state:', err);
    } finally {
      this.currentDraggedElement = null;
      this.originalParent = null;
      this.originalDropzone = null;
    }
  }

  _findClosestDropzone(element) {
    let el = element;
    while (el && el !== this.playAreaElement) {
      if (this._dropzoneSet.has(el)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  _resetPositionToRelative(element) {
    try {
      element.style.left = '';
      element.style.top = '';
      element.style.position = CSS_POSITIONS.RELATIVE;
    } catch (err) {
      console.error('Allonsh Error resetting element position:', err);
    }
  }

  _toggleDropzoneHighlight(enable) {
    try {
      this.dropzoneElements.forEach((dropzone) => {
        dropzone.classList.toggle(CSS_CLASSES.HIGHLIGHT, enable);
      });
    } catch (err) {
      console.error('Allonsh Error toggling dropzone highlight:', err);
    }
  }

  resetAll() {
    try {
      this.draggableElements.forEach((el) => {
        if (this.playAreaElement.contains(el)) {
          this.playAreaElement.appendChild(el);
          this._resetPositionToRelative(el);
        }
      });
    } catch (err) {
      console.error('Allonsh Error resetting all draggables:', err);
    }
  }

  addDraggable(element) {
    try {
      if (!element.classList.contains(CSS_CLASSES.DRAGGABLE)) {
        element.classList.add(CSS_CLASSES.DRAGGABLE);
      }
      element.style.cursor = CSS_CURSORS.GRAB;
      element.addEventListener('mousedown', this._boundMouseDown);
      element.addEventListener('touchstart', this._boundTouchStart, {
        passive: false,
      });

      this.draggableElements = this.playAreaElement.querySelectorAll(
        `.${CSS_CLASSES.DRAGGABLE}`
      );
    } catch (err) {
      console.error('Allonsh Error adding draggable element:', err);
    }
  }

  removeDraggable(element) {
    try {
      element.removeEventListener('mousedown', this._boundMouseDown);
      element.removeEventListener('touchstart', this._boundTouchStart);

      if (element.classList.contains(CSS_CLASSES.DRAGGABLE)) {
        element.classList.remove(CSS_CLASSES.DRAGGABLE);
      }

      this.draggableElements = this.playAreaElement.querySelectorAll(
        `.${CSS_CLASSES.DRAGGABLE}`
      );
    } catch (err) {
      console.error('Allonsh Error removing draggable element:', err);
    }
  }

  setDropzones(selector) {
    try {
      this.dropzoneElements = this.playAreaElement.querySelectorAll(
        `.${selector}`
      );
      this._dropzoneSet = new Set(this.dropzoneElements);
    } catch (err) {
      console.error('Allonsh Error setting dropzones:', err);
    }
  }
}

export default Allonsh;
