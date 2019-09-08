"use strict";

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

/********** VARIABLES **********/

const addGlass = document.querySelector('.app__button--js-add');
const removeGlass = document.querySelector('.app__button--js-remove');
const counter = document.querySelector('.glass__counter--js');
const archive = document.querySelector('.archive--js');
const archiveList = document.querySelector('.archive__list--js');
const archiveButton = document.querySelector('.app__button--js-archive');

const baseClassname = "indicator__section indicator__section--js";
const lowLevelClassname = `${baseClassname} indicator__section--low`;
const mediumLevelClassname = `${baseClassname} indicator__section--medium`;
const highLevelClassname = `${baseClassname} indicator__section--high`;

/********** FUNCTIONS **********/

// create hydrApp date key
const setDateKey = (obj) => {
  const prefix = 'hydrApp-';
  const date = obj.toISOString().slice(0,10);
  return prefix.concat(date);
}

// create key value pair in localStorage
const setNewKeyValue = (key, value) => {
  if ( !localStorage.getItem(key) ) {
    localStorage.setItem(key, value);
  };
}

const getHydrappKeys = () => {
  // create array of hydrApp localStorage keys
  const regex = /hydrApp-/;
  return Object
  .keys(localStorage)
  .filter(key => regex.test(key))
  .sort()
  .reverse();
}

const getOffsetedDate = () => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(Date.now() - timeZoneOffset));
}


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
      const dateHash = date.replace(/\s/g,'');
      
      archiveList.innerHTML += `
      <li class="archive__item">
        <p class="archive__date">${date}</p>
        <p class="archive__value archive__value--js">${value}</p>
        <div class="edition">
          <button class="button edition__edit edition__edit--js">
            <i class="edition__icon far fa-edit"></i>
          </button>
          <div class="edition__group">
            <button class="button edition__decrease edition__decrease--js">
              <i class="edition__icon fas fa-caret-left"></i>
            </button>
            <button class="button edition__increase edition__increase--js">
              <i class="edition__icon fas fa-caret-right"></i>
            </button>
            <button class="button edition__cancel edition__cancel--js">
              <i class="edition__icon fas fa-undo"></i>
            </button>
            <button class="button edition__save edition__save--js">
              <i class="edition__icon far fa-save"></i>
            </button>
          </div>
        </div>
        <div class="indicator indicator--js-${dateHash}">
          <div class="${baseClassname}"></div>
          <div class="${baseClassname}"></div>
          <div class="${baseClassname}"></div>
        </div>
      </li>
      `;
  
      setIndicators(dateHash, value);
    }
  }
}

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

const updateCounter = (e) => {
  const offsetedDate = getOffsetedDate();
  const key = setDateKey(offsetedDate);
  const value = parseInt(localStorage.getItem(key));
  let newValue;

  if (e.target === addGlass) {
    value < 100 ? newValue = value + 1 : newValue = 100;
  } else if (e.target === removeGlass) {
    value > 0 ? newValue = value - 1 : newValue = 0;
  }

  localStorage.setItem(key, newValue);
  counter.innerHTML = newValue;
  
  // updating archive newest entry indicator
  const dateHash = offsetedDate
    .toISOString()
    .slice(0,10)
    .split('-')
    .reverse()
    .join('');
  setIndicators(dateHash, newValue);
}

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

setCounter();
setArchive();
addGlass.addEventListener('click', updateCounter);
removeGlass.addEventListener('click', updateCounter);
archiveButton.addEventListener('click', toggleArchive);