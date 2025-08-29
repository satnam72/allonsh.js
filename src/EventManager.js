import { CSS_CURSORS } from './constants.js';

export class EventManager {
  constructor(dragManager, dropzoneManager, styleManager) {
    this.dragManager = dragManager;
    this.dropzoneManager = dropzoneManager;
    this.styleManager = styleManager;

    this._boundMouseMoveHandler = this._onMouseMove.bind(this);
    this._boundMouseUpHandler = this._onMouseUp.bind(this);
    this._boundTouchMoveHandler = this._onTouchMove.bind(this);
    this._boundTouchEndHandler = this._onTouchEnd.bind(this);
    this._boundMouseDown = this._onMouseDown.bind(this);
    this._boundTouchStart = this._onTouchStart.bind(this);
  }

  bindEvents(draggableElements) {
    draggableElements.forEach((element) => {
      this.styleManager.applyDraggableStyles(element);
      element.addEventListener('mousedown', this._boundMouseDown);
      element.addEventListener('touchstart', this._boundTouchStart, {
        passive: false,
      });
    });
  }

  unbindEvents(draggableElements) {
    draggableElements.forEach((element) => {
      element.removeEventListener('mousedown', this._boundMouseDown);
      element.removeEventListener('touchstart', this._boundTouchStart);
    });
  }

  _onMouseDown(event) {
    this.dragManager.startDrag(event, event.clientX, event.clientY);
    document.addEventListener('mousemove', this._boundMouseMoveHandler);
    document.addEventListener('mouseup', this._boundMouseUpHandler);
  }

  _onTouchStart(event) {
    event.preventDefault();
    const touchPoint = event.touches[0];
    this.dragManager.startDrag(event, touchPoint.clientX, touchPoint.clientY);
    document.addEventListener('touchmove', this._boundTouchMoveHandler, {
      passive: false,
    });
    document.addEventListener('touchend', this._boundTouchEndHandler);
  }

  _onMouseMove(event) {
    this.dragManager.updateDragPosition(event.clientX, event.clientY);
  }

  _onTouchMove(event) {
    event.preventDefault();
    const touchPoint = event.touches[0];
    this.dragManager.updateDragPosition(touchPoint.clientX, touchPoint.clientY);
  }

  _onMouseUp(event) {
    this.dragManager.handleDrop(event.clientX, event.clientY, event);
    document.removeEventListener('mousemove', this._boundMouseMoveHandler);
    document.removeEventListener('mouseup', this._boundMouseUpHandler);
  }

  _onTouchEnd(event) {
    const touchPoint = event.changedTouches[0];
    this.dragManager.handleDrop(touchPoint.clientX, touchPoint.clientY, event);
    document.removeEventListener('touchmove', this._boundTouchMoveHandler);
    document.removeEventListener('touchend', this._boundTouchEndHandler);
  }
}
