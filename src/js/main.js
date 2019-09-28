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
    this.itemHeight = 0;
    this.totalHeight = 0;

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
  /* get totalHeight() {
    return this._totalHeight;
  }
  set totalHeight(amount) {
    this._totalHeight = amount * this.itemHeight;
  } */
}

//////////////////////////////////////////////////////////////////// FUNCTIONS 

// F0 //////////////////////////////////////////////// CREATE HYDRAPP DATE KEY 

const setDateKey = (obj) => {

  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  let dateObj = obj || new Date();
  dateObj = (new Date(dateObj - timeZoneOffset));

  const prefix = 'hydrApp-';
  const dateStr = dateObj.toISOString().slice(0,10);
  return prefix.concat(dateStr);
}
// F0 ///////////////////////////// CREATE ARRAY OF HYDRAPP LOCAL STORAGE KEYS 

const getHydrappKeys = () => {
  const regex = /hydrApp-/;
  return Object
  .keys(localStorage)
  .filter(key => regex.test(key))
  .sort()
  .reverse();
}
// F0 ///////////////////////////////// CREATE KEY VALUE PAIR IN LOCAL STORAGE 

const setNewKeyValue = (key, value) => {
  if ( !localStorage.getItem(key) ) {
    localStorage.setItem(key, value);
  };
}
// F0 ///////////////////////////////////////////////////////// SET INDICATORS 

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
// F0 //////////////////////////////////////////// CREATE 'REMOVE ITEM' BUTTON 

const createRemoveItemButton = () => {

  const removeItemButton = document.createElement('button');
  removeItemButton.className = 'button remove-button remove-button--visible remove-button--js';
  removeItemButton.innerHTML = `
  <svg class="remove-button__svg">
    <use href="assets/svg/icons.svg#remove-icon"></use>
  </svg>
  `
  removeItemButton.addEventListener('click', removeLastItem);

  return removeItemButton;
}
// F2 ////////////////////////////////////////////////////// SET LOCAL STORAGE 

const handleLocalStorage = () => {

  const date = new Date();
  let dateKey = setDateKey(date);
  setNewKeyValue(dateKey, 0);
  let hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length - 1];
  
  // create object for each key
  const createEntryObject = (date) => {
    const dateKey = setDateKey(date);
    const newEntry = new Entry(dateKey);
    hydrappArray.push(newEntry);
  }
  
  // first object of array
  createEntryObject(date);

  // autocomplete the rest of keys if needed
  while (dateKey !== oldestKey) {
    dateKey = setDateKey(date.setDate(date.getDate() - 1));
    setNewKeyValue(dateKey, 0);
    createEntryObject(date);
  }

  //counter.innerHTML = localStorage.getItem(dateKey);
  updateCounter('displayValue');
  
  console.log(hydrappArray);
}
// F1 ///////////////////////////////////////////////////////// UPDATE COUNTER 

const updateCounter = (e) => {
  const self = e.target || e;
  const key = setDateKey();
  let value = parseInt(localStorage.getItem(key));

  switch (self) {
    case 'displayValue':
      counter.innerHTML = value;
      break;
    
    case addGlass:
      value < counterMaxValue ? value++ : value = counterMaxValue;
      localStorage.setItem(key, value);
      hydrappArray[0].value = value;
      counter.innerHTML = value;
      break;

    case removeGlass:
      value > 0 ? value-- : value = 0;
      localStorage.setItem(key, value);
      hydrappArray[0].value = value;
      counter.innerHTML = value;
      break;
  }
  console.log(hydrappArray);
}
// F1 //////////////////////////////////////////////////////////// SET ARCHIVE 

const setArchive = () => {
  const hydrappKeys = getHydrappKeys();
  const emptyArchive = `
  <li class="archive__item archive__item--empty">No history yet...</li>
  `;
  archiveList.innerHTML += emptyArchive;

  if (hydrappKeys.length) {

    for (let i = 0; i < hydrappKeys.length; i++) {

      const newEntry = new Entry(hydrappKeys[i], 0);
      archiveList.innerHTML += newEntry.html;
      lastEntryDate.setDate(lastEntryDate.getDate() - 1);
      setIndicators(newEntry.ID, newEntry.value);
      hydrappArray.push(newEntry);
    }
  }
}
// F1 /////////////////////////////////////////////////////////// SHOW ARCHIVE 

