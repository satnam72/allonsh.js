// allonsh.js
class Allonsh {
  /**
   * @param {string} draggableSelector - CSS selector for draggable elements
   * @param {object} options - Optional settings
   */
  constructor(draggableSelector, options = {}) {
    this.draggables = document.querySelectorAll(draggableSelector);
    this.draggedElement = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this._snapToCenterEnabled = false;
    this._dropzones = new Set();

    // internal flag tracking whether CSS has been injected
    this._cssInjected = false;

    // Internal flag for whether default CSS is applied
    this._applyDefaultCSS =
      options.applyDefaultCSS !== undefined ? options.applyDefaultCSS : true;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._initialize();

    // Apply CSS according to initial option
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

    if (this._applyDefaultCSS) {
      // Inject default CSS if not already done
      if (!this._cssInjected) {
        this._injectDefaultCss();
        this._cssInjected = true;
      }

      this.draggables.forEach((el) => {
        if (!el.classList.contains('allonsh-draggable')) {
          el.classList.add('allonsh-draggable');
        }
        Object.assign(el.style, {
          position: 'absolute',
          cursor: 'grab',
          userSelect: 'none',
        });
      });
    } else {
      // When disabling CSS injection, remove class and warn about missing styles
      this.draggables.forEach((el) => {
        el.classList.remove('allonsh-draggable');
        const style = getComputedStyle(el);
        // Removed cursor check here
        const required = {
          position: 'absolute',
          userSelect: 'none',
        };
        for (const [prop, val] of Object.entries(required)) {
          if (style.getPropertyValue(prop).trim() !== val) {
            console.warn(`[Allonsh] "${prop}" should be "${val}".`);
          }
        }
      });
      console.error(
        '[Allonsh] Default CSS injection disabled. Please provide required CSS for draggable elements.'
      );
    }
  }

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

  _initialize() {
    this.draggables.forEach((element) => {
      if (this._applyDefaultCSS) {
        if (!element.classList.contains('allonsh-draggable')) {
          element.classList.add('allonsh-draggable');
        }
        Object.assign(element.style, {
          position: 'absolute',
          cursor: 'grab',
          userSelect: 'none',
        });
      } else {
        const style = getComputedStyle(element);
        // Removed cursor check here
        const required = {
          position: 'absolute',
          userSelect: 'none',
        };
        for (const [prop, val] of Object.entries(required)) {
          if (style.getPropertyValue(prop).trim() !== val) {
            console.warn(`[Allonsh] "${prop}" should be "${val}".`);
          }
        }
        console.error(
          '[Allonsh] Default CSS injection disabled. Please provide required CSS for draggable elements.'
        );
      }

      element.addEventListener('mousedown', this._onMouseDown);
    });
  }

  _onMouseDown(event) {
    this.draggedElement = event.target;
    const rect = this.draggedElement.getBoundingClientRect();

    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    this.draggedElement.style.cursor = 'grabbing';
    this.draggedElement.style.zIndex = '1000';

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);

    this.draggedElement.dispatchEvent(
      new CustomEvent('allonsh-dragstart', {
        detail: { originalEvent: event },
      })
    );
  }

  _onMouseMove(event) {
    if (!this.draggedElement) return;

    const draggedElement = this.draggedElement;
    const dragRect = draggedElement.getBoundingClientRect();

    let newLeft = event.clientX - this.offsetX;
    let newTop = event.clientY - this.offsetY;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const elWidth = dragRect.width;
    const elHeight = dragRect.height;

    if (newLeft < 0) {
      if (scrollX > 0) window.scrollBy(newLeft, 0);
      newLeft = Math.max(newLeft, 0);
    } else if (newLeft + elWidth > vw) {
      const maxScrollX = document.documentElement.scrollWidth - vw;
      if (scrollX < maxScrollX) window.scrollBy(newLeft + elWidth - vw, 0);
      newLeft = Math.min(newLeft, vw - elWidth);
    }

    if (newTop < 0) {
      if (scrollY > 0) window.scrollBy(0, newTop);
      newTop = Math.max(newTop, 0);
    } else if (newTop + elHeight > vh) {
      const maxScrollY = document.documentElement.scrollHeight - vh;
      if (scrollY < maxScrollY) window.scrollBy(0, newTop + elHeight - vh);
      newTop = Math.min(newTop, vh - elHeight);
    }

    draggedElement.style.left = scrollX + newLeft + 'px';
    draggedElement.style.top = scrollY + newTop + 'px';

    draggedElement.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    draggedElement.style.pointerEvents = 'auto';

    if (elementBelow && elementBelow !== draggedElement) {
      elementBelow.dispatchEvent(
        new CustomEvent('allonsh-dragover', {
          detail: { draggedElement, originalEvent: event },
        })
      );
    }
  }

  _onMouseUp(event) {
    if (!this.draggedElement) return;

    this.draggedElement.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    this.draggedElement.style.pointerEvents = 'auto';

    if (elementBelow && elementBelow !== this.draggedElement) {
      elementBelow.dispatchEvent(
        new CustomEvent('allonsh-drop', {
          detail: { draggedElement: this.draggedElement, originalEvent: event },
        })
      );

      if (this._snapToCenterEnabled && this._dropzones.has(elementBelow)) {
        this._applySnapToCenter(this.draggedElement, elementBelow);
      }
    }

    this.draggedElement.style.cursor = 'grab';
    this.draggedElement.style.zIndex = '';

    this.draggedElement = null;

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

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

  enableSnapToCenter(enable = true) {
    this._snapToCenterEnabled = enable;
  }

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
}

export default Allonsh;
