"use strict";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
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
const historyList = document.querySelector('.history__list--js');

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
  .sort((a,b) => a<b);
}

const setCounter = () => {
  let date = new Date();
  let dateKey = setDateKey(date);

  setNewKeyValue(dateKey, 0);

  const hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length-1];

  // autocomplete missing keys
  if ( hydrappKeys.length > 1 ) {
    while (setDateKey(date) !== oldestKey) {
      date.setDate( date.getDate() - 1 );
      const prevDateKey = setDateKey(date);
      setNewKeyValue(prevDateKey, 0);
    }
  }
  counter.innerHTML = localStorage.getItem(dateKey);
}

const setHistory = () => {
  const hydrappKeys = getHydrappKeys();

  for (const key of hydrappKeys) {
    const value = localStorage.getItem(key);
    historyList.innerHTML += `
    <li>
      <span>${key}</span>
      <span>${value}</span>
    </li>
    `;
  }

}

const updateCounter = (e) => {
  const key = setDateKey(new Date());
  const value = parseInt(localStorage.getItem(key));
  let newValue;

  if (e.target === addGlass) {
    value < 100 ? newValue = value + 1 : newValue = 100;
  } else if (e.target === removeGlass) {
    value > 0 ? newValue = value - 1 : newValue = 0;
  }

  localStorage.setItem(key, newValue);
  counter.innerHTML = newValue;
}


setCounter();
setHistory();
addGlass.addEventListener('click', updateCounter);
removeGlass.addEventListener('click', updateCounter);