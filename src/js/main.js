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

const archiveEmpty = `
<p class="week__empty">No history yet...</p>
`;

const addButtonHtml = `
<li class="entry entry--add entry--js-add">
  <button class="button entry__button entry__button--add entry__button--js-add">
    Add new day..
  </button>
</li>
`;

class Entry {
  constructor(date) {
    this.key = setDateKey(date);
    this.value = this.key;
    this.date = date;
    this.id = this.date;
    this.day = date;
    //this.itemHeight = 0;
    //this.totalHeight = 0;

    this.weekHtml = `
      <section class="week">
        <h3 class="week__heading week__heading--js">New week</h3>
        <ul class="week__list week__list--js"></ul>
      </section>
    `;

    this.dayHtml = `
      <!--------------------------------------------------- DAY ITEM -->
      <li class="entry entry--js ${this.key}">
        <header class="entry__header entry__header--js">
          <p class="entry__heading entry__heading--day">${this.day}</p>
          <p class="entry__heading entry__heading--date entry__heading--js-date">${this.date}</p>
        </header>
        <span class="entry__value entry__value--js">${this.value}</span>
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
// F0 //////////////////////////////////////////////// CREATE ADD ENTRY BUTTON 

const createAddEntryButton = () => {
  const addEntryButton = document.createElement('li');
  addEntryButton.className = 'entry entry--add entry--js-add';
  addEntryButton.innerHTML = `
  <button class="button entry__button entry__button--add entry__button--js-add">
    Add new day..
  </button>
  `;
  addEntryButton.addEventListener('click', enterNewDayValue);

  return addEntryButton;
}
// F0 //////////////////////////////////////////// CREATE 'REMOVE ITEM' BUTTON 

const createRemoveEntryButton = () => {

  const removeEntryButton = document.createElement('button');
  removeEntryButton.className = 'button entry__button entry__button--remove entry__button--js-remove';
  removeEntryButton.innerHTML = `
  <svg class="remove-button__svg">
    <use href="assets/svg/icons.svg#remove-icon"></use>
  </svg>
  `
  removeEntryButton.addEventListener('click', removeLastEntry);

  return removeEntryButton;
}
// F2 ////////////////////////////////////////////////////// SET LOCAL STORAGE 

const handleData = () => {

  const date = new Date();
  let dateKey = setDateKey(date);
  setNewKeyValue(dateKey, 0);
  let hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length - 1];
  
  // create object for each key
  const createEntryObject = (date) => {
    const newEntry = new Entry(date);
    hydrappArray.push(newEntry);
  }
  // first object of array
  createEntryObject(date);

  // autocomplete the rest of keys if needed
  while (dateKey !== oldestKey) {
    dateKey = setDateKey(date.setDate(date.getDate() - 1));
    lastEntryDate.setDate(lastEntryDate.getDate() - 1);
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
// F2 /////////////////////////////////////////////////////// ADD ARCHIVE NODE 

const addArchiveNode = (index, option) => {

  const {value, id, day, dayHtml, weekHtml} = hydrappArray[index];
  
  ((day === 'sunday' || index === 0)) && option !== 'add'
  ? archiveWeeks.insertAdjacentHTML('beforeend', weekHtml)
  : false;

  let lastWeekList = archiveWeeks.lastElementChild.lastElementChild;
  lastWeekList.insertAdjacentHTML('beforeend', dayHtml);
  setIndicators(id, value);
  updateWeekHeading();

  // when last entry is being added
  if (index === hydrappArray.length - 1) {
    day === 'monday'
    ? archiveWeeks.insertAdjacentHTML("beforeend", weekHtml)
    : false;

    lastWeekList = archiveWeeks.lastElementChild.lastElementChild;
    lastWeekList.appendChild(addEntryButton);
  }
}
// F2 //////////////////////////////////////////////////////////// SET ARCHIVE 

const setArchiveDOM = () => {
  
  archiveWeeks.innerHTML += archiveEmpty;
  for (let i = 0; i < hydrappArray.length; i++) {
    addArchiveNode(i);
  }
  handleArchiveLastEntry();
}
// F2 /////////////////////////////////////////////////////// SET WEEK HEADING 

const updateWeekHeading = () => {

  const weekLists = document.querySelectorAll('.week__list--js');
  const weekHeadings = document.querySelectorAll('.week__heading--js');

  const getDate = (element) => {

    if (element) {
      return element
        .className
        .split(' ')
        .filter(a => /hydrApp/.test(a))
        .toString()
        .slice(10)
        .split('-')
        .reverse()
        .join('.')
        ;
    } else {
      return false;
    }
  }
  
  for (let i = 0; i < weekLists.length; i++) {

    const entries = weekLists[i].querySelectorAll('.entry--js');
    const startDate = getDate(entries[entries.length - 1]);
    const endDate = getDate(entries[0]);
    const heading = weekHeadings[i];

    heading.textContent = `${startDate
    ? (startDate === endDate ? startDate : `${startDate.slice(0,5)} - ${endDate}`)
    : `New Week`}`;
  }
}
// F1 /////////////////////////////////////////////////////////// SHOW ARCHIVE 

const showArchive = () => {

  entries = document.querySelectorAll('.entry--js');

  if (archive.classList.contains('archive--visible')) {
    archive.classList.remove('archive--visible')
    //window.removeEventListener('keydown', enterNewEntryValue);
    //window.removeEventListener('keydown', removeLastItem);

  } else {

    for (const entry of entries) {
      entry.classList.contains('entry--visible')
      ? entry.classList.remove('entry--visible')
      : false;
    }
    archive.classList.add('archive--visible');

    hydrappArray.length === 1
    ? archiveWeeks.firstElementChild.classList.add('week__empty--visible')
    : false;

    //window.addEventListener('keydown', enterNewEntryValue);
    //window.addEventListener('keydown', removeLastItem);
  }
}
// F1 ////////////////////////////////////////// ARCHIVE MODAL << SHOW ARCHIVE 

const enterNewDayValue = () => {

  let value = 0;
  newEntryMode.classList.add('new-entry--visible');
  newEntryValue.textContent = value;

  const modeOff = () => {
    newEntryMode.classList.remove('new-entry--visible');
    newEntryMode.removeEventListener('click', handleValue);
  }

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
        modeOff();
        break;

      case newEntrySave:
        addNewEntry(e, value);
        modeOff();
        break;
    }
  }
  newEntryMode.addEventListener('click', handleValue);
}
// F1 /////////////////////////////////////////// ADD NEW ITEM << SHOW ARCHIVE 

const addNewEntry = (e, value) => {

  //const self = e.keyCode || e.target;
  const self = e.target;

  //if (self === 65 || self === newEntrySave) {
  if (self === newEntrySave) {

    lastEntryDate.setDate(lastEntryDate.getDate() - 1);
    const newEntryKey = setDateKey(lastEntryDate);
    
    setNewKeyValue(newEntryKey, value);
    const newEntry = new Entry(lastEntryDate);
    newEntry.value = newEntryKey;
    hydrappArray.push(newEntry);

    addArchiveNode(hydrappArray.length - 1, 'add');
    handleArchiveLastEntry();
  }
}
// F1 /////////////////////////////////////////////// ADJUST LAST ITEM OF LIST 

const handleArchiveLastEntry = () => {

  const entries = document.querySelectorAll('.entry--js');
  const lastEntry = entries[entries.length - 1];
  const lastEntryValueNode = lastEntry.querySelector('.entry__value--js');

  lastEntry.insertBefore(removeEntryButton, lastEntryValueNode);
}
// F1 /////////////////////////////////////// REMOVE LAST ITEM << SHOW ARCHIVE 

const removeLastEntry = (e) => {

  //const self = e.keyCode || e. target;
  const self = e.target;
  const lastItemKey = hydrappArray[hydrappArray.length - 1].key;
  const lastEntry = self.parentNode;

  //if (self === 68 || self === removeItemButton) {
  if (self === removeEntryButton) {

    if (hydrappArray.length > 1) {

      hydrappArray.pop();
      localStorage.removeItem(lastItemKey);
      lastEntryDate.setDate(lastEntryDate.getDate() + 1);
      lastEntry.parentNode.removeChild(lastEntry);

      // add remove button on current last item
      handleArchiveLastEntry();
    } else {

    }
  }
}
// F2 /////////////////////////////////////////////////////// HANDLE ITEM EDIT 

const handleItemEdit = (e) => {
  const itemIndex = e.target.index;

  const entry = document.querySelectorAll('.entry--js')[itemIndex];
  const entryHeader = document.querySelectorAll('.entry__header--js')[itemIndex];
  const entryValue = document.querySelectorAll('.entry__value--js')[itemIndex];
  const editSection = document.querySelectorAll('.edition--js')[itemIndex];
  const decreaseButton = document.querySelectorAll('.edition__button--js-decrease')[itemIndex];
  const increaseButton = document.querySelectorAll('.edition__button--js-increase')[itemIndex];
  const cancelButton = document.querySelectorAll('.edition__button--js-cancel')[itemIndex];
  const saveButton = document.querySelectorAll('.edition__button--js-save')[itemIndex];

  // F0 ////////////////////////////// TOGGLE ITEM DISPLAY << HANDLE ITEM EDIT 

  const toggleItemDisplay = () => {

    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
    entry.classList.toggle('entry--edit-mode');
    entryHeader.classList.toggle('entry__header--edit-mode');
  }
  // F1 /////////////////////////////////// EXIT EDIT MODE << HANDLE ITEM EDIT 

  const exitEditMode = () => {
    const {value, id} = hydrappArray[itemIndex];
    toggleItemDisplay();
    entryValue.textContent = value;
    setIndicators(id, value);

    archive.removeEventListener('click', handleEdition);
    archive.removeEventListener('keydown', handleEdition);
  }
  // F1 /////////////////////////////////// HANDLE EDITION << HANDLE ITEM EDIT 

  const handleEdition = (e) => {
    const self = e.keyCode || e.target;
    let dayValue = parseInt(entryValue.textContent);

    const {key, id} = hydrappArray[itemIndex];

    switch (self) {

      case 37:
      case decreaseButton:
        e.preventDefault();
        dayValue > 0 ? dayValue-- : false;
        entryValue.textContent = dayValue;
        setIndicators(id, dayValue);
      break;
      
      case 39:
      case increaseButton:
        e.preventDefault();
        dayValue < counterMaxValue ? dayValue++ : false;
        entryValue.textContent = dayValue;
        setIndicators(id, dayValue);
      break;

      case 27:
      case archiveOverlay:
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
const archiveOverlay = document.querySelector('.archive__overlay--js');
const archiveWeeks = document.querySelector('.archive__weeks--js');
const archiveButton = document.querySelector('.navigation__button--js-archive');
const prevWeekButton = document.querySelector('.archive__button--js-prev');
const nextWeekButton = document.querySelector('.archive__button--js-next');
const addEntryButton = createAddEntryButton();
const removeEntryButton = createRemoveEntryButton();
// NEW ENTRY
const newEntryMode = document.querySelector('.new-entry--js');
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
updateWeekHeading();

//////////////////////////////////////////////////////////////////// VARIABLES 

let editButtons = document.querySelectorAll('.edition__button--js-edit');
let entries = document.querySelectorAll('.entry--js');
const addNewDayButton = document.querySelector('.entry__button--js-add');

////////////////////////////////////////////////////////////// EVENT LISTENERS 

showArchive();  // ! for tests

appContainer.addEventListener('click', updateCounter);
archiveButton.addEventListener('click', showArchive);
//loadMoreButton.addEventListener('click', loadMoreItems);

for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];
  editButton.index = i;
  editButton.addEventListener('click', handleItemEdit);
}