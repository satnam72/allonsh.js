import {
  OPACITY,
  Z_INDEX,
  EVENTS,
  POINTER_EVENTS,
} from './constants.js';

export class DragManager {
  constructor(
    playAreaElement,
    dropzoneManager,
    styleManager,
    useGhostEffect,
    restrictToDropzones
  ) {
    this.playAreaElement = playAreaElement;
    this.dropzoneManager = dropzoneManager;
    this.styleManager = styleManager;
    this.useGhostEffect = useGhostEffect;
    this.restrictToDropzones = restrictToDropzones;
    this.currentDraggedElement = null;
    this.ghostElement = null;
    this.originalParent = null;
    this.originalDropzone = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  startDrag(event, clientX, clientY) {
    this.currentDraggedElement = event.currentTarget;
    this.styleManager.applyDraggingStyles(this.currentDraggedElement);
    this.originalParent = this.currentDraggedElement.parentElement;
    this.originalDropzone = this.dropzoneManager.findClosestDropzone(
      this.currentDraggedElement
    );

    const playAreaRect = this.playAreaElement.getBoundingClientRect();
    const rect = this.currentDraggedElement.getBoundingClientRect();

    if (this.useGhostEffect && this.originalParent !== this.playAreaElement) {
      this._createGhostElement(rect, playAreaRect);
    }

    this.dragOffsetX = clientX - rect.left;
    this.dragOffsetY = clientY - rect.top;

    this.currentDraggedElement.dispatchEvent(
      new CustomEvent(EVENTS.DRAG_START, { detail: { originalEvent: event } })
    );

    this.dropzoneManager.toggleHighlight(true);
  }

  _createGhostElement(rect, playAreaRect) {
    this._removeGhostElement();
    this.ghostElement = this.currentDraggedElement.cloneNode(true);
    this.styleManager.applyGhostStyles(this.ghostElement);
    this.playAreaElement.appendChild(this.ghostElement);
    this.ghostElement.style.left = `${rect.left - playAreaRect.left}px`;
    this.ghostElement.style.top = `${rect.top - playAreaRect.top}px`;
    this.currentDraggedElement.style.opacity = OPACITY.GHOST;
  }

  updateDragPosition(clientX, clientY) {
    if (!this.currentDraggedElement) return;

    const playAreaRect = this.playAreaElement.getBoundingClientRect();
    const element = this.ghostElement || this.currentDraggedElement;
    const rect = element.getBoundingClientRect();
    const maxLeft = playAreaRect.width - rect.width;
    const maxTop = playAreaRect.height - rect.height;

    let newLeft = clientX - playAreaRect.left - this.dragOffsetX;
    let newTop = clientY - playAreaRect.top - this.dragOffsetY;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    if (this.ghostElement) {
      this.ghostElement.style.left = `${newLeft}px`;
      this.ghostElement.style.top = `${newTop}px`;
    } else {
      this.styleManager.applyAbsolutePositioning(this.currentDraggedElement);
      this.currentDraggedElement.style.left = `${newLeft}px`;
      this.currentDraggedElement.style.top = `${newTop}px`;
    }
  }

  handleDrop(clientX, clientY, event) {
    if (!this.currentDraggedElement) return;

    this.currentDraggedElement.style.opacity = OPACITY.FULL;
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
    const elementBelow = document.elementFromPoint(clampedX, clampedY);
    this.currentDraggedElement.style.pointerEvents = POINTER_EVENTS.AUTO;

    if (!elementBelow && this.restrictToDropzones) {
      this._returnToOrigin();
      this._resetDraggedElementState();
      return;
    }

    const dropzoneFound =
      this.dropzoneManager.findClosestDropzone(elementBelow);
    if (dropzoneFound) {
      this.dropzoneManager.handleDropzoneDrop(
        this.currentDraggedElement,
        dropzoneFound,
        event
      );
    } else if (!this.restrictToDropzones) {
      this._placeInPlayArea(clampedX, clampedY, playAreaRect);
    } else {
      this._returnToOrigin();
    }

    this._resetDraggedElementState();
  }

  _placeInPlayArea(clampedX, clampedY, playAreaRect) {
    if (this.currentDraggedElement.parentElement !== this.playAreaElement) {
      this.playAreaElement.appendChild(this.currentDraggedElement);
      this.styleManager.applyAbsolutePositioning(this.currentDraggedElement);
      const offsetX = clampedX - playAreaRect.left - this.dragOffsetX;
      const offsetY = clampedY - playAreaRect.top - this.dragOffsetY;
      this.currentDraggedElement.style.left = `${offsetX}px`;
      this.currentDraggedElement.style.top = `${offsetY}px`;
      this.currentDraggedElement.style.zIndex = Z_INDEX.DRAGGING;
    }
  }

  _returnToOrigin() {
    if (
      this.originalDropzone &&
      !this.dropzoneManager.isDropzoneRestricted(this.originalDropzone)
    ) {
      this.dropzoneManager.applyStackingStyles(this.originalDropzone);
      this.styleManager.resetPosition(this.currentDraggedElement);
      this.originalDropzone.appendChild(this.currentDraggedElement);
    } else {
      this.styleManager.resetPosition(this.currentDraggedElement);
      this.playAreaElement.appendChild(this.currentDraggedElement);
    }
  }

  _removeGhostElement() {
    if (this.ghostElement && this.ghostElement.parentElement) {
      this.ghostElement.parentElement.removeChild(this.ghostElement);
      this.ghostElement = null;
    }
  }

  _resetDraggedElementState() {
    if (this.currentDraggedElement) {
      this.styleManager.resetDraggableStyles(this.currentDraggedElement);
      this.dropzoneManager.toggleHighlight(false);
    }
    this._removeGhostElement();
    this.currentDraggedElement = null;
    this.originalParent = null;
    this.originalDropzone = null;
  }
}
