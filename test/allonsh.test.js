import { describe, it, expect, beforeEach, vi } from 'vitest';
import Allonsh from '../src/allonsh.js';

function createDOM() {
  document.body.innerHTML = `
    <div class="play-area">
      <div class="dropzone one"></div>
      <div class="dropzone two"></div>
      <div class="draggable one">Item 1</div>
      <div class="draggable two">Item 2</div>
    </div>
  `;
}

describe('Allonsh', () => {
  let allonsh;

  beforeEach(() => {
    createDOM();

    allonsh = new Allonsh({
      draggableSelector: 'draggable',
      dropzoneSelector: 'dropzone',
      playAreaSelector: 'play-area',
      restrictToDropzones: true,
      enableStacking: true,
      useGhostEffect: true,
    });
  });

  it('should initialize without errors', () => {
    expect(allonsh).toBeInstanceOf(Allonsh);
  });

  it('should throw if draggableSelector is missing', () => {
    expect(() => new Allonsh()).toThrow(/draggableSelector/);
  });

  it('should attach draggable elements', () => {
    expect(allonsh.draggableElements.length).toBe(2);
    allonsh.draggableElements.forEach((el) => {
      expect(el.style.cursor).toBe('grab');
    });
  });

  it('should apply stacking styles to dropzones', () => {
    allonsh.dropzoneElements.forEach((el) => {
      expect(el.style.display).toBe('flex');
    });
  });

  it('should update options dynamically', () => {
    allonsh.update({ restrictToDropzones: false, stackDirection: 'vertical' });
    expect(allonsh.restrictToDropzones).toBe(false);
    expect(allonsh.stackDirection).toBe('vertical');
  });

  it('should add and remove draggable elements dynamically', () => {
    const newEl = document.createElement('div');
    newEl.className = 'draggable new';
    document.querySelector('.play-area').appendChild(newEl);

    allonsh.addDraggable(newEl);
    expect([...allonsh.draggableElements].includes(newEl)).toBe(true);

    allonsh.removeDraggable(newEl);
    expect([...allonsh.draggableElements].includes(newEl)).toBe(false);
  });

  it('should set new dropzones', () => {
    const newDropzone = document.createElement('div');
    newDropzone.className = 'custom-zone';
    document.querySelector('.play-area').appendChild(newDropzone);

    allonsh.setDropzones('custom-zone');
    expect(allonsh.dropzoneElements.length).toBe(1);
  });

  it('should reset all draggable elements', () => {
    const [el1, el2] = allonsh.draggableElements;
    const dropzone = allonsh.dropzoneElements[0];
    dropzone.appendChild(el1);
    dropzone.appendChild(el2);

    allonsh.resetAll();

    expect(el1.parentElement.classList.contains('play-area')).toBe(true);
    expect(el2.parentElement.classList.contains('play-area')).toBe(true);
  });

  it('should create ghost element on drag start when enabled', () => {
    const el = allonsh.draggableElements[0];
    const dropzone = allonsh.dropzoneElements[0];

    // Move the draggable element into a dropzone to simulate a real drag
    dropzone.appendChild(el);

    // Mock the position of the draggable
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 50,
      height: 50,
      right: 150,
      bottom: 150,
      x: 100,
      y: 100,
      toJSON: () => {},
    });

    vi.spyOn(allonsh.playAreaElement, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 1000,
      height: 1000,
      right: 1000,
      bottom: 1000,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    allonsh._startDrag({ currentTarget: el }, 110, 110);

    expect(allonsh.ghostElement).toBeTruthy();
    expect(allonsh.ghostElement.style.position).toBe('absolute');
  });

  it('should return to origin if dropped outside dropzone with restriction on', () => {
    const el = allonsh.draggableElements[0];
    const dropzone = allonsh.dropzoneElements[0];
    dropzone.appendChild(el);
    allonsh.originalDropzone = dropzone;
    allonsh.currentDraggedElement = el;

    allonsh._handleDrop(9999, 9999, new Event('mouseup'));

    expect(el.parentElement).toBe(dropzone);
  });

  it('should drop into a valid dropzone', () => {
    const el = allonsh.draggableElements[0];
    const dropzone = allonsh.dropzoneElements[0];

    document.elementFromPoint = vi.fn(() => dropzone);

    allonsh._startDrag({ currentTarget: el }, 110, 110);
    allonsh._handleDrop(110, 110, new Event('mouseup'));

    expect(el.parentElement).toBe(dropzone);
  });

  it('should dispatch custom events on drop', () => {
    const el = allonsh.draggableElements[0];
    const dropzone = allonsh.dropzoneElements[0];
    const dropHandler = vi.fn();
    dropzone.addEventListener('allonsh-drop', dropHandler);

    document.elementFromPoint = vi.fn(() => dropzone);

    allonsh._startDrag({ currentTarget: el }, 100, 100);
    allonsh._handleDrop(100, 100, new Event('mouseup'));

    expect(dropHandler).toHaveBeenCalled();
  });
});
