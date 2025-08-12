// allonsh.js
class Allonsh {
  constructor(draggableSelector) {
    this.draggables = document.querySelectorAll(draggableSelector);
    this.draggedEl = null;
    this.offsetX = 0;
    this.offsetY = 0;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this.init();
  }

  init() {
    this.draggables.forEach(el => {
      el.style.position = 'absolute'; // ensure draggable is positioned
      el.style.cursor = 'grab';
      el.addEventListener('mousedown', this._onMouseDown);
    });
  }

  _onMouseDown(e) {
    this.draggedEl = e.target;
    const rect = this.draggedEl.getBoundingClientRect();

    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;

    this.draggedEl.style.cursor = 'grabbing';
    this.draggedEl.style.zIndex = '1000';

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);

    // Dispatch custom event dragstart
    this.draggedEl.dispatchEvent(new CustomEvent('allonsh-dragstart', {
      detail: { originalEvent: e }
    }));
  }

  _onMouseMove(e) {
    if (!this.draggedEl) return;

    // Move element to follow cursor with offset
    this.draggedEl.style.left = (e.clientX - this.offsetX) + 'px';
    this.draggedEl.style.top = (e.clientY - this.offsetY) + 'px';

    // Temporarily disable pointer events to detect element below
    this.draggedEl.style.pointerEvents = 'none';
    const elBelow = document.elementFromPoint(e.clientX, e.clientY);
    this.draggedEl.style.pointerEvents = 'auto';

    if (elBelow && elBelow !== this.draggedEl) {
      // Dispatch dragover event on element below
      elBelow.dispatchEvent(new CustomEvent('allonsh-dragover', {
        detail: { draggedEl: this.draggedEl, originalEvent: e }
      }));
    }
  }

  _onMouseUp(e) {
    if (!this.draggedEl) return;

    // Temporarily disable pointer events to detect element below
    this.draggedEl.style.pointerEvents = 'none';
    const elBelow = document.elementFromPoint(e.clientX, e.clientY);
    this.draggedEl.style.pointerEvents = 'auto';

    // Dispatch drop event on element below
    if (elBelow && elBelow !== this.draggedEl) {
      elBelow.dispatchEvent(new CustomEvent('allonsh-drop', {
        detail: { draggedEl: this.draggedEl, originalEvent: e }
      }));
    }

    this.draggedEl.style.cursor = 'grab';
    this.draggedEl.style.zIndex = '';

    this.draggedEl = null;

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }
}

// Export default for ES modules
export default Allonsh;
