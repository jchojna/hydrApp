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

const addGlassButton = document.querySelector('.app__button--js-add');
const removeGlassButton = document.querySelector('.app__button--js-remove');
const glassCounterContainer = document.querySelector('.glass__counter--js');

const getGlassAmount = () => {
  if (localStorage.getItem('glassCounter')) {
    return parseInt(localStorage.getItem('glassCounter'));
  } else {
    localStorage.setItem('glassCounter', glassCounter);
    return 0;
  }
}

const updateCounter = (value) => {
  glassCounterContainer.innerHTML = value;
}

const handleCounter = (command) => {
  let glassCounter = getGlassAmount();
  if (command === 'up') {
    glassCounter === 99 ? false : glassCounter++;
  }
  if (command === 'down') {
    glassCounter === 0 ? false : glassCounter--;
  }
  localStorage.setItem('glassCounter', glassCounter);
  updateCounter(glassCounter);
}

updateCounter(getGlassAmount());
addGlassButton.addEventListener('click', () => handleCounter('up'));
removeGlassButton.addEventListener('click', () => handleCounter('down'));