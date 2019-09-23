"use strict";

/////////////////////////////////////////////////////////////// SERVICE WORKER 

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

///////////////////////////////////////////////////////////// GLOBAL VARIABLES 

const hydrappArray = [];
const lastEntryDate = new Date();

let indicators = '';
for (let i = 0; i < 8; i++) {
  indicators += `
  <svg class="indicator__svg indicator__svg--emo-${i+1} indicator__svg--js-${i}">
    <use href="assets/svg/icons.svg#emoticon-${i}"></use>
  </svg>`
}

class Entry {
  constructor(key) {
    this.key = key;
    this.getValue = key;
    this.getTitle = key;
    this.getID = key;

    this.html = `
      <li class="archive__item archive__item--js ${this.key}">
        <p class="archive__date">${this.getTitle}</p>
        <p class="archive__value archive__value--js">
          ${this.getValue}
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
        <div class="indicator indicator--js-${this.getID}">
          ${indicators}
        </div>
      </li>
    `
  }

  get getValue() {
    return this.value;
  }
  set getValue(key) {
    this.value = localStorage.getItem(key);
  }
  get getTitle() {
    return this.title;
  }
  set getTitle(date) {
    this.title = date.replace('hydrApp-','').split('-').reverse().join(' ');
  }
  get getID() {
    return this.ID;
  }
  set getID(date) {
    this.ID = date.replace('hydrApp-','').split('-').reverse().join('');
  }
}

//////////////////////////////////////////////////////////////////// FUNCTIONS 

// F1 //////////////////////////////////////////////// CREATE HYDRAPP DATE KEY 

const setDateKey = (obj) => {
  const prefix = 'hydrApp-';
  const date = obj.toISOString().slice(0,10);
  return prefix.concat(date);
}
// F1 ///////////////////////////////// CREATE KEY VALUE PAIR IN LOCAL STORAGE 

const setNewKeyValue = (key, value) => {
  if ( !localStorage.getItem(key) ) {
    localStorage.setItem(key, value);
  };
}
// F1 ///////////////////////////// CREATE ARRAY OF HYDRAPP LOCAL STORAGE KEYS 

const getHydrappKeys = () => {
  const regex = /hydrApp-/;
  return Object
  .keys(localStorage)
  .filter(key => regex.test(key))
  .sort()
  .reverse();
}
// F1 ////////////////////////////////////////////////////// GET OFFSETED DATE 

const getOffsetedDate = () => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(Date.now() - timeZoneOffset));
}
// F1 //////////////////////////////////////////////////////////// SET COUNTER 

const setLocalStorage = () => {
  const offsetedDate = getOffsetedDate();                           // ! OFFSETED OR NORMAL ???
  let dateKey = setDateKey(offsetedDate);
  const hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length - 1];

  setNewKeyValue(dateKey, 0);
  
  if ( hydrappKeys.length > 2 ) { // autocomplete missing keys in localstorage
    let limit = 0; // for tests to avoid loop error                            // ! TO REFACTOR

    while (setDateKey(offsetedDate) !== oldestKey && limit < 99) {
      offsetedDate.setDate(offsetedDate.getDate() - 1);
      const prevDateKey = setDateKey(offsetedDate);
      setNewKeyValue(prevDateKey, 0);
      limit++;
    }
  }
  counter.innerHTML = localStorage.getItem(dateKey);
}
// F1 ///////////////////////////////////////////////////////// UPDATE COUNTER 

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
}
// F1 //////////////////////////////////////////////////////////// SET ARCHIVE 

const setArchive = () => {
  const hydrappKeys = getHydrappKeys();
  
  if (hydrappKeys.length === 1) {
    archiveList.innerHTML += `
      <li class="archive__item archive__item--empty">No history yet...</li>
      `;

  } else {

    for (let i = 1; i < hydrappKeys.length; i++) {

      const newEntry = new Entry(hydrappKeys[i]);
      archiveList.innerHTML += newEntry.html;
      lastEntryDate.setDate(lastEntryDate.getDate() - 1);
      setIndicators(newEntry.ID, newEntry.value);
      hydrappArray.push(newEntry);
    }
    console.log('hydrappArray', hydrappArray);
  }
}
// F1 ///////////////////////////////////////////////////////// SET INDICATORS 

