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

const addGlass = document.querySelector('.app__button--js-add');
const removeGlass = document.querySelector('.app__button--js-remove');
const counter = document.querySelector('.glass__counter--js');

const getCurrentDateKey = () => {
  const date = new Date().toISOString().slice(0,10);
  const prefix = 'hydrApp-';
  return prefix.concat(date);
}

/* const getGlassAmount = () => {
  const dateKey = getCurrentDateKey();
  if (localStorage.getItem(dateKey)) {
    return parseInt(localStorage.getItem(dateKey));
  } else {
    localStorage.setItem(dateKey, 0);
    return 0;
  }
} */

/* const updateCounter = (value) => {
  counter.innerHTML = value;
} */



/* const handleCounter = (command) => {
  const dateKey = getCurrentDateKey();
  let glassCounter = getGlassAmount();
  if (command === 'up') {
    glassCounter === 99 ? false : glassCounter++;
  }
  if (command === 'down') {
    glassCounter === 0 ? false : glassCounter--;
  }
  localStorage.setItem(dateKey, glassCounter);
  updateCounter(glassCounter);
} */

//updateCounter(getGlassAmount());

const setCounter = () => {
  const key = getCurrentDateKey();

  if ( !localStorage.getItem(key) ) {
    localStorage.setItem(key, '0');
  };

  counter.innerHTML = localStorage.getItem(key);
}

const updateCounter = (e) => {
  const key = getCurrentDateKey();
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