const showArchive = () => {

  archiveItems = document.querySelectorAll('.archive__item--js');

  if (archive.classList.contains('archive--visible')) {
    archive.classList.remove('archive--visible')
    //window.removeEventListener('keydown', enterNewEntryValue);
    window.removeEventListener('keydown', removeLastItem);

  } else {

    for (const item of archiveItems) {
      item.classList.contains('archive__item--visible')
      ? item.classList.remove('archive__item--visible')
      : false;
    }
    loadMoreItems();
    archive.classList.add('archive--visible');
    //window.addEventListener('keydown', enterNewEntryValue);
    window.addEventListener('keydown', removeLastItem);
  }
}
// F1 /////////////////////////////////////////////// ADJUST LAST ITEM OF LIST 

const handleArchiveLastItem = () => {

  const lastItem = archiveList.lastElementChild;
  const lastItemValueNode = lastItem.querySelector('.archive__value--js');

  if (!removeItemButton) {
    removeItemButton = createRemoveItemButton();
  }    

  const previousItem = archiveList.lastElementChild.previousElementSibling;
  const previousRemoveButton = previousItem.querySelector('.remove-button--js');
  const lastRemoveButton = lastItem.querySelector('.remove-button--js');

  if (previousRemoveButton) {
    previousItem.classList.remove('archive__item--removable');
    previousItem.removeChild(previousRemoveButton);
  }

  if (!lastRemoveButton) {

    lastItem.classList.add('archive__item--removable');
    lastItem.insertBefore(removeItemButton, lastItemValueNode);
  }
}
// F1 ////////////////////////////////////////////// LOAD MORE << SHOW ARCHIVE 

let archiveScroll = 0;

const loadMoreItems = () => {

  archiveItems = document.querySelectorAll('.archive__item--js');
  const archiveListHeight = archiveList.clientHeight;
  let viewportHeight = 0;

  // show 'no history...' message
  if (hydrappArray.length === 1) {
    archiveList.firstElementChild.classList.add('archive__item--visible');

  // show archive entries
  } else if (hydrappArray.length > 1) {

    // loop
    for (let i = 1; i < archiveItems.length; i++) {

      const item = archiveItems[i];

      if (!item.classList.contains('archive__item--visible')) {

        item.classList.add('archive__item--visible');
        viewportHeight += item.offsetHeight;
        
        // items exceed screen
        if (viewportHeight > archiveListHeight - item.offsetHeight) {

          archiveList.style.height = viewportHeight + 'px';
          loadMoreButton.classList.add('archive__button--visible');

          while (i < archiveItems.length) {
            hydrappArray[i].itemHeight = item.offsetHeight;
            hydrappArray[i].totalHeight = hydrappArray.reduce((prev, {itemHeight}) => prev + itemHeight, 0);
            i++;
          }
          break;
        }
        
      } else {
        loadMoreButton.classList.remove('archive__button--visible');
      }
      hydrappArray[i].itemHeight = item.offsetHeight;
      hydrappArray[i].totalHeight = hydrappArray.reduce((prev, {itemHeight}) => prev + itemHeight, 0);
    }
    // end of loop

    archiveList.scrollTop = archiveScroll;
    archiveScroll += viewportHeight;

    handleArchiveLastItem();
  }
}
// F1 ////////////////////////////////////////// ARCHIVE MODAL << SHOW ARCHIVE 

const enterNewEntryValue = () => {

  let value = 0;
  newEntryModal.classList.add('new-entry--visible');
  newEntryValue.textContent = value;


  const handleValue = (e) => {

    const self = e.target;

    switch (self) {

      case newEntryDecrease:
        value !== 0 ? value-- : false;
        newEntryValue.textContent = value;
        break;
        
      case newEntryIncrease:
        value !== counterMaxValue ? value++ : false;
        newEntryValue.textContent = value;
        break;

      case newEntryCancel:
        newEntryModal.classList.remove('new-entry--visible');
        newEntryModal.removeEventListener('click', handleValue);
        break;

      case newEntrySave:
        addNewItem(e, value);
        newEntryModal.classList.remove('new-entry--visible');
        newEntryModal.removeEventListener('click', handleValue);
        break;
    }
  }

  newEntryModal.addEventListener('click', handleValue);
}
// F1 /////////////////////////////////////////// ADD NEW ITEM << SHOW ARCHIVE 

