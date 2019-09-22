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
// F1 ////////////////////////////////////////////////////////////// FUNCTIONS 

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
// F1 //////////////////////////////////////////////////////////// GET DATE ID 
const getDateID = (date) => {
  return date
    .replace('hydrApp-','')
    .split('-')
    .reverse()
    .join('');
}
// F1 ////////////////////////////////////////////////////// GET OFFSETED DATE 
const getOffsetedDate = () => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(Date.now() - timeZoneOffset));
}
// F1 ////////////////////////////////////////////////// GET DATE MATCHING KEY 
const getDateofKey = () => {



  
}
// F1 //////////////////////////////////////////////////////////// SET COUNTER 
const setCounter = () => {
  const offsetedDate = getOffsetedDate();
  let dateKey = setDateKey(offsetedDate);
  //console.log(`newest key: ${dateKey}`);

  setNewKeyValue(dateKey, 0);

  const hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length-1];
  //console.log(`oldest key: ${oldestKey}`);

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
// F1 //////////////////////////////////////////////////////////// SET ARCHIVE 
const setArchive = () => {
  const hydrappKeys = getHydrappKeys();
  var hydrappArray = [];
  const date = new Date();

  if (hydrappKeys.length === 1) {
    archiveList.innerHTML += `
      <li class="archive__item archive__item--empty">No history yet...</li>
      `;
  } else {

    for (let i = 1; i < hydrappKeys.length; i++) {

      const entry = {};
      entry.key = hydrappKeys[i];
      entry.value = localStorage.getItem(entry.key);
      //entry.date = 


      hydrappArray.push(entry);


























      /* const date = key
        .replace('hydrApp-','')
        .split('-')
        .reverse()
        .join(' '); */

      //const dateID = date.replace(/\s/g,'');
      
      /* let indicators = "";
      for (let i = 0; i < 8; i++) {
        indicators += `
        <svg class="indicator__svg indicator__svg--emo-${i+1} indicator__svg--js-${i}">
          <use href="assets/svg/icons.svg#emoticon-${i}"></use>
        </svg>`
      } */

      /* const item = `
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
        </li>
      ` */
      
      //const archiveItems = document.querySelectorAll('.archive__item--js');
      //const itemArray = [...archiveItems];
      //const filteredArray = itemArray.filter(elem => elem.classList.contains(`${key}`));

      /* if (filteredArray.length === 0) {
        archiveList.innerHTML += item;
        setIndicators(dateID, value);
      } */
    }
    console.log(hydrappArray);
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
    : false
  }
  indicator.classList.add('indicator__svg--visible');
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
  
  // updating archive newest entry indicator
  const dateID = offsetedDate
    .toISOString()
    .slice(0,10)
    .split('-')
    .reverse()
    .join('');
}

