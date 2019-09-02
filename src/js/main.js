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

/********** FUNCTIONS **********/

const setDateKey = (obj) => {
  const prefix = 'hydrApp-';
  const date = obj.toISOString().slice(0,10);
  return prefix.concat(date);
}

const setNewKeyValue = (key, value) => {
  if ( !localStorage.getItem(key) ) {
    localStorage.setItem(key, value);
  };
}



const setCounter = () => {
  let date = new Date();
  let dateKey = setDateKey(date);
  const regex = /hydrApp-/;

  setNewKeyValue(dateKey, 0);




  // create array of hydrApp localstorage keys
  const hydrappKeys = Object
    .keys(localStorage)
    .filter(key => regex.test(key));

  const sortedDates = hydrappKeys
    .map(key => key.match(/[0-9]/g)
    .join(''))
    .sort((a,b) => a - b);
  const oldestKey = sortedDates[0];

  // add missing dates
  if ( hydrappKeys.length > 1 ) {

    while (setDateKey(date).match(/[0-9]/g).join('') !== oldestKey) {
      date.setDate( date.getDate() - 1 );
      const prevDateKey = setDateKey(date);
      setNewKeyValue(prevDateKey, 0);
    }

  }














  counter.innerHTML = localStorage.getItem(dateKey);
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
addGlass.addEventListener('click', updateCounter);
removeGlass.addEventListener('click', updateCounter);