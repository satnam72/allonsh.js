import { CSS_CLASSES, EVENTS } from './constants.js';

export class DropzoneManager {
  constructor(
    playAreaElement,
    enableStacking,
    stackDirection,
    stackSpacing,
    styleManager
  ) {
    this.playAreaElement = playAreaElement;
    this.enableStacking = enableStacking;
    this.stackDirection = stackDirection;
    this.stackSpacing = stackSpacing;
    this.styleManager = styleManager;
    this.dropzoneElements = [];
    this._dropzoneSet = new Set();
  }

  initializeDropzones(dropzoneSelector) {
    if (dropzoneSelector) {
      this.dropzoneElements = this.playAreaElement.querySelectorAll(
        `.${dropzoneSelector}`
      );
      this._dropzoneSet = new Set(this.dropzoneElements);
      this.dropzoneElements.forEach((dropzone) => {
        if (this.enableStacking) {
          this.applyStackingStyles(dropzone);
        }
      });
    }
  }

  setDropzones(selector) {
    this.dropzoneElements = this.playAreaElement.querySelectorAll(
      `.${selector}`
    );
    this._dropzoneSet = new Set(this.dropzoneElements);
    this.dropzoneElements.forEach((dropzone) => {
      if (this.enableStacking) {
        this.applyStackingStyles(dropzone);
      }
    });
  }

  applyStackingStyles(dropzone) {
    this.styleManager.applyStackingStyles(dropzone, {
      stackDirection: this.stackDirection,
      stackSpacing: this.stackSpacing,
    });
  }

  removeStackingStyles(dropzone) {
    this.styleManager.removeStackingStyles(dropzone);
  }

  handleDropzoneDrop(draggedElement, dropzone, event) {
    if (this.enableStacking) {
      this.applyStackingStyles(dropzone);
    }
    this.styleManager.resetPosition(draggedElement);
    dropzone.appendChild(draggedElement);

    dropzone.dispatchEvent(
      new CustomEvent(EVENTS.DROP, {
        detail: { draggedElement, originalEvent: event },
      })
    );
    dropzone.dispatchEvent(
      new CustomEvent(EVENTS.DRAG_ENTER, { detail: { draggedElement } })
    );
    dropzone.dispatchEvent(
      new CustomEvent(EVENTS.DRAG_LEAVE, { detail: { draggedElement } })
    );
    dropzone.classList.remove(CSS_CLASSES.HIGHLIGHT);
  }

  findClosestDropzone(element) {
    let el = element;
    while (el && el !== this.playAreaElement) {
      if (this._dropzoneSet.has(el)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  isDropzoneRestricted(dropzone) {
    return dropzone?.classList.contains(CSS_CLASSES.RESTRICTED);
  }

  toggleHighlight(enable) {
    this.dropzoneElements.forEach((dropzone) => {
      dropzone.classList.toggle(CSS_CLASSES.HIGHLIGHT, enable);
    });
  }
}