const setIndicators = (id, value) => {

  value > 7 ? value = 7 : false;

  const indicators = document.querySelector(`.indicator--js-${id}`).children;
  const indicator = document.querySelector(`.indicator--js-${id} .indicator__svg--js-${value}`);
  
  for (const indicator of indicators) {
    indicator.classList.contains('indicator__svg--visible')
    ? indicator.classList.remove('indicator__svg--visible')
    : false;
  }
  indicator.classList.add('indicator__svg--visible');
}
// F1 /////////////////////////////////////////////////////////// SHOW ARCHIVE 
const showArchive = () => {

  // F2 ///////////////////////////////////////////////////// HANDLE ITEM EDIT 

  const handleItemEdit = (e) => {
    const itemIndex = e.target.index;
    const archiveItem = document.querySelectorAll('.archive__item--js')[itemIndex];
    const editSection = document.querySelectorAll('.edition--js')[itemIndex];
    const decreaseButton = document.querySelectorAll('.edition__button--js-decrease')[itemIndex];
    const increaseButton = document.querySelectorAll('.edition__button--js-increase')[itemIndex];
    const cancelButton = document.querySelectorAll('.edition__button--js-cancel')[itemIndex];
    const saveButton = document.querySelectorAll('.edition__button--js-save')[itemIndex];
    const archiveValue = document.querySelectorAll('.archive__value--js')[itemIndex];

    // F3 //////////////////////////// TOGGLE ITEM DISPLAY << HANDLE ITEM EDIT 

    const toggleItemDisplay = () => {
      archive.classList.toggle('archive--on-top');
      archiveItem.classList.toggle('archive__item--on-top');
      pageOverlay.classList.toggle('archive__overlay--visible');
      
      for (const editButton of editSection.children) {
        editButton.classList.toggle('edition__button--visible');
      }
      editSection.classList.toggle('edition--visible');
    }
    // F3 ///////////////////////////////// EXIT EDIT MODE << HANDLE ITEM EDIT 

    const exitEditMode = () => {
      toggleItemDisplay();
      archiveValue.textContent = hydrappArray[itemIndex].value;
      setIndicators(hydrappArray[itemIndex].ID, hydrappArray[itemIndex].value);

      archive.removeEventListener('click', handleEdition);
      archive.removeEventListener('keydown', handleEdition);
    }
    // F3 ///////////////////////////////// HANDLE EDITION << HANDLE ITEM EDIT 

    const handleEdition = (e) => {
      const self = e.keyCode || e.target;
      let value = parseInt(archiveValue.textContent);

      switch (self) {

        case 37:
        case decreaseButton:
          e.preventDefault();
          value > 0 ? value-- : false;
          archiveValue.textContent = value;
          setIndicators(hydrappArray[itemIndex].ID, value);
        break;
        
        case 39:
        case increaseButton:
          e.preventDefault();
          value < counterMaxValue ? value++ : false;
          archiveValue.textContent = value;
          setIndicators(hydrappArray[itemIndex].ID, value);
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
          hydrappArray[itemIndex].value = value;
          localStorage.setItem(hydrappArray[itemIndex].key, value);
          exitEditMode();
        break;
      }
    }
    /////////////////////////////////////// FUNCTION CALLS << HANDLE ITEM EDIT 

    toggleItemDisplay();
    archive.addEventListener('click', handleEdition);
    archive.addEventListener('keydown', handleEdition);

  } // F2 //////////////////////////////////////////// END OF HANDLE ITEM EDIT 
  
  // F2 //////////////////////////////////////////// LOAD MORE << SHOW ARCHIVE 
  const loadMoreItems = () => {
    
    const archiveItems = document.querySelectorAll('.archive__item--js');
    const itemArray = [...archiveItems];
    const archiveListHeight = archiveList.clientHeight;

    let firstIndexToLoad = itemArray.findIndex(elem => !elem.classList.contains('archive__item--visible'));
    let heights = 0;
    let scrollOffset = archiveList.scrollTop;

    while (true) {
      
      if (firstIndexToLoad < itemArray.length && firstIndexToLoad >= 0) {
        const item = itemArray[firstIndexToLoad];
        item.classList.add('archive__item--visible');
        heights += item.offsetHeight;
        scrollOffset += item.offsetHeight;
        
        if (heights <= archiveListHeight - item.offsetHeight) {
          firstIndexToLoad++;
        } else {
          archiveList.scrollTop = scrollOffset;
          archiveList.style.height = heights + 'px';
          return false;
        }

      } else {
        archiveList.scrollTop = scrollOffset;
        loadMoreButton.classList.add('archive__button--hidden');
        loadMoreButton.removeEventListener('click', loadMoreItems);
        return false;
      }
    }
  }

  // F2 ///////////////////////////////////////// ADD NEW ITEM << SHOW ARCHIVE 

  const addNewItem = () => {

    const newEntryKey = setDateKey(lastEntryDate);
    setNewKeyValue(newEntryKey, 0);
    const newEntry = new Entry(newEntryKey);
    hydrappArray.push(newEntry);
    const currentIndex = hydrappArray.length - 1;
    lastEntryDate.setDate(lastEntryDate.getDate() - 1);
    archiveList.insertAdjacentHTML('beforeend', hydrappArray[currentIndex].html);
    setIndicators(hydrappArray[currentIndex].ID, hydrappArray[currentIndex].value);
    
    for (const item of archiveList.children) {
      item.classList.add('archive__item--visible');
    }

    editButtons = document.querySelectorAll('.edition__button--js-edit');
    const newEditButton = editButtons[currentIndex];
    newEditButton.index = currentIndex;
    newEditButton.addEventListener('click', handleItemEdit);
  }
  // F2 //////////////////////////////////////// CLOSE ARCHIVE << SHOW ARCHIVE 

  const closeArchive = () => {
    archive.classList.remove('archive--visible');
    loadMoreButton.classList.remove('archive__button--hidden');

    const archiveItems = document.querySelectorAll('.archive__item--js');
    for (const archiveItem of archiveItems) {
      archiveItem.classList.remove('archive__item--visible');
    }

    addNewButton.removeEventListener('click', addNewItem);
    loadMoreButton.removeEventListener('click', loadMoreItems);
    archiveButton.removeEventListener('click', closeArchive);

    for (const editButton of editButtons) {
      editButton.removeEventListener('click', handleItemEdit);
    }

    archiveButton.addEventListener('click', showArchive);
  }
  ////////////////////////////////////////////////// VARIABLES << SHOW ARCHIVE 

  let editButtons = document.querySelectorAll('.edition__button--js-edit');

  ///////////////////////////////////////////// FUNCTION CALLS << SHOW ARCHIVE 

  archive.classList.add('archive--visible');
  loadMoreItems();

  //////////////////////////////////////////// EVENT LISTENERS << SHOW ARCHIVE 

  archiveButton.removeEventListener('click', showArchive);
  archiveButton.addEventListener('click', closeArchive);
  loadMoreButton.addEventListener('click', loadMoreItems);
  addNewButton.addEventListener('click', addNewItem);

  for (let i = 0; i < editButtons.length; i++) {
    const editButton = editButtons[i];
    editButton.index = i;
    editButton.addEventListener('click', handleItemEdit);
  }
}
// F1 //////////////////////////////////////////////////// END OF SHOW ARCHIVE 

//////////////////////////////////////////////////////////////////// VARIABLES 

const addGlass = document.querySelector('.app__button--js-add');
const removeGlass = document.querySelector('.app__button--js-remove');
const counter = document.querySelector('.glass__counter--js');
const counterMaxValue = 99;

const archive = document.querySelector('.archive--js');
const pageOverlay = document.querySelector('.archive__overlay--js');
const archiveList = document.querySelector('.archive__list--js');
const archiveButton = document.querySelector('.navigation__button--js-archive');
const loadMoreButton = document.querySelector('.archive__button--js-load-more');
const addNewButton = document.querySelector('.archive__button--add-new');

const statsButton = document.querySelector('.navigation__button--js-stats');

/////////////////////////////////////////////////////////////// FUNCTION CALLS 

setLocalStorage();
setArchive();

////////////////////////////////////////////////////////////// EVENT LISTENERS 

addGlass.addEventListener('click', updateCounter);                                // ! to merge
removeGlass.addEventListener('click', updateCounter);                             // ! to merge
archiveButton.addEventListener('click', showArchive);