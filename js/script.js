import Allonsh from './allonsh.js';

const openPanelBtn = document.getElementById('openPanelBtn');
const closePanelBtn = document.getElementById('closePanelBtn');

const controlPanel = document.getElementById('controlPanel');

const toggleStackCheckbox = document.getElementById('stackCheckbox');
const ghostEffectCheckbox = document.getElementById('ghostEffectCheckbox');

const stackSpacingRange = document.getElementById('stackSpacingSlider');
const stackSpacingCurrentValue = document.getElementById('spacingValue');

const addItemBtn = document.getElementById('addItemBtn');
const resetBtn = document.getElementById('reset-btn');
const freemodeResetBtn = document.getElementById('reset-btn-freemode');

const verticalStackBtn = document.getElementById('verticalStackingBtn');
const horizontalStackBtn = document.getElementById('horizontalStackingBtn');

const draggableContainer = document.querySelector(
  '.demo-playground__draggables'
);

const restrictDropzoneCheckbox = document.getElementById(
  'restrictDropzoneCheckbox'
);

let allonshInstance = null;
let itemCountStartFrom = 1;

const draggableSelectorClass = 'draggable';
const dropzoneSelectorClass = 'dropzone';
const playAreaSelectorClass = 'demo-section__playground';

let currentStackDirection = 'horizontal';
let enableStackingBool = true;
let restrictDropzoneBool = true;

let ghostEffectBool = true;
let stackSpacingDefault = 10;

function initAllonsh(options) {
  if (allonshInstance) {
  }
  allonshInstance = new Allonsh({
    draggableSelector: draggableSelectorClass,
    dropzoneSelector: dropzoneSelectorClass,
    playAreaSelector: playAreaSelectorClass,
    restrictToDropzones: options.restrictToDropzones,
    enableStacking: options.enableStacking,
    stackDirection: options.stackDirection,
    stackSpacing: options.stackSpacing,
    useGhostEffect: options.useGhostEffect,
  });
}

function addNewDraggables(total) {
  for (let i = 0; i < total; i++) {
    const newDiv = document.createElement('div');
    newDiv.className = draggableSelectorClass;
    newDiv.textContent = `Box ${itemCountStartFrom++}`;
    newDiv.style.position = 'relative';
    newDiv.style.left = '';
    newDiv.style.top = '';
    draggableContainer.appendChild(newDiv);
    if (allonshInstance) {
      allonshInstance.addDraggable(newDiv);
    }
  }
}

function refreshAllonsh() {
  if (allonshInstance) {
    allonshInstance.update({
      enableStacking: toggleStackCheckbox.checked,
      stackSpacing: Number(stackSpacingRange.value),
      stackDirection: currentStackDirection,
      restrictToDropzones: restrictDropzoneCheckbox.checked,
      useGhostEffect: ghostEffectCheckbox.checked,
    });
  } else {
    initAllonsh({
      enableStacking: toggleStackCheckbox.checked,
      stackSpacing: Number(stackSpacingRange.value),
      stackDirection: currentStackDirection,
      restrictToDropzones: restrictDropzoneCheckbox.checked,
      useGhostEffect: ghostEffectCheckbox.checked,
    });
  }
}

function updateStackDirectionButtons() {
  if (currentStackDirection === 'vertical') {
    verticalStackBtn.classList.add('selected');
    horizontalStackBtn.classList.remove('selected');
  } else {
    verticalStackBtn.classList.remove('selected');
    horizontalStackBtn.classList.add('selected');
  }
}

function setDefaultsOnLoad() {
  loadTheme();
  toggleStackCheckbox.checked = enableStackingBool;
  stackSpacingRange.value = stackSpacingDefault;
  stackSpacingCurrentValue.textContent = `${stackSpacingDefault} px`;
  restrictDropzoneCheckbox.checked = restrictDropzoneBool;
  ghostEffectCheckbox.checked = ghostEffectBool;
}

addNewDraggables(4);
setDefaultsOnLoad();
refreshAllonsh();
updateStackDirectionButtons();

stackSpacingRange.addEventListener('input', () => {
  stackSpacingDefault = Number(stackSpacingRange.value);
  stackSpacingCurrentValue.textContent = `${stackSpacingDefault} px`;
  refreshAllonsh();
});

toggleStackCheckbox.addEventListener('change', () => {
  enableStackingBool = toggleStackCheckbox.checked;
  refreshAllonsh();
});

ghostEffectCheckbox.addEventListener('change', () => {
  ghostEffectBool = ghostEffectCheckbox.checked;
  refreshAllonsh();
});

addItemBtn.addEventListener('click', () => {
  addNewDraggables(1);
  refreshAllonsh();
});

resetBtn.addEventListener('click', () => {
  emptyDropzones();
  draggableContainer.innerHTML = '';
  itemCountStartFrom = 1;
  enableStackingBool = true;
  restrictDropzoneBool = true;
  ghostEffectBool = true;
  stackSpacingDefault = 10;
  currentStackDirection = 'horizontal';
  setDefaultsOnLoad();
  updateStackDirectionButtons();
  addNewDraggables(4);
  allonshInstance = null;
  refreshAllonsh();
});

verticalStackBtn.addEventListener('click', () => {
  if (currentStackDirection !== 'vertical') {
    currentStackDirection = 'vertical';
    updateStackDirectionButtons();
    refreshAllonsh();
  }
});

horizontalStackBtn.addEventListener('click', () => {
  if (currentStackDirection !== 'horizontal') {
    currentStackDirection = 'horizontal';
    updateStackDirectionButtons();
    refreshAllonsh();
  }
});
restrictDropzoneCheckbox.addEventListener('change', () => {
  restrictDropzoneBool = restrictDropzoneCheckbox.checked;
  if (restrictDropzoneBool) {
    logDraggablesOutsideDropzones();
  }
  refreshAllonsh();
});

function logDraggablesOutsideDropzones() {
  const playAreaElement = document.querySelector(`.${playAreaSelectorClass}`);

  playAreaElement.querySelectorAll('.draggable').forEach((element) => {
    if (
      ![...playAreaElement.querySelectorAll('.dropzone')].some((dropzone) =>
        dropzone.contains(element)
      )
    ) {
      element.style.position = 'relative';
      element.style.left = '';
      element.style.top = '';
      draggableContainer.appendChild(element);
    }
  });
}

openPanelBtn.addEventListener('click', () => {
  togglePanel();
});

closePanelBtn.addEventListener('click', () => {
  togglePanel();
});

function togglePanel() {
  controlPanel.classList.toggle('open');
}

function emptyDropzones() {
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach((dropzone) => {
    while (dropzone.firstChild) {
      dropzone.removeChild(dropzone.firstChild);
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle('night');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('night') ? 'night' : 'day'
  );

  document.body.classList.contains('night')
    ? (document.getElementById('current-theme').src = 'img/sun.svg')
    : (document.getElementById('current-theme').src = 'img/moon.svg');
}

function loadTheme() {
  if (localStorage.getItem('theme') === 'night') {
    document.body.classList.add('night');
    document.getElementById('current-theme').src = 'img/sun.svg';
  } else {
    document.getElementById('current-theme').src = 'img/moon.svg';
  }
}

document
  .getElementById('theme-toggle-button')
  .addEventListener('click', toggleTheme);

new Allonsh({
  draggableSelector: 'freemode-draggable',
  playAreaSelector: 'demo-freemode',
});

freemodeResetBtn.addEventListener('click', () => {
  document.querySelectorAll('.freemode-draggable').forEach((element) => {
    element.removeAttribute('style');
  });
});
