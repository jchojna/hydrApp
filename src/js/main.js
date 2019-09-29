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
const weekDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

let indicators = '';
for (let i = 0; i < 8; i++) {
  indicators += `
  <svg class="indicator__svg indicator__svg--emo-${i+1} indicator__svg--js-${i}">
    <use href="assets/svg/icons.svg#emoticon-${i}"></use>
  </svg>`
}

class Entry {
  constructor(date, weekNumber) {
    this.key = setDateKey(date);
    this.value = this.key;
    this.date = date;
    this.id = this.date;
    this.day = date;
    this.number = weekNumber;
    //this.itemHeight = 0;
    //this.totalHeight = 0;

    this.weekHtml = `
      <section class="weeks__week">
        <h3 class="weeks__heading">Week ${this.number}</h3>
        <ul class="weeks__list"></ul>
      </section>
    `;

    this.dayHtml = `
      <!--------------------------------------------------- DAY ITEM -->
      <li class="weeks__item weeks__item--js ${this.key}">
        <div class="weeks__title">
          <p class="weeks__text weeks__text--day">${this.day}</p>
          <p class="weeks__text weeks__text--date">${this.date}</p>
        </div>
        <span class="weeks__value weeks__value--js">${this.value}</span>
        <!------------------------------------------ EDITION BUTTONS -->
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
        <!----------------------------------- END OF EDITION BUTTONS -->
        <!----------------------------------------------- INDICATORS -->
        <div class="indicator indicator--js-${this.id}">
          ${indicators}
        </div>
        <!---------------------------------------- END OF INDICATORS -->
      </li>
      <!-------------------------------------------- END OF DAY ITEM -->
    `;
  }

  get value() {
    return this._value;
  }
  set value(key) {
    this._value = localStorage.getItem(key);
  }
  get date() {
    return this._date;
  }
  set date(date) {
    this._date = getOffsetedDate(date).toISOString().slice(0,10).split('-').reverse().join(' ');
  }
  get id() {
    return this._id;
  }
  set id(date) {
    this._id = date.replace(/\s/g,'');
  }
  get day() {
    return this._day;
  }
  set day(date) {
    const dayIndex = date.getDay();
    this._day = weekDay[dayIndex];
  }
  get number() {
    return this._number;
  }
  set number(num) {

    this._number = num;
  }

  /* get totalHeight() {
    return this._totalHeight;
  }
  set totalHeight(amount) {
    this._totalHeight = amount * this.itemHeight;
  } */
}

//////////////////////////////////////////////////////////////////// FUNCTIONS 

// F0 ////////////////////////////////////////////////////// GET OFFSETED DATE 

const getOffsetedDate = (obj) => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(obj - timeZoneOffset));
}
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

const handleData = () => {

  const date = new Date();
  let dateKey = setDateKey(date);
  setNewKeyValue(dateKey, 0);
  let hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length - 1];
  let weekNumber = 1;
  
  // create object for each key
  const createEntryObject = (date) => {
    const newEntry = new Entry(date, weekNumber);
    if (newEntry.day === 'sunday') weekNumber++;
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
}
// F2 //////////////////////////////////////////////////////////// SET ARCHIVE 

const setArchiveDOM = () => {

  const archiveEmpty = `
    <p class="weeks__empty">No history yet...</p>
  `;
  archiveWeeks.innerHTML += archiveEmpty;

  //for (let i = hydrappArray.length - 1; i >= 0; i--) {
  for (let i = 0; i < hydrappArray.length; i++) {

    const {value, id, day, dayHtml, weekHtml} = hydrappArray[i];
   
    day === 'sunday' || i === 0
    ? archiveWeeks.innerHTML += weekHtml
    : false;

    const lastWeekList = archiveWeeks.lastElementChild.lastElementChild;
    lastWeekList.innerHTML += dayHtml;
    setIndicators(id, value);
  }
}
// F1 /////////////////////////////////////////////////////////// SHOW ARCHIVE 

