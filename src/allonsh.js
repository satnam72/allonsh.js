class Allonsh {
  /**
   * @param {string} draggableSelector - CSS selector for draggable elements
   * @param {object} options - Optional settings
   */
  constructor(draggableSelector, options = {}) {
    this._draggableSelector = draggableSelector;
    this.draggables = document.querySelectorAll(draggableSelector);
    this.draggedElement = null;
    this.offsetX = 0;
    this.offsetY = 0;

    // Configurable options with sensible defaults
    this._applyDefaultCSS =
      options.applyDefaultCSS !== undefined ? options.applyDefaultCSS : true;

    this._snapToCenterEnabled =
      options.snapToCenter !== undefined ? options.snapToCenter : true;

    this._accessibilityEnabled =
      options.accessibility !== undefined ? options.accessibility : false;

    this._zIndex = options.zIndex || 1000;

    this._dropzones = new Set();
    this._cssInjected = false;

    // Bind methods
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

    this._initialize();

    this.applyDefaultCSS(this._applyDefaultCSS);
  }

  /**
   * Enable or disable default CSS injection and styling.
   * @param {boolean} value
   */
  applyDefaultCSS(value) {
    const boolVal = Boolean(value);
    if (this._applyDefaultCSS === boolVal) return;

    this._applyDefaultCSS = boolVal;

    if (this._applyDefaultCSS && !this._cssInjected) {
      this._injectDefaultCss();
      this._cssInjected = true;
    }

    this.draggables.forEach((el) => {
      if (this._applyDefaultCSS) {
        el.classList.add('allonsh-draggable');
        Object.assign(el.style, {
          position: 'absolute',
          cursor: 'grab',
          userSelect: 'none',
        });
      } else {
        el.classList.remove('allonsh-draggable');
        console.warn(
          '[Allonsh] Default CSS injection disabled. Please provide required CSS for draggable elements.'
        );
      }
    });
  }

  /**
   * Injects default CSS into the page if needed.
   */
  _injectDefaultCss() {
    if (document.getElementById('allonsh-default-css')) return;

    const style = document.createElement('style');
    style.id = 'allonsh-default-css';
    style.textContent = `
      .allonsh-draggable {
        position: absolute !important;
        cursor: grab !important;
        user-select: none !important;
      }
      .allonsh-draggable:active {
        cursor: grabbing !important;
      }
      .dragover {
        background-color: #d3f9d8 !important;
        border-color: #4caf50 !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initializes draggable elements with required event listeners and styles.
   */
  _initialize() {
    this.draggables.forEach((element) => {
      // Apply default CSS if enabled
      if (this._applyDefaultCSS) {
        if (!element.classList.contains('allonsh-draggable')) {
          element.classList.add('allonsh-draggable');
        }
        Object.assign(element.style, {
          position: 'absolute',
          cursor: 'grab',
          userSelect: 'none',
        });
      }

      // Accessibility features (optional)
      if (this._accessibilityEnabled) {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');
        element.addEventListener('keydown', this._onKeyDown);
      }

      // Event listeners
      element.addEventListener('mousedown', this._onMouseDown);
      element.addEventListener('touchstart', this._onTouchStart, {
        passive: false,
      });
      element.addEventListener('keydown', this._onKeyDown);
    });
  }

  /**
   * Re-scan DOM and apply draggable behavior to new elements.
   */
  refresh() {
    this.draggables = document.querySelectorAll(this._draggableSelector);
    this._initialize();
  }

  /**
   * Clean up all listeners (for reuse or memory safety).
   */
  destroy() {
    this.draggables.forEach((el) => {
      el.removeEventListener('mousedown', this._onMouseDown);
      el.removeEventListener('touchstart', this._onTouchStart);
      if (this._accessibilityEnabled) {
        el.removeEventListener('keydown', this._onKeyDown);
      }
    });

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  /**
   * Mouse down event to initiate dragging.
   */
  _onMouseDown(event) {
    this._startDrag(event, event.clientX, event.clientY);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
  }

  /**
   * Touch start event (mobile support).
   */
  _onTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    this._startDrag(event, touch.clientX, touch.clientY);
    document.addEventListener('touchmove', this._onTouchMove, {
      passive: false,
    });
    document.addEventListener('touchend', this._onTouchEnd);
  }

  /**
   * Shared drag start logic (mouse + touch).
   */
  _startDrag(event, clientX, clientY) {
    this.draggedElement = event.target;
    const rect = this.draggedElement.getBoundingClientRect();

    this.offsetX = clientX - rect.left;
    this.offsetY = clientY - rect.top;

    this.draggedElement.style.cursor = 'grabbing';
    this.draggedElement.style.zIndex = this._zIndex;

    this.draggedElement.dispatchEvent(
      new CustomEvent('allonsh-dragstart', {
        detail: { originalEvent: event },
      })
    );
  }

  /**
   * Mouse move event to perform dragging.
   */
  _onMouseMove(event) {
    this._handleDragMove(event.clientX, event.clientY, event);
  }

  /**
   * Touch move event for dragging on mobile.
   */
  _onTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    this._handleDragMove(touch.clientX, touch.clientY, event);
  }

  /**
   * Shared drag movement logic.
   */
  _handleDragMove(clientX, clientY, event) {
    if (!this.draggedElement) return;

    const draggedElement = this.draggedElement;
    const dragRect = draggedElement.getBoundingClientRect();

    let newLeft = clientX - this.offsetX;
    let newTop = clientY - this.offsetY;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const elWidth = dragRect.width;
    const elHeight = dragRect.height;

    // Prevent going outside viewport
    newLeft = Math.max(0, Math.min(newLeft, vw - elWidth));
    newTop = Math.max(0, Math.min(newTop, vh - elHeight));

    draggedElement.style.left = scrollX + newLeft + 'px';
    draggedElement.style.top = scrollY + newTop + 'px';

    // Temporarily hide element to detect drop target
    draggedElement.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(clientX, clientY);
    draggedElement.style.pointerEvents = 'auto';

    if (elementBelow && elementBelow !== draggedElement) {
      elementBelow.dispatchEvent(
        new CustomEvent('allonsh-dragover', {
          detail: { draggedElement, originalEvent: event },
        })
      );
    }
  }

  /**
   * Mouse up to drop element.
   */
  _onMouseUp(event) {
    this._endDrag(event.clientX, event.clientY, event);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  /**
   * Touch end to drop element (mobile).
   */
  _onTouchEnd(event) {
    const touch = event.changedTouches[0];
    this._endDrag(touch.clientX, touch.clientY, event);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  /**
   * Shared drop logic (mouse + touch).
   */
  _endDrag(clientX, clientY, event) {
    if (!this.draggedElement) return;

    this.draggedElement.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(clientX, clientY);
    this.draggedElement.style.pointerEvents = 'auto';

    if (elementBelow && elementBelow !== this.draggedElement) {
      elementBelow.dispatchEvent(
        new CustomEvent('allonsh-drop', {
          detail: {
            draggedElement: this.draggedElement,
            originalEvent: event,
          },
        })
      );

      // Snap to center if enabled and in dropzone
      if (this._snapToCenterEnabled && this._dropzones.has(elementBelow)) {
        this._applySnapToCenter(this.draggedElement, elementBelow);
      }
    }

    this.draggedElement.style.cursor = 'grab';
    this.draggedElement.style.zIndex = '';

    this.draggedElement = null;
  }

  /**
   * Registers a dropzone element and its onDrop handler.
   * @param {string} selector
   * @param {Function} onDrop
   */
  registerDropzone(selector, onDrop) {
    const dropzone = document.querySelector(selector);
    if (!dropzone) return;

    this._dropzones.add(dropzone);

    dropzone.addEventListener('allonsh-dragover', () => {
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('allonsh-drop', (event) => {
      dropzone.classList.remove('dragover');
      if (typeof onDrop === 'function') {
        onDrop(event.detail.draggedElement, dropzone);
      }
    });

    document.addEventListener('allonsh-dragstart', () => {
      dropzone.classList.remove('dragover');
    });
  }

  /**
   * Enable or disable snap-to-center feature.
   * @param {boolean} enable
   */
  enableSnapToCenter(enable = true) {
    this._snapToCenterEnabled = enable;
  }

  /**
   * Moves dragged element to the center of the dropzone.
   */
  _applySnapToCenter(draggedElement, dropzone) {
    const dropRect = dropzone.getBoundingClientRect();
    const dragRect = draggedElement.getBoundingClientRect();

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    draggedElement.style.left =
      scrollX + dropRect.left + dropRect.width / 2 - dragRect.width / 2 + 'px';
    draggedElement.style.top =
      scrollY + dropRect.top + dropRect.height / 2 - dragRect.height / 2 + 'px';
  }

  /**
   * Arrow key navigation support for accessibility.
   */
  _onKeyDown(event) {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    )
      return;

    const el = event.target;
    const step = 10;
    const left = parseInt(el.style.left || 0, 10);
    const top = parseInt(el.style.top || 0, 10);

    switch (event.key) {
      case 'ArrowUp':
        el.style.top = `${top - step}px`;
        break;
      case 'ArrowDown':
        el.style.top = `${top + step}px`;
        break;
      case 'ArrowLeft':
        el.style.left = `${left - step}px`;
        break;
      case 'ArrowRight':
        el.style.left = `${left + step}px`;
        break;
    }
  }
}

export default Allonsh;
