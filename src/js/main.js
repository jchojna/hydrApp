"use strict";

//////////////////////////////////////////////////////////////// SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
      // Registration was successful
      //console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
///////////////////////////////////////////////////////////////////// FUNCTIONS
/////////////////////////////////////////////////////// CREATE HYDRAPP DATE KEY
const setDateKey = (obj) => {
  const prefix = 'hydrApp-';
  const date = obj.toISOString().slice(0,10);
  return prefix.concat(date);
}
//////////////////////////////////////// CREATE KEY VALUE PAIR IN LOCAL STORAGE
const setNewKeyValue = (key, value) => {
  if ( !localStorage.getItem(key) ) {
    localStorage.setItem(key, value);
  };
}
//////////////////////////////////// CREATE ARRAY OF HYDRAPP LOCAL STORAGE KEYS
const getHydrappKeys = () => {
  const regex = /hydrApp-/;
  return Object
  .keys(localStorage)
  .filter(key => regex.test(key))
  .sort()
  .reverse();
}
/////////////////////////////////////////////////////////////////// GET DATE ID
const getDateID = (date) => {
  return date
    .replace('hydrApp-','')
    .split('-')
    .reverse()
    .join('');
}
///////////////////////////////////////////////////////////// GET OFFSETED DATE
const getOffsetedDate = () => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(Date.now() - timeZoneOffset));
}
/////////////////////////////////////////////////////////////////// SET COUNTER
const setCounter = () => {
  const offsetedDate = getOffsetedDate();
  let dateKey = setDateKey(offsetedDate);
  console.log(`newest key: ${dateKey}`);

  setNewKeyValue(dateKey, 0);

  const hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length-1];
  console.log(`oldest key: ${oldestKey}`);

  // autocomplete missing keys in localstorage
  if ( hydrappKeys.length > 1 ) {
    let limit = 0; // for tests to avoid loop error

    while (setDateKey(offsetedDate) !== oldestKey && limit < 50) {
      offsetedDate.setDate( offsetedDate.getDate() - 1 );
      const prevDateKey = setDateKey(offsetedDate);
      setNewKeyValue(prevDateKey, 0);
      limit++;
    }
  }
  counter.innerHTML = localStorage.getItem(dateKey);
}
/////////////////////////////////////////////////////////////////// SET ARCHIVE
const setArchive = () => {
  const hydrappKeys = getHydrappKeys();

  if (hydrappKeys.length === 1) {
    archiveList.innerHTML += `
      <li class="archive__item archive__item--empty">No history yet...</li>
      `;
  } else {
    for (let i = 1; i < hydrappKeys.length; i++) {
      const key = hydrappKeys[i];
      const value = localStorage.getItem(key);
      const date = key
        .replace('hydrApp-','')
        .split('-')
        .reverse()
        .join(' ');
      const dateID = date.replace(/\s/g,'');
      
      let indicators = "";
      for (let i = 0; i < 8; i++) {
        indicators += `
        <svg class="indicator__svg indicator__svg--emo-${i+1} indicator__svg--js-${i}">
          <use href="assets/svg/icons.svg#emoticon-${i}"></use>
        </svg>`
      }

      archiveList.innerHTML += `
      <li class="archive__item archive__item--js ${key}">
        <p class="archive__date">${date}</p>
        <p class="archive__value archive__value--js">
          ${value}
        </p>
        <div class="edition edition--js">
          <button class="button edition__button edition__button--visible edition__button--edit edition__button--js-edit">
            <svg class="edition__svg edition__svg--edit">
              <use href="assets/svg/icons.svg#edit-mode"></use>
            </svg>
          </button>
          <button class="button edition__button edition__button--decrease edition__button--js-decrease">
            <svg class="edition__svg edition__svg--decrease">
              <use href="assets/svg/icons.svg#left-arrow"></use>
            </svg>
          </button>
          <button class="button edition__button edition__button--increase edition__button--js-increase">
            <svg class="edition__svg edition__svg--increase">
              <use href="assets/svg/icons.svg#right-arrow"></use>
            </svg>
          </button>
          <button class="button edition__button edition__button--cancel edition__button--js-cancel">
            <svg class="edition__svg edition__svg--cancel">
              <use href="assets/svg/icons.svg#back-arrow"></use>
            </svg>
          </button>
          <button class="button edition__button edition__button--save edition__button--js-save">
            <svg class="edition__svg edition__svg--save">
              <use href="assets/svg/icons.svg#save-icon"></use>
            </svg>
          </button>
        </div>
        <div class="indicator indicator--js-${dateID}">
          ${indicators}
        </div>
      </li>`
      setIndicators(dateID, value);
    }
  }
}
//////////////////////////////////////////////////////////////// SET INDICATORS
const setIndicators = (id, value) => {

  value > 7 ? value = 7 : false;

  const indicators = document.querySelector(`.indicator--js-${id}`).children;
  const indicator = document.querySelector(`.indicator--js-${id} .indicator__svg--js-${value}`);
  
  for (const indicator of indicators) {
    indicator.classList.contains('indicator__svg--visible')
    ? indicator.classList.remove('indicator__svg--visible')
    : false
  }
  indicator.classList.add('indicator__svg--visible');
}
//////////////////////////////////////////////////////////////// UPDATE COUNTER
const updateCounter = (e) => {
  const offsetedDate = getOffsetedDate();
  const key = setDateKey(offsetedDate);
  const value = parseInt(localStorage.getItem(key));
  let newValue;

  if (e.target === addGlass) {
    value < counterMaxValue ? newValue = value + 1 : newValue = counterMaxValue;
  } else if (e.target === removeGlass) {
    value > 0 ? newValue = value - 1 : newValue = 0;
  }

  localStorage.setItem(key, newValue);
  counter.innerHTML = newValue;
  
  // updating archive newest entry indicator
  const dateID = offsetedDate
    .toISOString()
    .slice(0,10)
    .split('-')
    .reverse()
    .join('');
}
//////////////////////////////////////////////////////////////// TOGGLE ARCHIVE
const toggleArchive = () => {
  archive.classList.toggle('archive--visible');
}
////////////////////////////////////////////////////////////// HANDLE ITEM EDIT
const handleItemEdit = (e) => {
  const itemIndex = e.target.index;
  const archiveItem = archiveItems[itemIndex];
  const editButton = editButtons[itemIndex];
  const editSection = editSections[itemIndex];
  const decreaseButton = decreaseButtons[itemIndex];
  const increaseButton = increaseButtons[itemIndex];
  const cancelButton = cancelButtons[itemIndex];
  const saveButton = saveButtons[itemIndex];
  const archiveValue = archiveValues[itemIndex];
  const lastValue = archiveValue.textContent;
  const itemClassName = e.target.parentElement.parentElement.className;

  const hydrAppKey = itemClassName
    .split(' ')
    .filter(key => /hydrApp/.test(key))
    .toString();
  const dateID = getDateID(hydrAppKey);
  ///////////////////////////////////// TOGGLE ITEM DISPLAY << HANDLE ITEM EDIT
  const toggleItemDisplay = () => {
    archive.classList.toggle('archive--on-top');
    archiveItem.classList.toggle('archive__item--on-top');
    pageOverlay.classList.toggle('archive__overlay--visible');
    
    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
  }
  ////////////////////////////////////////// EXIT EDIT MODE << HANDLE ITEM EDIT
  const exitEditMode = () => {
    toggleItemDisplay();
    const lastValue = localStorage.getItem(hydrAppKey);
    archiveValue.textContent = lastValue;
    setIndicators(dateID, lastValue);

    archive.removeEventListener('click', handleEdition);
    archive.removeEventListener('keydown', handleEdition);
  }
  ////////////////////////////////////////// HANDLE EDITION << HANDLE ITEM EDIT
  const handleEdition = (e) => {
    const self = e.keyCode || e.target;
    let value = parseInt(archiveValue.textContent);

    switch (self) {

      case 37:
      case decreaseButton:
        e.preventDefault();
        value > 0 ? value-- : false;
        archiveValue.textContent = value;
        setIndicators(dateID, value);
      break;
      
      case 39:
      case increaseButton:
        e.preventDefault();
        value < counterMaxValue ? value++ : false;
        archiveValue.textContent = value;
        setIndicators(dateID, value);
      break;

      case 27:
      case pageOverlay:
      case cancelButton:
        e.preventDefault();
        exitEditMode();
      break;

      case 13:
      case saveButton:
        e.preventDefault();
        localStorage.setItem(hydrAppKey, parseInt(archiveValue.textContent));
        exitEditMode();
      break;
    }
  }
  ////////////////////////////////////////// FUNCTION CALLS << HANDLE ITEM EDIT
  toggleItemDisplay();
  archive.addEventListener('click', handleEdition);
  archive.addEventListener('keydown', handleEdition);
} ///////////////////////////////////////////////////// END OF HANDLE ITEM EDIT