const showArchive = () => {

  weekItems = document.querySelectorAll('.archive__item--js');

  if (archive.classList.contains('archive--visible')) {
    archive.classList.remove('archive--visible')
    //window.removeEventListener('keydown', enterNewEntryValue);
    window.removeEventListener('keydown', removeLastItem);

  } else {

    for (const item of weekItems) {
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

  const lastItem = archiveWeeks.lastElementChild;
  const lastItemValueNode = lastItem.querySelector('.archive__value--js');

  if (!removeItemButton) {
    removeItemButton = createRemoveItemButton();
  }    

  const previousItem = archiveWeeks.lastElementChild.previousElementSibling;
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

  weekItems = document.querySelectorAll('.archive__item--js');
  //const archiveListHeight = archiveList.clientHeight;
  //let viewportHeight = 0;

  // show 'no history...' message
  if (hydrappArray.length === 1) {
    archiveWeeks.firstElementChild.classList.add('weeks__empty--visible');

  // show archive entries
  } else if (hydrappArray.length > 1) {

    // loop
    for (let i = 1; i < weekItems.length; i++) {

      const item = weekItems[i];


      //hydrappArray[i].itemHeight = item.offsetHeight;
      //hydrappArray[i].totalHeight = hydrappArray.reduce((prev, {itemHeight}) => prev + itemHeight, 0);
    }
    // end of loop
    //handleArchiveLastItem();
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
    const archiveListHeight = archiveWeeks.clientHeight;
    let viewportHeight = 0;
    
    const newEntry = new Entry(newEntryKey);
    hydrappArray.push(newEntry);
    lastEntryDate.setDate(lastEntryDate.getDate() - 1);
    const currentIndex = hydrappArray.length - 1;
    archiveWeeks.insertAdjacentHTML('beforeend', hydrappArray[currentIndex].html);
    const weekValue = document.querySelectorAll('.archive__value--js')[currentIndex];
    setNewKeyValue(newEntryKey, value);
    hydrappArray[currentIndex].value = value;
    weekValue.textContent = hydrappArray[currentIndex].value;
    setIndicators(hydrappArray[currentIndex].id, hydrappArray[currentIndex].value);

    handleArchiveLastItem();
    
    // loop
    for (let i = 2; i < archiveWeeks.children.length; i++) {
      const item = archiveWeeks.children[i];
      if (!item.classList.contains('archive__item--visible')) {
        item.classList.add('archive__item--visible');
        hydrappArray[i-1].totalHeight = hydrappArray.reduce((prev, {itemHeight}) => prev + itemHeight, 0);
        archiveScroll += item.offsetHeight;
      }

      if (viewportHeight <= archiveListHeight - item.offsetHeight) {
        viewportHeight += item.offsetHeight;
        archiveScroll += item.offsetHeight;
      } else {
        archiveWeeks.style.height = viewportHeight + 'px';
      }
    }
    // end of loop
    
    if (loadMoreButton.classList.contains('archive__button--visible')) {
      loadMoreButton.classList.remove('archive__button--visible');
    }
  
    if (currentIndex === 1) {
      archiveWeeks.firstElementChild.classList.remove('archive__item--visible');
    } 
  
    hydrappArray[currentIndex].itemHeight = archiveWeeks.lastElementChild.offsetHeight;
    hydrappArray[currentIndex].totalHeight = hydrappArray.reduce((prev, {itemHeight}) => prev + itemHeight, 0);
  
    if (hydrappArray[currentIndex].totalHeight > archiveWeeks.clientHeight - hydrappArray[currentIndex].itemHeight) {
      archiveWeeks.style.height = viewportHeight;
    }
  
    archiveWeeks.scrollTop = hydrappArray[currentIndex].totalHeight;
  
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

    const archiveListHeight = archiveWeeks.clientHeight;
  
    if (hydrappArray.length > 1) {
      
      const lastItemKey = hydrappArray[hydrappArray.length - 1].key;
      hydrappArray.pop();
      localStorage.removeItem(lastItemKey);
      lastEntryDate.setDate(lastEntryDate.getDate() + 1);
      archiveWeeks.removeChild(archiveWeeks.lastElementChild);
      const itemsTotalHeight = hydrappArray[hydrappArray.length - 1].totalHeight;
      archiveWeeks.scrollTop = itemsTotalHeight - hydrappArray[hydrappArray.length - 1].itemHeight;

      // hide 'load more' button when not enough items to fill the screen
      if (itemsTotalHeight <= archiveListHeight && itemsTotalHeight > 0) {
        loadMoreButton.classList.remove('archive__button--visible');
      }
      // show 'no history...' message
      if (hydrappArray.length === 1) {
        archiveWeeks.firstElementChild.classList.add('archive__item--visible');
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

  const weekItem = document.querySelectorAll('.weeks__item--js')[itemIndex];
  const editSection = document.querySelectorAll('.edition--js')[itemIndex];
  const decreaseButton = document.querySelectorAll('.edition__button--js-decrease')[itemIndex];
  const increaseButton = document.querySelectorAll('.edition__button--js-increase')[itemIndex];
  const cancelButton = document.querySelectorAll('.edition__button--js-cancel')[itemIndex];
  const saveButton = document.querySelectorAll('.edition__button--js-save')[itemIndex];
  const weekValue = document.querySelectorAll('.weeks__value--js')[itemIndex];

  // F0 ////////////////////////////// TOGGLE ITEM DISPLAY << HANDLE ITEM EDIT 

  const toggleItemDisplay = () => {
    archive.classList.toggle('archive--on-top');
    weekItem.classList.toggle('archive__item--on-top');
    pageOverlay.classList.toggle('archive__overlay--visible');
    
    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
  }
  // F1 /////////////////////////////////// EXIT EDIT MODE << HANDLE ITEM EDIT 

  const exitEditMode = () => {
    const {value, id} = hydrappArray[itemIndex];
    toggleItemDisplay();
    weekValue.textContent = value;
    setIndicators(id, value);

    archive.removeEventListener('click', handleEdition);
    archive.removeEventListener('keydown', handleEdition);
  }
  // F1 /////////////////////////////////// HANDLE EDITION << HANDLE ITEM EDIT 

  const handleEdition = (e) => {
    const self = e.keyCode || e.target;
    let dayValue = parseInt(weekValue.textContent);

    const {key, id} = hydrappArray[itemIndex];

    switch (self) {

      case 37:
      case decreaseButton:
        e.preventDefault();
        dayValue > 0 ? dayValue-- : false;
        weekValue.textContent = dayValue;
        setIndicators(id, dayValue);
      break;
      
      case 39:
      case increaseButton:
        e.preventDefault();
        dayValue < counterMaxValue ? dayValue++ : false;
        weekValue.textContent = dayValue;
        setIndicators(id, dayValue);
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
        localStorage.setItem(key, dayValue);
        // setter function
        hydrappArray[itemIndex].value = key;
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
const archiveWeeks = document.querySelector('.weeks--js');
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

handleData();
setArchiveDOM();

//////////////////////////////////////////////////////////////////// VARIABLES 

let editButtons = document.querySelectorAll('.edition__button--js-edit');
let removeItemButton = document.querySelector('.remove-button--js');
let weekItems = document.querySelectorAll('.week__item--js');

////////////////////////////////////////////////////////////// EVENT LISTENERS 

showArchive();  // ! for tests

appContainer.addEventListener('click', updateCounter);
archiveButton.addEventListener('click', showArchive);
//loadMoreButton.addEventListener('click', loadMoreItems);
//addNewButton.addEventListener('click', enterNewEntryValue);

for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];
  editButton.index = i;
  editButton.addEventListener('click', handleItemEdit);
}