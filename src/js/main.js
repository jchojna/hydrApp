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

    this.weekHtml = `
      <section class="week week--js">
        <header class="week__header week__header--js">
          <h3 class="week__heading week__heading--js">New week</h3>
          <button class="button week__button week__button--prev week__button--js-prev">
            Previous
          </button>
          <button class="button week__button week__button--next week__button--js-next">
            Next
          </button>
        </header>
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
// F0 ///////////////////////////////////////////////// LOOPED RANGE OF VALUES 

const range = (max, num, action) => {
  action === 'increase' ? num >= max ? num = 0 : num++ : false;
  action === 'decrease' ? num <= 0 ? num = max : num-- : false;
  return num;
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
  addEntryButton.className = 'entry entry__add';
  addEntryButton.innerHTML = `
    <button class="button entry__button entry__button--add entry__button--js-add">
      Add new day..
    </button>
  `;
  addEntryButton.addEventListener('click', enterNewEntryValue);

  return addEntryButton;
}
// F0 //////////////////////////////////////////// CREATE 'REMOVE ITEM' BUTTON 

const createRemoveEntryButton = () => {

  const removeEntryButton = document.createElement('button');
  removeEntryButton.className = 'button entry__remove';
  removeEntryButton.innerHTML = `
    <svg class="entry__svg" viewBox="0 0 512 512">
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
  
  // add new week
  if (((day === 'sunday' || index === 0)) && option !== 'add') {

    archiveWeeks.insertAdjacentHTML('beforeend', weekHtml);                // ! TO REFACTOR
    const weekHeader = archiveWeeks.lastElementChild.firstElementChild;
    weekHeader.addEventListener('click', slideWeek);
  }
  // add next day entry
  let lastWeekList = archiveWeeks.lastElementChild.lastElementChild;
  lastWeekList.insertAdjacentHTML('beforeend', dayHtml);
  setIndicators(id, value);
  updateWeekHeading();

  // add 'add entry button at the end
  if (index === hydrappArray.length - 1) {
    if (day === 'monday') {
      archiveWeeks.insertAdjacentHTML("beforeend", weekHtml);              // ! TO REFACTOR
      const weekHeader = archiveWeeks.lastElementChild.firstElementChild;
      weekHeader.addEventListener('click', slideWeek);
    };

    lastWeekList = archiveWeeks.lastElementChild.lastElementChild;
    lastWeekList.appendChild(addEntryButton);
  }

  // add event listeners to all edit buttons
  const editButton = document.querySelectorAll('.edition__button--js-edit')[index];
  editButton.index = index;
  editButton.addEventListener('click', handleItemEdit);
}
// F2 ///////////////////////////////////////////////////////////// SLIDE WEEK 

const slideWeek = (e) => {

  const self = e.target;

  const prevWeekButton = document.querySelectorAll('.week__button--js-prev')[currentWeekIndex];
  const nextWeekButton = document.querySelectorAll('.week__button--js-next')[currentWeekIndex];

  switch (self) {

    case prevWeekButton:
      archiveWeeks.children[currentWeekIndex].classList.remove('week--visible');
      currentWeekIndex = range(archiveWeeks.children.length - 1, currentWeekIndex, 'decrease');
      archiveWeeks.children[currentWeekIndex].classList.add('week--visible');
      break;

    case nextWeekButton:
      archiveWeeks.children[currentWeekIndex].classList.remove('week--visible');
      currentWeekIndex = range(archiveWeeks.children.length - 1, currentWeekIndex, 'increase');
      archiveWeeks.children[currentWeekIndex].classList.add('week--visible');
      break;
  }
}
// F2 //////////////////////////////////////////////////////////// SET ARCHIVE 

const setArchiveDOM = () => {
  
  for (let i = 0; i < hydrappArray.length; i++) {
    addArchiveNode(i);
  }
  // set the newest week as visible
  const weeks = document.querySelectorAll('.week--js');
  weeks[currentWeekIndex].classList.add('week--visible');
  // set 'remove entry' button on the last entry
  handleArchiveLastEntry();
}
// F2 /////////////////////////////////////////////////////// SET WEEK HEADING 

