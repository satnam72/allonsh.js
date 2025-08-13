// allonsh.js
class Allonsh {
  constructor(draggableSelector) {
    this.draggables = document.querySelectorAll(draggableSelector);
    this.draggedElement = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this._snapToCenterEnabled = false;
    this._dropzones = new Set(); // Track registered dropzones

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._initialize();
  }

  _initialize() {
    this.draggables.forEach((element) => {
      element.style.position = 'absolute';
      element.style.cursor = 'grab';
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

    const draggedEl = this.draggedElement;
    const dragRect = draggedEl.getBoundingClientRect();

    // Calculate new desired position relative to viewport
    let newLeft = event.clientX - this.offsetX;
    let newTop = event.clientY - this.offsetY;

    // Viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Scroll positions
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Width and height of dragged element
    const elWidth = dragRect.width;
    const elHeight = dragRect.height;

    // Check boundaries and scroll if possible, else clamp

    // Horizontal (left)
    if (newLeft < 0) {
      if (scrollX > 0) {
        window.scrollBy(newLeft, 0);
      }
      newLeft = Math.max(newLeft, 0);
    } else if (newLeft + elWidth > vw) {
      const maxScrollX = document.documentElement.scrollWidth - vw;
      if (scrollX < maxScrollX) {
        window.scrollBy(newLeft + elWidth - vw, 0);
      }
      newLeft = Math.min(newLeft, vw - elWidth);
    }

    // Vertical (top)
    if (newTop < 0) {
      if (scrollY > 0) {
        window.scrollBy(0, newTop);
      }
      newTop = Math.max(newTop, 0);
    } else if (newTop + elHeight > vh) {
      const maxScrollY = document.documentElement.scrollHeight - vh;
      if (scrollY < maxScrollY) {
        window.scrollBy(0, newTop + elHeight - vh);
      }
      newTop = Math.min(newTop, vh - elHeight);
    }

    // Apply new position relative to document (scroll + viewport offset)
    draggedEl.style.left = scrollX + newLeft + 'px';
    draggedEl.style.top = scrollY + newTop + 'px';

    // Drag over detection
    draggedEl.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    draggedEl.style.pointerEvents = 'auto';

    if (elementBelow && elementBelow !== draggedEl) {
      elementBelow.dispatchEvent(
        new CustomEvent('allonsh-dragover', {
          detail: { draggedEl, originalEvent: event },
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
          detail: { draggedEl: this.draggedElement, originalEvent: event },
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

  /**
   * Registers a dropzone and optional drop handler.
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
        onDrop(event.detail.draggedEl, dropzone);
      }
    });

    document.addEventListener('allonsh-dragstart', () => {
      dropzone.classList.remove('dragover');
    });
  }

  /**
   * Enables or disables automatic snap-to-center behavior on drop.
   */
  enableSnapToCenter(enable = true) {
    this._snapToCenterEnabled = enable;
  }

  /**
   * Applies snap-to-center logic to a dragged element.
   * @private
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
}

// Export default for ES modules
export default Allonsh;