const addNewItem = (e, value) => {

  const self = /* e.keyCode || */ e.target;

  if (self === 65 || self === newEntrySave) {
    
    const newEntryKey = setDateKey(getOffsetedDateOf(lastEntryDate));
    const archiveListHeight = archiveList.clientHeight;
    let viewportHeight = 0;
    
    const newEntry = new Entry(newEntryKey);
    hydrappArray.push(newEntry);
    lastEntryDate.setDate(lastEntryDate.getDate() - 1);
    const currentIndex = hydrappArray.length - 1;
    archiveList.insertAdjacentHTML('beforeend', hydrappArray[currentIndex].html);
    const archiveValue = document.querySelectorAll('.archive__value--js')[currentIndex];
    setNewKeyValue(newEntryKey, value);
    hydrappArray[currentIndex].value = value;
    archiveValue.textContent = hydrappArray[currentIndex].value;
    setIndicators(hydrappArray[currentIndex].ID, hydrappArray[currentIndex].value);

    handleArchiveLastItem();
    
    // loop
    for (let i = 2; i < archiveList.children.length; i++) {
      const item = archiveList.children[i];
      if (!item.classList.contains('archive__item--visible')) {
        item.classList.add('archive__item--visible');
        hydrappArray[i-1].totalHeight = hydrappArray.reduce((prev, {itemHeight}) => prev + itemHeight, 0);
        archiveScroll += item.offsetHeight;
      }

      if (viewportHeight <= archiveListHeight - item.offsetHeight) {
        viewportHeight += item.offsetHeight;
        archiveScroll += item.offsetHeight;
      } else {
        archiveList.style.height = viewportHeight + 'px';
      }
    }
    // end of loop
    
    if (loadMoreButton.classList.contains('archive__button--visible')) {
      loadMoreButton.classList.remove('archive__button--visible');
    }
  
    if (currentIndex === 1) {
      archiveList.firstElementChild.classList.remove('archive__item--visible');
    } 
  
    hydrappArray[currentIndex].itemHeight = archiveList.lastElementChild.offsetHeight;
    hydrappArray[currentIndex].totalHeight = hydrappArray.reduce((prev, {itemHeight}) => prev + itemHeight, 0);
  
    if (hydrappArray[currentIndex].totalHeight > archiveList.clientHeight - hydrappArray[currentIndex].itemHeight) {
      archiveList.style.height = viewportHeight;
    }
  
    archiveList.scrollTop = hydrappArray[currentIndex].totalHeight;
  
    editButtons = document.querySelectorAll('.edition__button--js-edit');
    const newEditButton = editButtons[currentIndex];
    newEditButton.index = currentIndex;
    newEditButton.addEventListener('click', handleItemEdit);
  }
}
// F1 /////////////////////////////////////// REMOVE LAST ITEM << SHOW ARCHIVE 

const removeLastItem = (e) => {

  const self = e.keyCode || e. target;

  if (self === 68 || self === removeItemButton) {

    const archiveListHeight = archiveList.clientHeight;
  
    if (hydrappArray.length > 1) {
      
      const lastItemKey = hydrappArray[hydrappArray.length - 1].key;
      hydrappArray.pop();
      localStorage.removeItem(lastItemKey);
      lastEntryDate.setDate(lastEntryDate.getDate() + 1);
      archiveList.removeChild(archiveList.lastElementChild);
      const itemsTotalHeight = hydrappArray[hydrappArray.length - 1].totalHeight;
      archiveList.scrollTop = itemsTotalHeight - hydrappArray[hydrappArray.length - 1].itemHeight;

      // hide 'load more' button when not enough items to fill the screen
      if (itemsTotalHeight <= archiveListHeight && itemsTotalHeight > 0) {
        loadMoreButton.classList.remove('archive__button--visible');
      }
      // show 'no history...' message
      if (hydrappArray.length === 1) {
        archiveList.firstElementChild.classList.add('archive__item--visible');
        hydrappArray[0].itemHeight = 0;
        hydrappArray[0].totalHeight = 0;
      }
      // add remove button on actual last item
      handleArchiveLastItem();
    }
  }
}
// F2 /////////////////////////////////////////////////////// HANDLE ITEM EDIT 

