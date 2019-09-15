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

///////////////////////////////////////////////////////////////////// VARIABLES
const pageOverlay = document.querySelector('.page-overlay--js');
const addGlass = document.querySelector('.app__button--js-add');
const removeGlass = document.querySelector('.app__button--js-remove');
const counter = document.querySelector('.glass__counter--js');
const archive = document.querySelector('.archive--js');
const archiveList = document.querySelector('.archive__list--js');
const archiveButton = document.querySelector('.app__button--js-archive');

const counterMaxValue = 100;

const baseClassname = "indicator__section indicator__section--js";
const lowLevelClassname = `${baseClassname} indicator__section--low`;
const mediumLevelClassname = `${baseClassname} indicator__section--medium`;
const highLevelClassname = `${baseClassname} indicator__section--high`;

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
      
      archiveList.innerHTML += `
      <li class="archive__item archive__item--js ${key}">
        <p class="archive__date">${date}</p>
        <p class="archive__value archive__value--js">
          ${value}
        </p>
        <div class="edition">
          <button class="button edition__edit edition__edit--js">
            <svg class="edition__svg edition__svg--edit">
              <use href="assets/svg/icons.svg#edit-mode"></use>
            </svg>
          </button>
          <div class="edition__group edition__group--js">
            <button class="button edition__decrease edition__decrease--js">
              <svg class="edition__svg edition__svg--decrease">
                <use href="assets/svg/icons.svg#left-arrow"></use>
              </svg>
            </button>
            <button class="button edition__increase edition__increase--js">
              <svg class="edition__svg edition__svg--increase">
                <use href="assets/svg/icons.svg#right-arrow"></use>
              </svg>
            </button>
            <button class="button edition__cancel edition__cancel--js">
              <svg class="edition__svg edition__svg--cancel">
                <use href="assets/svg/icons.svg#back-arrow"></use>
              </svg>
            </button>
            <button class="button edition__save edition__save--js">
              <svg class="edition__svg edition__svg--save">
                <use href="assets/svg/icons.svg#save-icon"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="indicator indicator--js-${dateID}">
          <div class="${baseClassname}"></div>
          <div class="${baseClassname}"></div>
          <div class="${baseClassname}"></div>
        </div>
      </li>
      `;
      setIndicators(dateID, value);
    }
  }
}
//////////////////////////////////////////////////////////////// SET INDICATORS
const setIndicators = (id, value) => {
  const indicators = document.querySelectorAll(`.indicator--js-${id} .indicator__section--js`);

  if (value >= 6) {
    for (const indicator of indicators) {
      indicator.className = highLevelClassname;
    }
  } else if (value >= 3) {
    indicators[0].className = mediumLevelClassname;
    indicators[1].className = mediumLevelClassname;
    indicators[2].className = baseClassname;
  } else {
    indicators[0].className = lowLevelClassname;
    indicators[1].className = baseClassname;
    indicators[2].className = baseClassname;
  }
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
  setIndicators(dateID, newValue);
}
//////////////////////////////////////////////////////////////// TOGGLE ARCHIVE
const toggleArchive = (e) => {
  const listHeight = archiveList.clientHeight;

  if (archive.classList.contains('archive--visible')) {
    archive.classList.remove('archive--visible');
    archive.style.height = 0;
    e.target.textContent = "Show archive";
  } else {
    archive.classList.add('archive--visible');
    archive.style.height = listHeight + "px";
    e.target.textContent = "Hide archive";
  }
}
////////////////////////////////////////////////////////////// HANDLE ITEM EDIT
const handleItemEdit = (e) => {
  const itemIndex = e.target.index;
  const archiveItem = archiveItems[itemIndex];
  const editButton = editButtons[itemIndex];
  const editGroup = editGroups[itemIndex];
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
    archiveItem.classList.toggle('archive__item--on-top');
    editButton.classList.toggle('edition__edit--hidden');
    editGroup.classList.toggle('edition__group--visible');
    pageOverlay.classList.toggle('page-overlay--visible');
  }
  ////////////////////////////////////////// EXIT EDIT MODE << HANDLE ITEM EDIT
  const exitEditMode = () => {
    toggleItemDisplay();
    const lastValue = localStorage.getItem(hydrAppKey);
    archiveValue.textContent = lastValue;
    setIndicators(dateID, lastValue);
    // removing all event listeners
    cancelButton.removeEventListener('click', exitEditMode);
    pageOverlay.removeEventListener('click', exitEditMode);
    decreaseButton.removeEventListener('click', updateValue);
    increaseButton.removeEventListener('click', updateValue);
    saveButton.removeEventListener('click', saveValue)
  }
  //////////////////////////////////////////// UPDATE VALUE << HANDLE ITEM EDIT
  const updateValue = (e) => {   // ZOPTYMALIZOWAC Z UPDATE COUNTER
    let value = archiveValue.textContent;
    if (e.target === decreaseButton) {
      value > 0 ? value-- : false;
    } else {
      value < counterMaxValue ? value++ : false;
    }
    archiveValue.textContent = value;
    setIndicators(dateID, value);
  }
  ////////////////////////////////////////////// SAVE VALUE << HANDLE ITEM EDIT
  const saveValue = () => {
    localStorage.setItem(hydrAppKey, archiveValue.textContent);
    exitEditMode();
  }
  ////////////////////////////////////////// FUNCTION CALLS << HANDLE ITEM EDIT
  toggleItemDisplay();
  cancelButton.addEventListener('click', exitEditMode);
  pageOverlay.addEventListener('click', exitEditMode);
  decreaseButton.addEventListener('click', updateValue);
  increaseButton.addEventListener('click', updateValue);
  saveButton.addEventListener('click', saveValue);
} ///////////////////////////////////////////////////// END OF HANDLE ITEM EDIT
//////////////////////////////////////////////////////////////// FUNCTION CALLS
setCounter();
setArchive();
///////////////////////////////////////////////////////////////////// VARIABLES
const archiveItems = document.querySelectorAll('.archive__item--js');
const editButtons = document.querySelectorAll('.edition__edit--js');
const editGroups = document.querySelectorAll('.edition__group--js');
const decreaseButtons = document.querySelectorAll('.edition__decrease--js');
const increaseButtons = document.querySelectorAll('.edition__increase--js');
const cancelButtons = document.querySelectorAll('.edition__cancel--js');
const saveButtons = document.querySelectorAll('.edition__save--js');
const archiveValues = document.querySelectorAll('.archive__value--js');
/////////////////////////////////////////////////////////////// EVENT LISTENERS
addGlass.addEventListener('click', updateCounter);
removeGlass.addEventListener('click', updateCounter);
archiveButton.addEventListener('click', toggleArchive);
for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];
  editButton.index = i;
  editButton.addEventListener('click', handleItemEdit);
}