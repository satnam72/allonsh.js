import Allonsh from '../../src/Allonsh.js';

const bodyElements = {
  openPanelBtn: document.getElementById('openPanelBtn'),
  closePanelBtn: document.getElementById('closePanelBtn'),

  controlPanel: document.getElementById('controlPanel'),

  toggleStackCheckbox: document.getElementById('stackCheckbox'),
  ghostEffectCheckbox: document.getElementById('ghostEffectCheckbox'),

  stackSpacingRange: document.getElementById('stackSpacingSlider'),
  stackSpacingCurrentValue: document.getElementById('spacingValue'),

  addItemBtn: document.getElementById('addItemBtn'),
  resetBtn: document.getElementById('reset-btn'),
  freemodeResetBtn: document.getElementById('reset-btn-freemode'),

  verticalStackBtn: document.getElementById('verticalStackingBtn'),
  horizontalStackBtn: document.getElementById('horizontalStackingBtn'),

  draggableContainer: document.querySelector('.demo-playground__draggables'),

  restrictDropzoneCheckbox: document.getElementById('restrictDropzoneCheckbox'),
};

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
    bodyElements.draggableContainer.appendChild(newDiv);
    if (allonshInstance) {
      allonshInstance.addDraggable(newDiv);
    }
  }
}

function refreshAllonsh() {
  if (allonshInstance) {
    allonshInstance.update({
      enableStacking: bodyElements.toggleStackCheckbox.checked,
      stackSpacing: Number(bodyElements.stackSpacingRange.value),
      stackDirection: currentStackDirection,
      restrictToDropzones: bodyElements.restrictDropzoneCheckbox.checked,
      useGhostEffect: bodyElements.ghostEffectCheckbox.checked,
    });
  } else {
    initAllonsh({
      enableStacking: bodyElements.toggleStackCheckbox.checked,
      stackSpacing: Number(bodyElements.stackSpacingRange.value),
      stackDirection: currentStackDirection,
      restrictToDropzones: bodyElements.restrictDropzoneCheckbox.checked,
      useGhostEffect: bodyElements.ghostEffectCheckbox.checked,
    });
  }
}

function updateStackDirectionButtons() {
  if (currentStackDirection === 'vertical') {
    bodyElements.verticalStackBtn.classList.add('selected');
    bodyElements.horizontalStackBtn.classList.remove('selected');
  } else {
    bodyElements.verticalStackBtn.classList.remove('selected');
    bodyElements.horizontalStackBtn.classList.add('selected');
  }
}

function setDefaultsOnLoad() {
  loadTheme();
  bodyElements.toggleStackCheckbox.checked = enableStackingBool;
  bodyElements.stackSpacingRange.value = stackSpacingDefault;
  bodyElements.stackSpacingCurrentValue.textContent = `${stackSpacingDefault} px`;
  bodyElements.restrictDropzoneCheckbox.checked = restrictDropzoneBool;
  bodyElements.ghostEffectCheckbox.checked = ghostEffectBool;
}

addNewDraggables(4);
setDefaultsOnLoad();
refreshAllonsh();
updateStackDirectionButtons();

bodyElements.stackSpacingRange.addEventListener('input', () => {
  stackSpacingDefault = Number(bodyElements.stackSpacingRange.value);
  bodyElements.stackSpacingCurrentValue.textContent = `${stackSpacingDefault} px`;
  refreshAllonsh();
});

bodyElements.toggleStackCheckbox.addEventListener('change', () => {
  enableStackingBool = bodyElements.toggleStackCheckbox.checked;
  refreshAllonsh();
});

bodyElements.ghostEffectCheckbox.addEventListener('change', () => {
  ghostEffectBool = ghostEffectCheckbox.checked;
  refreshAllonsh();
});

bodyElements.addItemBtn.addEventListener('click', () => {
  addNewDraggables(1);
  refreshAllonsh();
});

bodyElements.resetBtn.addEventListener('click', () => {
  emptyDropzones();
  bodyElements.draggableContainer.innerHTML = '';
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

bodyElements.verticalStackBtn.addEventListener('click', () => {
  if (currentStackDirection !== 'vertical') {
    currentStackDirection = 'vertical';
    updateStackDirectionButtons();
    refreshAllonsh();
  }
});

bodyElements.horizontalStackBtn.addEventListener('click', () => {
  if (currentStackDirection !== 'horizontal') {
    currentStackDirection = 'horizontal';
    updateStackDirectionButtons();
    refreshAllonsh();
  }
});
bodyElements.restrictDropzoneCheckbox.addEventListener('change', () => {
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
      bodyElements.draggableContainer.appendChild(element);
    }
  });
}

bodyElements.openPanelBtn.addEventListener('click', () => {
  togglePanel();
});

bodyElements.closePanelBtn.addEventListener('click', () => {
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

bodyElements.freemodeResetBtn.addEventListener('click', () => {
  document.querySelectorAll('.freemode-draggable').forEach((element) => {
    element.removeAttribute('style');
  });
});