const handleItemEdit = (e) => {
  const itemIndex = e.target.index;
  const archiveItem = document.querySelectorAll('.archive__item--js')[itemIndex];
  const editSection = document.querySelectorAll('.edition--js')[itemIndex];
  const decreaseButton = document.querySelectorAll('.edition__button--js-decrease')[itemIndex];
  const increaseButton = document.querySelectorAll('.edition__button--js-increase')[itemIndex];
  const cancelButton = document.querySelectorAll('.edition__button--js-cancel')[itemIndex];
  const saveButton = document.querySelectorAll('.edition__button--js-save')[itemIndex];
  const archiveValue = document.querySelectorAll('.archive__value--js')[itemIndex];

  // F0 ////////////////////////////// TOGGLE ITEM DISPLAY << HANDLE ITEM EDIT 

  const toggleItemDisplay = () => {
    archive.classList.toggle('archive--on-top');
    archiveItem.classList.toggle('archive__item--on-top');
    pageOverlay.classList.toggle('archive__overlay--visible');
    removeItemButton.classList.remove('remove-button--visible');
    
    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
  }
  // F1 /////////////////////////////////// EXIT EDIT MODE << HANDLE ITEM EDIT 

  const exitEditMode = () => {
    toggleItemDisplay();
    archiveValue.textContent = hydrappArray[itemIndex].value;
    setIndicators(hydrappArray[itemIndex].ID, hydrappArray[itemIndex].value);
    removeItemButton.classList.add('remove-button--visible');

    archive.removeEventListener('click', handleEdition);
    archive.removeEventListener('keydown', handleEdition);
  }
  // F1 /////////////////////////////////// HANDLE EDITION << HANDLE ITEM EDIT 

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
  ///////////////////////////////////////// FUNCTION CALLS << HANDLE ITEM EDIT 

  toggleItemDisplay();
  archive.addEventListener('click', handleEdition);
  archive.addEventListener('keydown', handleEdition);

}
// F2 //////////////////////////////////////////////// END OF HANDLE ITEM EDIT 

/*
##     ##    ###    ########  ####    ###    ########  ##       ########  ######
##     ##   ## ##   ##     ##  ##    ## ##   ##     ## ##       ##       ##    ##
##     ##  ##   ##  ##     ##  ##   ##   ##  ##     ## ##       ##       ##
##     ## ##     ## ########   ##  ##     ## ########  ##       ######    ######
 ##   ##  ######### ##   ##    ##  ######### ##     ## ##       ##             ##
  ## ##   ##     ## ##    ##   ##  ##     ## ##     ## ##       ##       ##    ##
   ###    ##     ## ##     ## #### ##     ## ########  ######## ########  ######
*/

//////////////////////////////////////////////////////////////////// VARIABLES 
// APP
const appContainer = document.querySelector('.app__container--js');
const addGlass = document.querySelector('.app__button--js-add');
const removeGlass = document.querySelector('.app__button--js-remove');
const counter = document.querySelector('.glass__counter--js');
const counterMaxValue = 99;
// ARCHIVE
const archive = document.querySelector('.archive--js');
const pageOverlay = document.querySelector('.archive__overlay--js');
const archiveList = document.querySelector('.archive__list--js');
const archiveButton = document.querySelector('.navigation__button--js-archive');
const loadMoreButton = document.querySelector('.archive__button--js-load-more');
const addNewButton = document.querySelector('.archive__button--add-new');
// NEW ENTRY
const newEntryModal = document.querySelector('.new-entry--js');
const newEntryValue = document.querySelector('.new-entry__value--js');
const newEntryDecrease = document.querySelector('.new-entry__button--js-decrease');
const newEntryIncrease = document.querySelector('.new-entry__button--js-increase');
const newEntryCancel = document.querySelector('.new-entry__button--js-cancel');
const newEntrySave = document.querySelector('.new-entry__button--js-save');
// STATS
const statsButton = document.querySelector('.navigation__button--js-stats');

/////////////////////////////////////////////////////////////// FUNCTION CALLS 

handleLocalStorage();
//setArchive();

//////////////////////////////////////////////////////////////////// VARIABLES 

let editButtons = document.querySelectorAll('.edition__button--js-edit');
let removeItemButton = document.querySelector('.remove-button--js');
let archiveItems = document.querySelectorAll('.archive__item--js');

////////////////////////////////////////////////////////////// EVENT LISTENERS 

//showArchive();  // ! for tests

appContainer.addEventListener('click', updateCounter);
archiveButton.addEventListener('click', showArchive);
loadMoreButton.addEventListener('click', loadMoreItems);
addNewButton.addEventListener('click', enterNewEntryValue);

for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];
  editButton.index = i;
  editButton.addEventListener('click', handleItemEdit);
}