const updateWeekHeading = () => {

  const weekLists = document.querySelectorAll('.week__list--js');
  const weekHeadings = document.querySelectorAll('.week__heading--js');

  const getDate = (element) => {

    if (element) {
      return element.className
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
    //remove keyboard event listeners
    window.removeEventListener('keydown', enterNewEntryValue);
    window.removeEventListener('keydown', removeLastEntry);

  } else {

    archive.classList.add('archive--visible');
    //add keyboard event listeners
    window.addEventListener('keydown', enterNewEntryValue);
    window.addEventListener('keydown', removeLastEntry);
  }
}
// F1 ////////////////////////////////////////// ARCHIVE MODAL << SHOW ARCHIVE 

const enterNewEntryValue = (e) => {

  const self = e.keyCode || e.target;
  const addEntryButton = document.querySelector('.entry__button--js-add');

  if (self === 107 || self === addEntryButton) {

    let value = 0;
    newEntryMode.classList.add('new-entry--visible');
    newEntryValue.textContent = value;
  
    const modeOff = () => {
      newEntryMode.classList.remove('new-entry--visible');
      newEntryMode.removeEventListener('click', handleValue);
      window.removeEventListener('keydown', handleValue);
      window.addEventListener('keydown', enterNewEntryValue);
    }
  
    const handleValue = (e) => {
  
      const self = e.keyCode || e.target;
  
      switch (self) {
  
        case 37:
        case newEntryDecrease:
          value !== 0 ? value-- : false;
          newEntryValue.textContent = value;
          break;

        case 39:
        case newEntryIncrease:
          value !== counterMaxValue ? value++ : false;
          newEntryValue.textContent = value;
          break;
  
        case 27:
        case newEntryCancel:
          modeOff();
          break;
  
        case 13:
        case newEntrySave:
          addNewEntry(e, value);
          modeOff();
          break;
      }
    }
    newEntryMode.addEventListener('click', handleValue);
    window.addEventListener('keydown', handleValue);
    window.removeEventListener('keydown', enterNewEntryValue);
  }
}
// F1 /////////////////////////////////////////// ADD NEW ITEM << SHOW ARCHIVE 

const addNewEntry = (e, value) => {
  
  const self = e.keyCode || e.target;

  if (self === 13 || self === newEntrySave) {
    let lastEntryIndex = hydrappArray.length - 1;
    const lastEntry = document.querySelectorAll('.entry--js')[lastEntryIndex];
    lastEntry.classList.remove('entry--last');

    lastEntryDate.setDate(lastEntryDate.getDate() - 1);
    const newEntryKey = setDateKey(lastEntryDate);
    
    setNewKeyValue(newEntryKey, value);
    const newEntry = new Entry(lastEntryDate);
    newEntry.value = newEntryKey;
    hydrappArray.push(newEntry);

    lastEntryIndex = hydrappArray.length - 1;
    addArchiveNode(lastEntryIndex, 'add');
    handleArchiveLastEntry();
  }
}
// F1 /////////////////////////////////////////////// ADJUST LAST ITEM OF LIST 

const handleArchiveLastEntry = () => {

  const entries = document.querySelectorAll('.entry--js');
  const lastEntry = entries[entries.length - 1];
  const lastEntryValueNode = lastEntry.querySelector('.entry__value--js');

  if (entries.length > 1) {
    lastEntry.insertBefore(removeEntryButton, lastEntryValueNode);
    lastEntry.classList.add('entry--last');
  }
}
// F1 /////////////////////////////////////// REMOVE LAST ITEM << SHOW ARCHIVE 

const removeLastEntry = (e) => {

  const self = e.keyCode || e. target;
  const lastEntryIndex = hydrappArray.length - 1;
  const {day, key} = hydrappArray[lastEntryIndex];
  const lastEntryNode = document.querySelectorAll('.entry--js')[lastEntryIndex];

  if (self === 109 || self === removeEntryButton) {

    if (hydrappArray.length > 1) {

      hydrappArray.pop();
      localStorage.removeItem(key);
      lastEntryDate.setDate(lastEntryDate.getDate() + 1);
      lastEntryNode.parentNode.removeChild(lastEntryNode);

      // removing last week section after deleting last day of that week
      if (day === 'monday') {
        archiveWeeks.removeChild(archiveWeeks.lastElementChild);
        const lastWeekList = archiveWeeks.lastElementChild.lastElementChild;
        lastWeekList.appendChild(addEntryButton);
      }

      // add remove button on current last item
      handleArchiveLastEntry();
      updateWeekHeading();
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

    itemIndex === hydrappArray.length - 1
    ? removeEntryButton.classList.toggle('entry__remove--hidden')
    : false;
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
let currentWeekIndex = 0;
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

/* for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];
  editButton.index = i;
  editButton.addEventListener('click', handleItemEdit);
} */