///////////////////////////////////////////////////////////////////// VARIABLES
const addGlass = document.querySelector('.app__button--js-add');
const removeGlass = document.querySelector('.app__button--js-remove');
const counter = document.querySelector('.glass__counter--js');
const archive = document.querySelector('.archive--js');
const pageOverlay = document.querySelector('.archive__overlay--js');
const archiveList = document.querySelector('.archive__list--js');
const archiveButton = document.querySelector('.navigation__button--js-archive');

const counterMaxValue = 100;

const baseClassname = "indicator__section indicator__section--js";
const lowLevelClassname = `${baseClassname} indicator__section--low`;
const mediumLevelClassname = `${baseClassname} indicator__section--medium`;
const highLevelClassname = `${baseClassname} indicator__section--high`;
//////////////////////////////////////////////////////// INITIAL FUNCTION CALLS
setCounter();
setArchive();
///////////////////////////////////////////////////////////////////// VARIABLES
const archiveItems = document.querySelectorAll('.archive__item--js');
const editButtons = document.querySelectorAll('.edition__button--js-edit');
const editSections = document.querySelectorAll('.edition--js');
const decreaseButtons = document.querySelectorAll('.edition__button--js-decrease');
const increaseButtons = document.querySelectorAll('.edition__button--js-increase');
const cancelButtons = document.querySelectorAll('.edition__button--js-cancel');
const saveButtons = document.querySelectorAll('.edition__button--js-save');
const archiveValues = document.querySelectorAll('.archive__value--js');
//////////////////////////////////////////////////////////////// FUNCTION CALLS
/////////////////////////////////////////////////////////////// EVENT LISTENERS
addGlass.addEventListener('click', updateCounter);
removeGlass.addEventListener('click', updateCounter);
archiveButton.addEventListener('click', toggleArchive);

for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];
  editButton.index = i;
  editButton.addEventListener('click', handleItemEdit);
}