// F1 /////////////////////////////////////////////////////////// SHOW ARCHIVE 
const showArchive = () => {
  // F2 //////////////////////////////////////////// LOAD MORE << SHOW ARCHIVE 
  const loadMoreItems = () => {
    
    // const allEqual = itemsHeights.every( elem => elem === itemsHeights[0]);
    // const itemsHeights = itemsArray.map(elem => elem.offsetHeight);

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
  var addNewItem = () => {
    
    const offsetedDate = getOffsetedDate();

    const hydrappKeys = getHydrappKeys();
    const oldestKey = hydrappKeys[hydrappKeys.length-1];
    let limit = 0; // for tests to avoid loop error

    while (true) {
      offsetedDate.setDate(offsetedDate.getDate() - 1);
      limit++;
      
      if (setDateKey(offsetedDate) === oldestKey) {

        offsetedDate.setDate(offsetedDate.getDate() - 1);
        const prevDateKey = setDateKey(offsetedDate);
        setNewKeyValue(prevDateKey, 0);
        loadMoreButton.classList.add('archive__button--hidden');
        setArchive();
        const archiveItems = document.querySelectorAll('.archive__item--js');
        for (const archiveItem of archiveItems) {
          archiveItem.classList.add('archive__item--visible');
        }

        return;
      }
    }
  }
  // F2 ///////////////////////////////////////// ADD NEW ITEM << SHOW ARCHIVE 
  const closeArchive = () => {
    archive.classList.remove('archive--visible');

    //loadMoreButton.classList.remove('archive__button--hidden');

    /* const archiveItems = document.querySelectorAll('.archive__item--js');
    for (const archiveItem of archiveItems) {
      archiveItem.classList.remove('archive__item--visible');
    } */
    //addNewButton.removeEventListener('click', addNewItem);
    //loadMoreButton.removeEventListener('click', loadMoreItems);
    archiveButton.removeEventListener('click', closeArchive);
    archiveButton.addEventListener('click', showArchive);
  }
  // F2 /////////////////////////////////////// FUNCTION CALLS << SHOW ARCHIVE 

  archive.classList.add('archive--visible')
  //loadMoreItems();

  // F2 ////////////////////////////////////// EVENT LISTENERS << SHOW ARCHIVE 

  archiveButton.removeEventListener('click', showArchive);
  archiveButton.addEventListener('click', closeArchive);
  //addNewButton.addEventListener('click', addNewItem);
  //loadMoreButton.addEventListener('click', loadMoreItems);
}
// F1 //////////////////////////////////////////////////// END OF SHOW ARCHIVE 

// F1 /////////////////////////////////////////////////////// HANDLE ITEM EDIT 
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
  // F2 ////////////////////////////// TOGGLE ITEM DISPLAY << HANDLE ITEM EDIT 
  const toggleItemDisplay = () => {
    archive.classList.toggle('archive--on-top');
    archiveItem.classList.toggle('archive__item--on-top');
    pageOverlay.classList.toggle('archive__overlay--visible');
    
    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
  }
  // F2 /////////////////////////////////// EXIT EDIT MODE << HANDLE ITEM EDIT 
  const exitEditMode = () => {
    toggleItemDisplay();
    const lastValue = localStorage.getItem(hydrAppKey);
    archiveValue.textContent = lastValue;
    setIndicators(dateID, lastValue);

    archive.removeEventListener('click', handleEdition);
    archive.removeEventListener('keydown', handleEdition);
  }
  // F2 /////////////////////////////////// HANDLE EDITION << HANDLE ITEM EDIT 
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
  // F2 /////////////////////////////////// FUNCTION CALLS << HANDLE ITEM EDIT 

  toggleItemDisplay();
  archive.addEventListener('click', handleEdition);
  archive.addEventListener('keydown', handleEdition);
}
// F1 //////////////////////////////////////////////// END OF HANDLE ITEM EDIT 

// F1 ////////////////////////////////////////////////////////////// VARIABLES 

const addGlass = document.querySelector('.app__button--js-add');
const removeGlass = document.querySelector('.app__button--js-remove');
const counter = document.querySelector('.glass__counter--js');

const archive = document.querySelector('.archive--js');
const pageOverlay = document.querySelector('.archive__overlay--js');
const archiveList = document.querySelector('.archive__list--js');
const archiveButton = document.querySelector('.navigation__button--js-archive');
const loadMoreButton = document.querySelector('.archive__button--js-load-more');
const addNewButton = document.querySelector('.archive__button--add-new');

const statsButton = document.querySelector('.navigation__button--js-stats');

const counterMaxValue = 99;

const baseClassname = "indicator__section indicator__section--js";
const lowLevelClassname = `${baseClassname} indicator__section--low`;
const mediumLevelClassname = `${baseClassname} indicator__section--medium`;
const highLevelClassname = `${baseClassname} indicator__section--high`;

// F1 ///////////////////////////////////////////////// INITIAL FUNCTION CALLS 

setCounter();
setArchive();

// F1 ////////////////////////////////////////////////////////////// VARIABLES 

let archiveItems = document.querySelectorAll('.archive__item--js');
const editButtons = document.querySelectorAll('.edition__button--js-edit');
const editSections = document.querySelectorAll('.edition--js');
const decreaseButtons = document.querySelectorAll('.edition__button--js-decrease');
const increaseButtons = document.querySelectorAll('.edition__button--js-increase');
const cancelButtons = document.querySelectorAll('.edition__button--js-cancel');
const saveButtons = document.querySelectorAll('.edition__button--js-save');
const archiveValues = document.querySelectorAll('.archive__value--js');

// F1 ///////////////////////////////////////////////////////// FUNCTION CALLS 

// F1 //////////////////////////////////////////////////////// EVENT LISTENERS 

addGlass.addEventListener('click', updateCounter);
removeGlass.addEventListener('click', updateCounter);
archiveButton.addEventListener('click', showArchive);

for (let i = 0; i < editButtons.length; i++) {
  const editButton = editButtons[i];
  editButton.index = i;
  editButton.addEventListener('click', handleItemEdit);
}