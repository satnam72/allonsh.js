import { DEFAULTS, CSS_CLASSES } from './constants.js';
import { EventManager } from './EventManager.js';
import { DragManager } from './DragManager.js';
import { DropzoneManager } from './DropzoneManager.js';
import { StyleManager } from './StyleManager.js';

export default class Allonsh {
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
      throw new Error("Allonsh Error: 'draggableSelector' is required.");
    }

    this.options = { draggableSelector, dropzoneSelector, playAreaSelector };
    this.restrictToDropzones = restrictToDropzones;
    this.enableStacking = enableStacking;
    this.stackDirection = stackDirection;
    this.stackSpacing = stackSpacing;
    this.useGhostEffect = useGhostEffect;

    this.playAreaElement = playAreaSelector
      ? document.querySelector(`.${playAreaSelector}`)
      : document.body;
    if (!this.playAreaElement) {
      throw new Error(
        `Allonsh Error: Play area element with class '${playAreaSelector}' not found.`
      );
    }

    this.draggableElements = this.playAreaElement.querySelectorAll(
      `.${draggableSelector}`
    );
    if (!this.draggableElements.length) {
      console.warn(
        `Allonsh Warning: No draggable elements found with selector '.${draggableSelector}'.`
      );
    }

    this.styleManager = new StyleManager();
    this.dropzoneManager = new DropzoneManager(
      this.playAreaElement,
      enableStacking,
      stackDirection,
      stackSpacing,
      this.styleManager
    );
    this.dragManager = new DragManager(
      this.playAreaElement,
      this.dropzoneManager,
      this.styleManager,
      useGhostEffect,
      restrictToDropzones
    );
    this.eventManager = new EventManager(
      this.dragManager,
      this.dropzoneManager,
      this.styleManager
    );

    this._initialize();
  }

  _initialize() {
    this.styleManager.applyPlayAreaStyles(this.playAreaElement);
    if (!this.draggableElements.length) return;
    this.eventManager.bindEvents(this.draggableElements);
    this.dropzoneManager.initializeDropzones(this.options.dropzoneSelector);
  }

  update(newOptions = {}) {
    const {
      draggableSelector = this.options.draggableSelector,
      dropzoneSelector = this.options.dropzoneSelector,
      playAreaSelector = this.options.playAreaSelector,
      restrictToDropzones = this.restrictToDropzones,
      enableStacking = this.enableStacking,
      stackDirection = this.stackDirection,
      stackSpacing = this.stackSpacing,
      useGhostEffect = this.useGhostEffect,
    } = newOptions;

    this.options = {
      ...this.options,
      draggableSelector,
      dropzoneSelector,
      playAreaSelector,
    };
    this.restrictToDropzones = restrictToDropzones;
    this.enableStacking = enableStacking;
    this.stackDirection = stackDirection;
    this.stackSpacing = stackSpacing;
    this.useGhostEffect = useGhostEffect;

    if (playAreaSelector !== this.options.playAreaSelector) {
      const newPlayArea = document.querySelector(`.${playAreaSelector}`);
      if (newPlayArea) {
        this.playAreaElement = newPlayArea;
        this.styleManager.applyPlayAreaStyles(this.playAreaElement);
        this.dragManager.playAreaElement = this.playAreaElement;
        this.dropzoneManager.playAreaElement = this.playAreaElement;
      } else {
        console.warn(
          `Allonsh Warning: Play area element with class '${playAreaSelector}' not found.`
        );
      }
    }

    if (draggableSelector !== this.options.draggableSelector) {
      this.eventManager.unbindEvents(this.draggableElements);
      this.draggableElements = this.playAreaElement.querySelectorAll(
        `.${draggableSelector}`
      );
      this.eventManager.bindEvents(this.draggableElements);
    }

    if (dropzoneSelector !== this.options.dropzoneSelector) {
      this.dropzoneManager.setDropzones(dropzoneSelector);
    }

    this.dropzoneManager.enableStacking = this.enableStacking;
    this.dropzoneManager.stackDirection = this.stackDirection;
    this.dropzoneManager.stackSpacing = this.stackSpacing;
    this.dragManager.useGhostEffect = this.useGhostEffect;
    this.dragManager.restrictToDropzones = this.restrictToDropzones;

    this.dropzoneManager.dropzoneElements.forEach((dropzone) => {
      this.enableStacking
        ? this.dropzoneManager.applyStackingStyles(dropzone)
        : this.dropzoneManager.removeStackingStyles(dropzone);
    });
  }

  resetAll() {
    this.draggableElements.forEach((el) => {
      if (this.playAreaElement.contains(el)) {
        this.playAreaElement.appendChild(el);
        this.styleManager.resetPosition(el);
      }
    });
  }

  addDraggable(element) {
    this.eventManager.bindEvents([element]);
    this.draggableElements = this.playAreaElement.querySelectorAll(
      `.${CSS_CLASSES.DRAGGABLE}`
    );
  }

  removeDraggable(element) {
    this.eventManager.unbindEvents([element]);
    element.classList.remove(CSS_CLASSES.DRAGGABLE);
    this.draggableElements = this.playAreaElement.querySelectorAll(
      `.${CSS_CLASSES.DRAGGABLE}`
    );
  }

  setDropzones(selector) {
    this.dropzoneManager.setDropzones(selector);
    this.options.dropzoneSelector = selector;
  }
}
