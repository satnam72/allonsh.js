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
    this.draggables.forEach(element => {
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

    this.draggedElement.dispatchEvent(new CustomEvent('allonsh-dragstart', {
      detail: { originalEvent: event }
    }));
  }

  _onMouseMove(event) {
    if (!this.draggedElement) return;

    this.draggedElement.style.left = (event.clientX - this.offsetX) + 'px';
    this.draggedElement.style.top = (event.clientY - this.offsetY) + 'px';

    this.draggedElement.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.draggedElement.style.pointerEvents = 'auto';

    if (elementBelow && elementBelow !== this.draggedElement) {
      elementBelow.dispatchEvent(new CustomEvent('allonsh-dragover', {
        detail: { draggedEl: this.draggedElement, originalEvent: event }
      }));
    }
  }

  _onMouseUp(event) {
    if (!this.draggedElement) return;

    this.draggedElement.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.draggedElement.style.pointerEvents = 'auto';

    if (elementBelow && elementBelow !== this.draggedElement) {
      elementBelow.dispatchEvent(new CustomEvent('allonsh-drop', {
        detail: { draggedEl: this.draggedElement, originalEvent: event }
      }));

      // Auto-snap to center if enabled AND dropped on a registered dropzone
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

    this._dropzones.add(dropzone); // Track this dropzone

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
