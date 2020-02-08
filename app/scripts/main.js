'use strict';
//| SERVICE WORKER                                                          |//
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
//| FUNCTIONS                                                               |//
//// OVERALL                                                               ////
//| GET OFFSETED DATE                                                       |//
const getOffsetedDate = (obj) => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(obj - timeZoneOffset));
}
//| CREATE HYDRAPP DATE KEY                                                 |//
const getDateId = (obj) => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  let dateObj = obj || new Date();
  dateObj = (new Date(dateObj - timeZoneOffset));
  return dateObj
  .toISOString()
  .slice(0,10)
  .split('-')
  .reverse()
  .join('');
}
//| CREATE ARRAY OF HYDRAPP LOCAL STORAGE USER KEYS                         |//
const getHydrappUsers = () => {
  const regex = /hydrapp-/;
  return Object
  .keys(localStorage)
  .filter(key => regex.test(key))
}
//| LOOPED RANGE OF VALUES                                                  |//
const range = (max, num, action) => {
  action === 'increase' ? num >= max ? num = 0 : num++ : false;
  action === 'decrease' ? num <= 0 ? num = max : num-- : false;
  return num;
}
//| LIMITED RANGE OF VALUES                                                 |//
const limit = (max, num, action) => {
  action === 'increase' ? num >= max ? false : num++ : false;
  action === 'decrease' ? num <= 0 ? false : num-- : false;
  return num;
}
//| FIND FIRST ENCOUNTERED PARENT OF GIVEN NODE WITH A GIVEN CLASS          |//
const findFirstParentOfClass = (node, classname) => {
  while (!node.parentNode.classList.contains(classname)
  && node.parentNode.tagName !== 'HTML') node = node.parentNode;
  return node.parentNode;
}
//| HANDLE ELEMENTS ON WINDOW RESIZE                                        |//
const handleWindowResize = () => {
  const waterValue = hydrappJson.entries[0].value;
  handleWaterLevel(waterValue);
  handleWaterWaves();
  handleWaterMeasure();
}
//| HANDLE CONTAINER'S HEIGHT BASED ON ELEMENT'S CHILDREN TOTAL HEIGHT      |//
const handleContainerHeight = (container, elements) => {
  const childrenArray = [...elements.children];
  const childrenHeight = childrenArray.reduce((a,b) => a + b.clientHeight, 0);
  container.style.height = `${childrenHeight}px`;
}
//| EXPORT JSON OBJECT TO LOCAL STORAGE                                     |//
const exportJsonToLS = (user) => {
  localStorage.setItem(`hydrapp-${user}`, JSON.stringify(hydrappJson));
}
//| UPDATE JSON OBJECT WHEN DATE HAS BEEN CHANGED                           |//
const updateJsonOnDateChange = () => {
  const currentDate = new Date();
  let currentDateId = getDateId(currentDate);
  let newEntries = [];
  const lastEntryDateId = hydrappJson.entries[0].id;

  while (currentDateId !== lastEntryDateId) {
    const newEntry = new Entry(currentDate);
    newEntries = [...newEntries, newEntry];
    currentDateId = getDateId(currentDate.setDate(currentDate.getDate() - 1));
  }
  hydrappJson.entries = [...newEntries, ...hydrappJson.entries];
  exportJsonToLS('Jakub');
}
//| TRIGGER FUNCTIONS LOADING APP                                           |//
const loadApp = () => {
  updateJsonOnDateChange();
  const startValue = hydrappJson.entries[0].value;
  setArchiveDOM();
  //setStatsDOM();
  setWaterMeasureDOM();
  setWaterWaves(wavesAmount);
  handleCounter(startValue);
  handleWaterLevel(startValue);
  handleWaterShake();
  handleWaterMeasure();
  handleCounterMessage(startValue);
  handleCounterDate();
  emoji.innerHTML = getEmojiHtml('controls');
  handleEmoji('controls', startValue);
  updateWeekHeading();
  handleWaterAverage();
}
//// USER DATA                                                             ////
const createUser = () => {
  //| CREATE USER DOM NODES                                                 |//
  const setUserDOM = () => {
    const userDetails = [
      { id: 'Name', question: 'What\'s your name, dear guest?' },
      { id: 'Age', question: 'What\'s your age?' },
      { id: 'Weight', question: 'And what\'s your weight?' },
      { id: 'Height', question: 'At last, what\'s your height?' }
    ];
    
    for (let i = 0; i < userDetails.length; i++) {
      const { id, question } = userDetails[i];
      
      const userDetailHtml = `
        <div class="userDetail ${i === 0 ? 'userDetail--visible' : ''} userDetail--js">
          <label
            for="user${id}"
            class="userDetail__label userDetail__label--js-${id.toLowerCase()}"
          >
            ${question}
          </label>
          <input
            id="user${id}"
            class="userDetail__input userDetail__input--js"
            type="text"
            maxlength="${i === 0 ? 20 : 3}"
            autofocus=${i === 0 ? true : false}
          >
          ${i !== 0 ? `
            <div class="userDetail__alert userDetail__alert--js">
              <p class="userDetail__alertText"></p>
            </div>
            <button class="userDetail__button userDetail__button--prev userDetail__button--js-prev">
              <svg class="userDetail__svg" viewBox="0 0 512 512">
                <use href="assets/svg/icons.svg#left-arrow"></use>
              </svg>
            </button>
          ` : ''}
          <button class="userDetail__button userDetail__button--next userDetail__button--js-next">
            <svg class="userDetail__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#right-arrow"></use>
            </svg>
          </button>
        </div>
      `;
      appUser.innerHTML += userDetailHtml;
      appUser.classList.add('app__user--visible');
    }
  }
  //| HANDLE USER DETAILS                                                   |//
  const handleUserDetails = (e) => {
    e.preventDefault();
    const self = e.key || e.target;
  
    //: TOGGLE VISIBILITY OF USER DETAIL WINDOW                               ://
    const toggleDetail = (current, next, action, timeout) => {
      const hiddenSide = action === 'prev' ? 'Right' : 'Left';
      const visibleSide = action === 'prev' ? 'Left' : 'Right';
      const nextInput = next ? next.querySelector('.userDetail__input--js') : false;
  
      current.classList.add(`user--hidden${hiddenSide}`);
      current.classList.remove('user--visible');
      next ? next.classList.add(`user--hidden${visibleSide}`) : false;
  
      detailToggleTimeoutId = setTimeout(() => {
        if (next) {
          next.classList.add('user--visible');
          next.classList.remove(`user--hidden${visibleSide}`);
          nextInput.focus();
        }
        clearTimeout(detailToggleTimeoutId);
        detailToggleTimeoutId = null;
      }, timeout);
    }
    //: RETURN USER INPUT VALUE AS INTEGER                                    ://
    const getInputValue = (index) => parseInt(userInputs[index].value);
  
    if ((self.tagName === 'BUTTON' || self === 'Enter' || self === 'Escape')
    && detailToggleTimeoutId === null) {
  
      const toggleTime = 300;
      const { action } = self;
      const maxIndex = userDetails.length - 1;
  
      if (action === 'prev' || self === 'Escape') {
        const currentDetail = userDetails[currentDetailIndex];
        const nextDetail = userDetails[currentDetailIndex - 1];
        if (currentDetailIndex > 0) {
          toggleDetail(currentDetail, nextDetail, 'prev', toggleTime);
          currentDetailIndex--;
        }
  
      } else if (action === 'next' || self === 'Enter') {
        const currentDetail = userDetails[currentDetailIndex];
        //: AQUIRE USER DATA AND GO TO LANDING SECTION                        ://
        if (currentDetailIndex >= maxIndex) {
          if (isInputValid(currentDetailIndex)) {
            //. update JSON object                                            .//
            hydrappJson.userName = userInputs[0].value;
            hydrappJson.userAge = getInputValue(1);
            hydrappJson.userWeight = getInputValue(2);
            hydrappJson.userHeight = getInputValue(3);
            hydrappJson.waterMax = 20,
            hydrappJson.waterMin = 8,
            hydrappJson.waterAvg = 0
            // date of creation etc..
            const date = new Date();
            const newEntry = new Entry(date);
            hydrappJson.entries = [newEntry];
            loadApp();
            //. set JSON object as local storage item                         .//
            const keyName = `hydrapp-${hydrappJson.userName}`;
            localStorage.setItem(keyName, JSON.stringify(hydrappJson));
            //. change user section visibility                                .//
            toggleDetail(currentDetail, null, 'next', toggleTime);
            appUser.classList.remove('app__user--visible');
          }
        //: GO TO NEXT USER DETAIL                                            ://
        } else {
          var nextDetail = userDetails[currentDetailIndex + 1];
          if (isInputValid(currentDetailIndex)) {
            if (currentDetailIndex === 0) {
              const userName = userInputs[currentDetailIndex].value;
              const userAgeLabel = document.querySelector('.userDetail__label--js-age');
              const newLabelContent = `Hello ${userName}, how old are you?`;
              userAgeLabel.textContent = newLabelContent;
              hydrappJson.userName = userName;
            }
            toggleDetail(currentDetail, nextDetail, 'next', toggleTime);
            currentDetailIndex++;
          }
        }
      }
    }
  }
  //| FILTER USER INPUTS                                                    |//
  const filterUserInput = (e) => {
    if (e.keyCode  === 13 || e.keyCode  === 27) return false;
    const self = e.target;
    const { value } = self;
    const filteredValue = value.match(/\d/g);
    const outputValue = filteredValue ? filteredValue.join('') : '';
    self.value = outputValue;
  }
  //| VALIDATE USER INPUTS                                                  |//
  const isInputValid = (index) => {
  
    const handleInputAlert = (index, min, max) => {
      index = index - 1; // there's no alerts for first user detail
      const alert = userAlerts[index];
      const alertText = alert.firstElementChild;
      const valNames = ['Age', 'Weight', 'Height'];
      const valName = valNames[index];
      const alertTextContent = `${valName} should be between ${min} and ${max}`;
  
      if (!min && !max) {
        alert.style.height = '';
        alertText.textContent = '';
      } else {
        alertText.textContent = alertTextContent;
        alert.style.height = `${alertText.clientHeight}px`;
      }
    }
  
    const input = userInputs[index];
    const inputValue = index === 0 ? input.value : parseInt(input.value);
    const limits = [
      { min: null, max: null},
      { min: 10, max: 120},
      { min: 8, max: 200},
      { min: 70, max: 250}
    ]
    const limitMin = limits[index].min;
    const limitMax = limits[index].max;
  
    if (!inputValue) {
      input.focus();
      return false;
    }
  
    if (index === 0) return true;
    if (inputValue < limitMin || inputValue > limitMax) {
      handleInputAlert(index, limitMin, limitMax);
      return false;
    } else {
      handleInputAlert(index);
      return true;
    }
  }
  //: create user DOM structure                                             ://
  setUserDOM();
  //: variables                                                             ://
  let currentDetailIndex = 0;
  let detailToggleTimeoutId = null;
  const userDetails = document.querySelectorAll('.userDetail--js');
  const userPrevButtons = document.querySelectorAll('.userDetail__button--js-prev');
  const userNextButtons = document.querySelectorAll('.userDetail__button--js-next');
  const userInputs = document.querySelectorAll('.userDetail__input--js');
  const userAlerts = document.querySelectorAll('.userDetail__alert--js');
  //: event listeners                                                       ://
  [...userPrevButtons].forEach((button, index) => {
    button.index = index;
    button.action = 'prev';
    button.addEventListener('click', handleUserDetails);
  });
  [...userNextButtons].forEach((button, index) => {
    button.index = index;
    button.action = 'next';
    button.addEventListener('click', handleUserDetails);
  });
  [...userInputs]
  .filter((input, index) => index !== 0)
  .forEach(input => input.addEventListener('keyup', filterUserInput));
  appUser.addEventListener('keypress', (e) => {
    if (e.keyCode  === 13 || e.keyCode  === 27) e.preventDefault();
  });
  appUser.addEventListener('keyup', handleUserDetails);
}
//// EMOJI                                                                 ////
//| GET EMOJIS HTML STRING                                                  |//
const getEmojiHtml = (id) => {
  let emojiHtml = `<div class="emoji emoji--js-${id}">`;

  for (let i = 0; i < emojiAmount; i++) {
    emojiHtml += `
      <svg
        class="emoji__svg emoji__svg--emo-${i} emoji__svg--js-${id}"
        viewBox="0 0 512 512"
      >
        <use href="assets/svg/emoji.svg#emo-${i}"></use>
      </svg>
    `
  }
  emojiHtml += '</div>'
  return emojiHtml;
}
//| SET INDICATORS                                                          |//
const handleEmoji = (id, number) => {
  number > 7 ? number = 7 : false;
  const emojis = document.querySelectorAll(`.emoji__svg--js-${id}`);

  [...emojis].forEach((emoji, index) => {
    if (index === number) {
      emoji.classList.add('emoji__svg--visible');
    } else {
      if (emoji.classList.contains('emoji__svg--visible')) {
        emoji.classList.remove('emoji__svg--visible');
      }
    }
  });  
}
//// WATER                                                                 ////
//| SET WAVES AMOUNT                                                        |//
const setWaterWaves = () => {
  const waveSvg = `
    <svg class="wave__svg" viewBox="0 0 100 10">
      <use href="assets/svg/wave.svg#wave"></use>
    </svg>
  `;
  let wavesSvgs = '';
  for (let i = 1; i <= wavesAmount; i++) {
    wavesSvgs += waveSvg;
  }
  [...waves].forEach(wave => wave.innerHTML = wavesSvgs);
  handleWaterWaves();
}
//| SET WATER MEASURE                                                       |//
const setWaterMeasureDOM = () => {
  const { waterMax } = hydrappJson;
  for (let i = 0; i <= waterMax; i++) {
    const digit = waterMax - i;
    measure.innerHTML += `
      <li class="measurePart measurePart--js">
        <span class="measurePart__mark"></span>
        <span class="measurePart__digit">${digit}</span>
      </li>
    `
  }
}
//| HANDLE WATER CHANGE                                                     |//
const handleWaterChange = (e) => {
  const self = e.target;
  const { waterMax } = hydrappJson;
  let { value, id } = hydrappJson.entries[0];
  const firstEntryValue = document.querySelector('.entry__value--js');

  //. if add button clicked                                                 .//
  if (self === addBtn) {
    if (value >= waterMax) return;
    handleCounter(value, ++value);

  //. if remove button clicked                                              .//
  } else if (self === removeBtn) {
    if (value <= 0) return;
    handleCounter(value, --value);
  }
  //. value has been changed                                                .//
  hydrappJson.entries[0].value = value;
  exportJsonToLS('Jakub');
  handleWaterLevel(value);
  handleWaterShake();
  handleCounterMessage(value);
  handleWaterAverage();
  firstEntryValue.textContent = value;
  handleEmoji('controls', value);
  handleEmoji(id, value);
}
//| HANDLE WATER MEASURE APPEARANCE                                         |//
const handleWaterMeasure = () => {
  const headerHeight = appHeader.clientHeight;
  const { waterMax } = hydrappJson;
  const interval = appLanding.clientHeight / waterMax;
  const measureLevels = document.querySelectorAll('.measurePart--js');

  [...measureLevels].forEach((level, index) => {
    const detailLevel = (everyNth) => {
      if (index % everyNth === 0) {
        mark.classList.add('measurePart__mark--large');
        digit.classList.add('measurePart__digit--visible');
      } else {
        mark.classList.remove('measurePart__mark--large');
        digit.classList.remove('measurePart__digit--visible');
      }
    }
    const mark = level.firstElementChild;
    const digit = level.lastElementChild;
    const isLevelOnEnd = level.offsetTop < headerHeight + 10
    || index === waterMax;

    !isLevelOnEnd
    ? level.classList.add('measurePart--visible')
    : level.classList.remove('measurePart--visible');

    interval <= 20 ? detailLevel(5) :
    interval <= 30 ? detailLevel(4) :
    interval <= 40 ? detailLevel(3) :
    detailLevel(2);
  });
}
//| HANDLE WATER WAVES                                                      |//
const handleWaterWaves = () => {
  const size = water.clientWidth / wavesAmount / 10;
  wavesContainer.style.height = `${size}px`;
  wavesContainer.style.top = `${-1 * (size - 1)}px`;
}
//| HANDLE WATER LEVEL                                                      |//
const handleWaterLevel = (value) => {
  const { waterMax, waterMin, waterAvg } = hydrappJson;
  const landingHeight = appLanding.clientHeight;
  const waterOffset = landingHeight / waterMax * (waterMax - value);
  const avgOffset = landingHeight / waterMax * (waterAvg);
  const minOffset = landingHeight / waterMax * (waterMin);

  water.style.top = `${waterOffset}px`;
  if (value === 0) {
    water.classList.add('water--hidden');
  } else {
    water.classList.remove('water--hidden');
  }
  levelAvg.style.bottom = `${avgOffset}px`;
  levelMin.style.bottom = `${minOffset}px`;
}
//| HANDLE WATER LEVEL                                                      |//
const handleWaterShake = () => {
  const shakeDuration = 1500;

  water.classList.add('water--shake');
  water.style.animationDuration = `${shakeDuration}ms`

  wavesShakeTimeoutId !== null ? clearTimeout(wavesShakeTimeoutId) : false;  
  wavesShakeTimeoutId = setTimeout(() => {
    water.classList.remove('water--shake');
    clearTimeout(wavesShakeTimeoutId);
    wavesShakeTimeoutId = null;
  }, shakeDuration);
}
//| HANDLE CONSUMED WATER AVERAGE VALUE                                     |//
const handleWaterAverage = () => {
  const { waterMax, entries } = hydrappJson;
  const interval = appLanding.clientHeight / waterMax;
  const waterAverage = [...entries]
    .map(elem => elem.value)
    .reduce((a,b) => a + b) / entries.length;
  levelAvg.style.bottom = `${waterAverage * interval}px`;
  hydrappJson.waterAvg = waterAverage;
  exportJsonToLS('Jakub');
}
//// COUNTER                                                               ////
//| SET COUNTER VALUES                                                      |//
const handleCounter = (currentValue, newValue) => {

  const getTenthsValue = (value) => Math.floor(value / 10);
  const getOnesValue = (value) => value % 10;

  const hrefPrefix = 'assets/svg/digits.svg#digit-';
  const currentTenthsValue = getTenthsValue(currentValue);
  const currentOnesValue = getOnesValue(currentValue);
  const currentTenthsHref = hrefPrefix + currentTenthsValue;
  const currentOnesHref = hrefPrefix + currentOnesValue;
  //: set counter on page load                                              ://
  if (newValue === undefined) {
    counterPrevTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    counterPrevOnes.firstElementChild.setAttribute('href', currentOnesHref);
    counterNextTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    counterNextOnes.firstElementChild.setAttribute('href', currentOnesHref);
    return;
  }
  //: return false if value did not change                                  ://
  if (newValue === currentValue) return;

  const newTenthsValue = getTenthsValue(newValue);
  const newOnesValue = getOnesValue(newValue);
  const newTenthsHref = hrefPrefix + newTenthsValue;
  const newOnesHref = hrefPrefix + newOnesValue;
  const tenthsTimeout = 200;
  const onesTimeout = 50;

  const removeAnimations = (digits) => {
    if (digits === 'tenths') {
      counterNextTenths.classList.remove('digit__svg--animateIn');
      counterNextTenths.classList.remove('digit__svg--animateOut');
      counterPrevTenths.classList.remove('digit__svg--animateOut');
    } else if (digits === 'ones') {
      counterNextOnes.classList.remove('digit__svg--animateIn');
      counterNextOnes.classList.remove('digit__svg--animateOut');
      counterPrevOnes.classList.remove('digit__svg--animateOut');
    }
  }
  //. handle tenths on add button click                                     .//
  if (newValue > currentValue && newTenthsValue !== currentTenthsValue) {

    counterNextTenths.firstElementChild.setAttribute('href', newTenthsHref);
    counterPrevTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    counterNextTenths.classList.add('digit__svg--rotatedNext');
    counterPrevTenths.classList.remove('digit__svg--rotatedPrev');
    removeAnimations('tenths');

    const timeoutId = setTimeout(() => {
      counterNextTenths.classList.remove('digit__svg--rotatedNext');
      counterNextTenths.classList.add('digit__svg--animateIn');
      counterPrevTenths.classList.add('digit__svg--rotatedPrev');
      counterPrevTenths.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, tenthsTimeout);

  //. handle tenths on remove button click                                  .//
  } else if (newValue < currentValue && newTenthsValue !== currentTenthsValue) {

    counterNextTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    counterPrevTenths.firstElementChild.setAttribute('href', newTenthsHref);
    counterNextTenths.classList.remove('digit__svg--rotatedNext');
    counterPrevTenths.classList.add('digit__svg--rotatedPrev');
    removeAnimations('tenths');

    const timeoutId = setTimeout(() => {
      counterNextTenths.classList.add('digit__svg--rotatedNext');
      counterNextTenths.classList.add('digit__svg--animateOut');
      counterPrevTenths.classList.remove('digit__svg--rotatedPrev');
      counterPrevTenths.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, tenthsTimeout);
  }

  //. handle ones on add button click                                       .//
  if (newValue > currentValue && newOnesValue !== currentOnesValue) {

    counterNextOnes.firstElementChild.setAttribute('href', newOnesHref);
    counterPrevOnes.firstElementChild.setAttribute('href', currentOnesHref);
    counterNextOnes.classList.add('digit__svg--rotatedNext');
    counterPrevOnes.classList.remove('digit__svg--rotatedPrev');
    removeAnimations('ones');

    const timeoutId = setTimeout(() => {
      counterNextOnes.classList.remove('digit__svg--rotatedNext');
      counterNextOnes.classList.add('digit__svg--animateIn');
      counterPrevOnes.classList.add('digit__svg--rotatedPrev');
      counterPrevOnes.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, onesTimeout);
    
  //. handle ones on remove button click                                    .//
  } else if (newValue < currentValue && newOnesValue !== currentOnesValue) {
        
    counterNextOnes.firstElementChild.setAttribute('href', currentOnesHref);
    counterPrevOnes.firstElementChild.setAttribute('href', newOnesHref);
    counterNextOnes.classList.remove('digit__svg--rotatedNext');
    counterPrevOnes.classList.add('digit__svg--rotatedPrev');
    removeAnimations('ones');
    
    const timeoutId = setTimeout(() => {
      counterNextOnes.classList.add('digit__svg--rotatedNext');
      counterNextOnes.classList.add('digit__svg--animateOut');
      counterPrevOnes.classList.remove('digit__svg--rotatedPrev');
      counterPrevOnes.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, onesTimeout);
  }
}
//| HANDLE MESSAGE DEPENDING ON AMOUNT OF CONSUMED WATER                    |//
const handleCounterMessage = (value) => {
  const { waterMax, waterMin, waterAvg } = hydrappJson;
  counterMessage.innerHTML = value === waterMax
  ? 'It\'s enough for today!'

  : value >= waterMax - 2
  ? 'Almost there..'

  : value > waterMin + 1
  ? 'Woow.. You\'re on fire!'

  : value >= waterMin - 1
  ? 'Good job! You reached your optimal water consumption'

  : value >= waterMin - 3
  ? 'Keep going.. Yo\'re doing well'
  
  : value >= 4
  ? 'Much better, but still you can do more!'
  
  : value >= 2
  ? 'Still too little..'

  : 'Drink or you will dehydrate!';
}
//| HANDLE COUNTER DATE TO DISPLAY                                          |//
const handleCounterDate = () => {
  const { day, date } = hydrappJson.entries[0];
  counterDay.innerHTML = day;
  counterDate.innerHTML = date.slice().split(' ').join('.');
}
//// APP SIDEBAR                                                           ////
//| TOGGLE SIDEBAR VISIBILITY                                               |//
const toggleSidebar = (e) => {
  const self = e.target || e;
  if (self === burgerBtn) {
    self.classList.toggle('button--active');
    appSidebar.classList.toggle('app__sidebar--visible');
    appLanding.classList.toggle('app__landing--onSide');
    //: update waves height and offset during css transition                ://
    clearInterval(wavesIntervalId);
    clearTimeout(wavesTimeoutId);
    if (window.innerWidth >= mediaMd) {
      wavesIntervalId = setInterval(() => {
        handleWaterWaves();
      }, 10);
      wavesTimeoutId = setTimeout(() => {
        clearInterval(wavesIntervalId);
        clearTimeout(wavesTimeoutId);
      }, 1000);
    }
  }
}
//| TOGGLE SIDEBAR'S TABS                                                   |//
const toggleSidebarTabs = (e) => {
  const self = e.target;

  if(self === archiveTabButton
  || self === statsTabButton 
  || self === settingTabButton) {

    const parentContainer = findFirstParentOfClass(self, 'tab');
    const svgIcon = parentContainer.querySelector('.tab__svg');
    const tabContainer = parentContainer.querySelector('.tab__container');
    const isActive = svgIcon.classList.contains('tab__svg--active');
    
    switch (self) {
      case archiveTabButton:
        //: show archive content                                              ://
        if (!isActive) {
          const currentWeek = weeks[currentWeekIndex];
          handleContainerHeight(archiveContainer, currentWeek);
          window.addEventListener('keydown', enterNewEntryValue);
          window.addEventListener('keydown', removeLastEntry);
          window.addEventListener('keydown', slideWeek);
  
        //: hide archive content                                              ://
        } else {
          archiveContainer.style.height = 0;
          window.removeEventListener('keydown', enterNewEntryValue);
          window.removeEventListener('keydown', removeLastEntry);
          window.removeEventListener('keydown', slideWeek);
        }
        break;
      case statsTabButton:
      case settingTabButton:
        //: show stats content                                                ://
        if (!isActive) {
          handleContainerHeight(tabContainer, tabContainer.firstElementChild);
        //: hide stats content                                                ://
        } else {
          tabContainer.style.height = 0;
        }
        break;
      default: false;
    }
    svgIcon.classList.toggle('tab__svg--active');
  }
}
//| RETURN SIDEBAR TAB'S CARD HTML                                          |//
const getCardHtml = (card) => {
  return `
    <section class="card card--${card} card--js-${card}">
      <div class="card__container">
        <header class="card__header card__header---js-${card}">
          <button class="card__button card__button--prev card__button--js-${card}Prev">
            <svg class="card__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#left-arrow"></use>
            </svg>
          </button>
          <h4 class="card__heading card__heading--js-${card}"></h4>
          <button class="card__button card__button--next card__button--js-${card}Next">
            <svg class="card__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#right-arrow"></use>
            </svg>
          </button>
        </header>
        <ul class="card__list card__list--js-${card}"></ul>
      </div>
    </section>
  `;
}
//| RETURN EDITION MODULE HTML                                              |//
const getEditionHtml = (tab) => {
  return `
    <div class="edition edition--${tab} edition--js">
      <button class="edition__button edition__button--visible edition__button--edit edition__button--js-edit">
        <svg class="edition__svg edition__svg--edit">
          <use href="assets/svg/icons.svg#edit-mode"></use>
        </svg>
      </button>
      ${ tab === 'archive'
      ? `
      <button class="edition__button edition__button--decrease edition__button--js-decrease">
        <svg class="edition__svg edition__svg--decrease">
          <use href="assets/svg/icons.svg#down-arrow"></use>
        </svg>
      </button>
      <button class="edition__button edition__button--increase edition__button--js-increase">
        <svg class="edition__svg edition__svg--increase">
          <use href="assets/svg/icons.svg#up-arrow"></use>
        </svg>
      </button>
      `
      : ''
      }      
      <button class="edition__button edition__button--cancel edition__button--js-cancel">
        <svg class="edition__svg edition__svg--cancel">
          <use href="assets/svg/icons.svg#back-arrow"></use>
        </svg>
      </button>
      <button class="edition__button edition__button--save edition__button--js-save">
        <svg class="edition__svg edition__svg--save">
          <use href="assets/svg/icons.svg#save-icon"></use>
        </svg>
      </button>
    </div>
  `;
}
//// ARCHIVE TAB                                                           ////
//| RETURN ARCHIVE ENTRY HTML CODE                                          |//
const getEntryHtml = (index) => {

  const { date, day, id, value } = hydrappJson.entries[index];
  const dateId = date.split(' ').join('-');
  return `
    <li class="entry entry--js dateId-${dateId}">
      <header class="entry__header entry__header--js">
        <p class="entry__heading entry__heading--day">${day}</p>
        <p class="entry__heading entry__heading--date entry__heading--js-date">${date}</p>
      </header>
      <span class="entry__value entry__value--js">${value}</span>
      ${getEditionHtml('archive')}
      ${getEmojiHtml(id)}
    </li>
  `;
}
//| SET ARCHIVE                                                             |//
const setArchiveDOM = () => {

  const { entries } = hydrappJson;
  for (let i = 0; i < entries.length; i++) {
    addArchiveEntry(i);
  }
  //: set the newest week as visible                                        ://
  weeks = document.querySelectorAll('.card--js-week');
  weekLists = document.querySelectorAll('.card__list--js-week');
  weeks[currentWeekIndex].classList.add('card--visible');
  //: add 'remove entry' button on the last entry                           ://
  handleArchiveLastEntry();
  //: generate indicators for new entry mode                                ://
  const emojiContainer = document.querySelector('.emoji--js-new');
  emojiContainer.innerHTML = getEmojiHtml('new');
  handleEmoji('new', 0);
}
//| ADD ARCHIVE NODE                                                        |//
const addArchiveEntry = (index, option) => {
  const {value, id, day} = hydrappJson.entries[index];
  const weekHtml = getCardHtml('week');
  const entryHtml = getEntryHtml(index);
  //: function adding new week DOM node                                     ://
  const addWeek = () => {
    archiveContainer.insertAdjacentHTML('beforeend', weekHtml);
    const lastWeek = archiveContainer.lastElementChild;
    const lastWeekHeader = lastWeek.querySelector('.card__header---js-week');
    lastWeekHeader.addEventListener('click', slideWeek);
    weekLists = document.querySelectorAll('.card__list--js-week');
  }
  //: add new week                                                          ://
  if (((day === 'sunday' || index === 0)) && option !== 'add') addWeek();
  //: add next day entry                                                    ://
  const lastWeekList = weekLists[weekLists.length - 1];
  lastWeekList.insertAdjacentHTML('beforeend', entryHtml);
  handleEmoji(id, value);
  //: add 'add entry button at the end                                      ://
  if (index === hydrappJson.entries.length - 1) {
    if (day === 'monday') addWeek();
    const lastWeekList = weekLists[weekLists.length - 1];
    lastWeekList.appendChild(addEntryButton);
  }
  updateWeekHeading();
  //: add event listeners to all edit buttons                               ://
  const editButtons = document.querySelectorAll('.edition__button--js-edit');
  const editButton = editButtons[index];
  editButton.index = index;
  editButton.addEventListener('click', handleEntryEdit);
}
//| SET WEEK HEADING                                                        |//
const updateWeekHeading = () => {
  weekLists = document.querySelectorAll('.card__list--js-week');
  const weekHeadings = document.querySelectorAll('.card__heading--js-week');
  //: GET DATE                                                              ://
  const getDate = (element) => {
    const dateId = element.className.split(' ').filter(a => /dateId-/.test(a));
    return dateId.toString().replace(/dateId-/,'').split('-').join('.');
  }
  //: SET BUTTONS VISIBILITY                                                ://
  const setButtonsVisiblity = (index, option) => {
    const prevWeekButton = document.querySelectorAll('.card__button--js-weekPrev')[index];
    const nextWeekButton = document.querySelectorAll('.card__button--js-weekNext')[index];
    switch (index) {
      case 0:
        prevWeekButton.classList.remove('card__button--visible');
        option === 'oneWeek'
        ? nextWeekButton.classList.remove('card__button--visible')
        : nextWeekButton.classList.add('card__button--visible');
        break;
      
      case weekHeadings.length - 1:
        prevWeekButton.classList.add('card__button--visible');
        nextWeekButton.classList.remove('card__button--visible');
        break;

      default:
        prevWeekButton.classList.add('card__button--visible');
        nextWeekButton.classList.add('card__button--visible');
        break;
    }
  }
  for (let i = 0; i < weekLists.length; i++) {
    const entries = weekLists[i].querySelectorAll('.entry--js');
    const heading = weekHeadings[i];
    
    if (entries.length === 0) {
      heading.textContent = 'New Week';
    } else {
      const currentWeekFirstEntry = entries[entries.length - 1];
      const currentWeekLastEntry = entries[0];
      const startDate = getDate(currentWeekFirstEntry);
      const endDate = getDate(currentWeekLastEntry);
  
      heading.textContent = startDate === endDate
      ? startDate
      : `${startDate.slice(0,5)} - ${endDate}`;
    }
    weekLists.length > 1 ? setButtonsVisiblity(i) : setButtonsVisiblity(i, 'oneWeek');
  }
}
//| SLIDE WEEK                                                              |//
const slideWeek = (e) => {
  const self = e.keyCode || e.target;
  const prevWeekButton = document.querySelectorAll('.card__button--js-weekPrev')[currentWeekIndex];
  const nextWeekButton = document.querySelectorAll('.card__button--js-weekNext')[currentWeekIndex];
  const weeksAmount = archiveContainer.children.length;

  const handleSlide = (direction) => {
    //: handle previous section                                             ://
    archiveContainer.children[currentWeekIndex].className = `card card--week card--js-week card--slide-out-to-${direction === 'toLeft' ? 'right' : 'left'}`;
    const previousWeekIndex = currentWeekIndex;
    //: change index                                                        ://
    currentWeekIndex = limit(archiveContainer.children.length - 1, currentWeekIndex, direction === 'toLeft' ? 'decrease' : 'increase');
    //: handle next section                                                 ://
    if (currentWeekIndex !== previousWeekIndex) {
      archiveContainer.children[currentWeekIndex].classList = `card card--week card--js-week card--visible card--slide-in-from-${direction === 'toLeft' ? 'left' : 'right'}`;
    } else {
      archiveContainer.children[currentWeekIndex].classList = 'card card--week card--js-week card--visible';
    }
  }

  if (weeksAmount > 1) {
    switch (self) {
      case 37:
      case prevWeekButton:
        handleSlide('toLeft');
        break;
      case 39:
      case nextWeekButton:
        handleSlide('toRight');
        break;
    }
    handleContainerHeight(archiveContainer, weeks[currentWeekIndex]);
    //entriesFade('in');
  }
}
//// STATS TAB                                                             ////
//| SET STATS DOM STRUCTURE BASED ON USER'S JSON OBJECT                     |//
const setStatsDOM = () => {

  addStatsUser();


}
//| ADD USER STATS                                                          |//
const addUserStats = () => {
  /* const {value, id, day} = hydrappJson.entries[index];
  const weekHtml = getCardHtml('week');
  const entryHtml = getEntryHtml(index); */
  //: function adding new week DOM node                                     ://
  /* const addWeek = () => {
    archiveContainer.insertAdjacentHTML('beforeend', weekHtml);
    const lastWeek = archiveContainer.lastElementChild;
    const lastWeekHeader = lastWeek.querySelector('.card__header---js-week');
    lastWeekHeader.addEventListener('click', slideWeek);
    weekLists = document.querySelectorAll('.card__list--js-week');
  } */
  //: add new week                                                          ://
  //if (((day === 'sunday' || index === 0)) && option !== 'add') addWeek();
  //: add next day entry                                                    ://
  /* const lastWeekList = weekLists[weekLists.length - 1];
  lastWeekList.insertAdjacentHTML('beforeend', entryHtml);
  handleEmoji(id, value); */
  //: add 'add entry button at the end                                      ://
  /* if (index === hydrappJson.entries.length - 1) {
    if (day === 'monday') addWeek();
    const lastWeekList = weekLists[weekLists.length - 1];
    lastWeekList.appendChild(addEntryButton);
  }
  updateWeekHeading(); */
  //: add event listeners to all edit buttons                               ://
  /* const editButtons = document.querySelectorAll('.edition__button--js-edit');
  const editButton = editButtons[index];
  editButton.index = index;
  editButton.addEventListener('click', handleEntryEdit); */
}
//// ENTRY HANDLERS                                                        ////
//| CREATE 'REMOVE ITEM' BUTTON                                             |//
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
//| CREATE ADD ENTRY BUTTON                                                 |//
const createAddEntryButton = () => {
  const addEntryButton = document.createElement('li');
  addEntryButton.className = 'entry entry__add';
  addEntryButton.innerHTML = `
    <button class="entry__button entry__button--add entry__button--js-add">
      Add previous day..
    </button>
  `;
  addEntryButton.addEventListener('click', enterNewEntryValue);
  return addEntryButton;
}
//| ARCHIVE MODAL                                                           |//
const enterNewEntryValue = (e) => {
  const self = e.keyCode || e.target || e;                // ! e only for tests
  const addEntryButton = document.querySelector('.entry__button--js-add');
  //: find date for display                                                 ://
  const displayDate = new Date();
  let displayDateId = getDateId(displayDate);
  const { entries, waterMax } = hydrappJson;
  const oldestEntryIndex = entries.length - 1;
  const oldestEntryDateId = entries[oldestEntryIndex].id;
  while (displayDateId !== oldestEntryDateId) {
    displayDate.setDate(displayDate.getDate() - 1);
    displayDateId = getDateId(displayDate);
  }
  displayDate.setDate(displayDate.getDate() - 1);
  //: create new Entry object                                               ://
  const newEntry = new Entry(displayDate);
  const { day, date } = newEntry;

  if (self === 107 || self === addEntryButton) {
    let value = 0;
    newEntryMode.classList.add('newEntry--visible');
    newEntryValue.textContent = value;
    newEntryDay.textContent = day;
    newEntryDate.textContent = date;
  
    const modeOff = () => {
      newEntryMode.classList.remove('newEntry--visible');
      newEntryMode.removeEventListener('click', handleValue);
      window.removeEventListener('keydown', handleValue);
      window.addEventListener('keydown', enterNewEntryValue);
      window.addEventListener('keydown', slideWeek);
    }
  
    const handleValue = (e) => {
      const self = e.keyCode || e.target;
      switch (self) {
  
        case 37:
        case newEntryDecrease:
          if (value > 0) {
            value--;
            newEntry.value--;
            newEntryValue.textContent = value;
            handleEmoji('new', value);
          }
          break;

        case 39:
        case newEntryIncrease:
          if (value < waterMax) {
            value++;
            newEntry.value++;
            newEntryValue.textContent = value;
            handleEmoji('new', value);
          }
          break;
  
        case 27:
        case newEntryCancel:
          modeOff();
          break;
  
        case 13:
        case newEntrySave:
          e.preventDefault();
          addNewEntry(newEntry);
          modeOff();
          break;
      }
    }
    newEntryMode.addEventListener('click', handleValue);
    window.addEventListener('keydown', handleValue);
    window.removeEventListener('keydown', enterNewEntryValue);
    window.removeEventListener('keydown', slideWeek);
  }
}
//| ADD NEW ENTRY                                                           |//
const addNewEntry = (entry) => {

  let lastEntryIndex = hydrappJson.entries.length - 1;
  let lastEntry = document.querySelectorAll('.entry--js')[lastEntryIndex];
  lastEntry.classList.remove('entry--last');
  
  //: handle local storage and array of objects                           ://
  const { entries } = hydrappJson;
  hydrappJson.entries = [...entries, entry];

  //: create new entry node                                               ://
  lastEntryIndex = hydrappJson.entries.length - 1;
  addArchiveEntry(lastEntryIndex, 'add');
  lastEntry = document.querySelectorAll('.entry--js')[lastEntryIndex];
  lastEntry.classList.add('entry--visible');
  lastEntry.classList.add('entry--fadeIn');
  //: jump to the last week                                               ://
  weeks = archiveContainer.children;
  const currentWeek = weeks[currentWeekIndex];
  const lastWeekIndex = weeks.length - 1;
  const lastWeek = weeks[lastWeekIndex];
  if (currentWeekIndex !== lastWeekIndex) {
    currentWeekIndex = lastWeekIndex;
    currentWeek.className = 'week card--js-week week--slide-out-to-left';
    lastWeek.className = 'week card--js-week week--visible week--slide-in-from-right';
  }
  handleContainerHeight(archiveContainer, lastWeek);
  handleArchiveLastEntry();
  updateWeekHeading();
  handleWaterAverage();
}
//| ADJUST LAST ITEM OF LIST AND REMOVE BUTTON                              |//
const handleArchiveLastEntry = () => {
  const entries = document.querySelectorAll('.entry--js');
  const lastEntry = entries[entries.length - 1];
  const lastEntryValueNode = lastEntry.querySelector('.entry__value--js');

  if (entries.length > 1) {
    lastEntry.insertBefore(removeEntryButton, lastEntryValueNode);
    lastEntry.classList.add('entry--last');
  }
}
//| REMOVE LAST ITEM                                                        |//
const removeLastEntry = (e) => {
  const self = e.keyCode || e. target;
  const { entries } = hydrappJson;
  const lastEntryIndex = entries.length - 1;
  const {day, key} = entries[lastEntryIndex];
  const lastEntryNode = document.querySelectorAll('.entry--js')[lastEntryIndex];
  let lastWeek = weeks[weeks.length - 1];

  if (self === 109 || self === removeEntryButton) {

    if (entries.length > 1) {
      hydrappJson.entries = [...entries]
      .filter((entry, index) => index !== lastEntryIndex);
      exportJsonToLS('Jakub');
      lastEntryNode.parentNode.removeChild(lastEntryNode);

      //: removing last week section after deleting last day of that week   ://
      if (day === 'monday') {
        const weekToRemove = archiveContainer.lastElementChild;
        const ifVisible = weekToRemove.classList.contains('week--visible');
        archiveContainer.removeChild(archiveContainer.lastElementChild);
        lastWeek = archiveContainer.lastElementChild;
        if (ifVisible) {
          lastWeek.className = 'week card--js-week week--visible week--slide-in-from-left';currentWeekIndex--;
        }
        const weekLists = document.querySelectorAll('.card__list--js-week');
        const lastWeekList = weekLists[weekLists.length - 1];
        lastWeekList.appendChild(addEntryButton);
      }
      lastWeek = archiveContainer.lastElementChild;
      //: add remove button on current last item                            ://
      handleArchiveLastEntry();
      updateWeekHeading();
      handleContainerHeight(archiveContainer, lastWeek);
      handleWaterAverage();
    }
  }
}
//| HANDLE ITEM EDIT                                                        |//
const handleEntryEdit = (e) => {
  const itemIndex = e.target.index;
  const entry = document.querySelectorAll('.entry--js')[itemIndex];
  const entryHeader = document.querySelectorAll('.entry__header--js')[itemIndex];
  const entryValue = document.querySelectorAll('.entry__value--js')[itemIndex];
  const editSection = document.querySelectorAll('.edition--js')[itemIndex];
  const decreaseButton = document.querySelectorAll('.edition__button--js-decrease')[itemIndex];
  const increaseButton = document.querySelectorAll('.edition__button--js-increase')[itemIndex];
  const cancelButton = document.querySelectorAll('.edition__button--js-cancel')[itemIndex];
  const saveButton = document.querySelectorAll('.edition__button--js-save')[itemIndex];

  //: TOGGLE ITEM DISPLAY                                                   ://
  const toggleItemDisplay = () => {
    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
    entry.classList.toggle('entry--edit-mode');
    entryHeader.classList.toggle('entry__header--edit-mode');

    itemIndex === hydrappJson.entries.length - 1
    ? removeEntryButton.classList.toggle('entry__remove--hidden')
    : false;
  }
  //: EXIT EDIT MODE                                                        ://
  const exitEditMode = () => {
    const {value, id} = hydrappJson.entries[itemIndex];
    
    toggleItemDisplay();
    entryValue.textContent = value;
    handleEmoji(id, value);

    window.removeEventListener('click', handleEdition);
    window.removeEventListener('keydown', handleEdition);
    window.addEventListener('keydown', slideWeek);
  }
  //: HANDLE EDITION                                                        ://
  const handleEdition = (e) => {
    const self = e.keyCode || e.target;
    let dayValue = parseInt(entryValue.textContent);
    const { waterMax } = hydrappJson;
    const { id, value } = hydrappJson.entries[itemIndex];

    switch (self) {

      case 40:
      case decreaseButton:
        dayValue > 0 ? dayValue-- : false;
        entryValue.textContent = dayValue;
        handleEmoji(id, dayValue);
      break;
      
      case 38:
      case increaseButton:
        dayValue < waterMax ? dayValue++ : false;
        entryValue.textContent = dayValue;
        handleEmoji(id, dayValue);
      break;

      case 27:
      case cancelButton:
        exitEditMode();
      break;

      case 13:
      case saveButton:
        if (itemIndex === 0) {
          handleCounter(value, dayValue);
          handleWaterLevel(dayValue);
          handleWaterShake();
          handleCounterMessage(dayValue);
          handleEmoji('controls', dayValue);
        }
        hydrappJson.entries[itemIndex].value = dayValue;
        exportJsonToLS('Jakub');
        handleWaterAverage();
        exitEditMode();
      break;
    }
  }
  //: FUNCTION CALLS                                                        ://
  toggleItemDisplay();
  window.addEventListener('click', handleEdition);
  window.addEventListener('keydown', handleEdition);
  window.removeEventListener('keydown', slideWeek);
}
//| ANIMATE WEEK ENTRIES                                                    |//
const entriesFade = (action) => {
  const currentWeekList = weekLists[currentWeekIndex];
  let delay = 0;

  if (action === 'in') {
    [...currentWeekList.children].forEach(elem => {
      elem.classList.add('entry--visible');
      elem.style.transitionDelay = `${delay}s`;
      delay += 0.1;
    });

  } else if (action === 'out') {
    [...currentWeekList.children].reverse().forEach(elem => {
      elem.classList.remove('entry--visible');
      elem.style.transitionDelay = 0;
    });
  }
}
//| END OF HANDLE ITEM EDIT                                                 |//

//| VARIABLES                                                               |//
////                                                                       ////
//: MEDIA                                                                   ://
const mediaMd = 768;
const mediaLg = 1200;
//: APP                                                                     ://
const appHeader = document.querySelector('.app__header--js');
const appUser = document.querySelector('.app__user--js');
const appLanding = document.querySelector('.app__landing--js');
const appSidebar = document.querySelector('.app__sidebar--js');
//: COUNTER                                                                 ://
const counter = document.querySelector('.counter--js');
const counterPrevTenths = document.querySelector('.digit__svg--js-prevTenths');
const counterNextTenths = document.querySelector('.digit__svg--js-nextTenths');
const counterPrevOnes = document.querySelector('.digit__svg--js-prevOnes');
const counterNextOnes = document.querySelector('.digit__svg--js-nextOnes');
const counterDay = document.querySelector('.counter__day--js');
const counterDate = document.querySelector('.counter__date--js');
const counterMessage = document.querySelector('.counter__message--js');
//: CONTROLS                                                                ://
const controls = document.querySelector('.controls--js');
const addBtn = document.querySelector('.button--js-add');
const removeBtn = document.querySelector('.button--js-remove');
const emoji = document.querySelector('.emoji--js-controls');
const emojiAmount = 8;
//: WATER                                                                   ://
const water = document.querySelector('.water--js');
const wavesContainer = document.querySelector('.waves--js');
const waves = document.querySelectorAll('.wave--js');
let wavesAmount = 2;
let wavesShakeTimeoutId = null;
let wavesIntervalId = null;
let wavesTimeoutId = null;
const measure = document.querySelector('.graph__measure--js');
const levelAvg = document.querySelector('.graph__level--js-avg');
const levelMin = document.querySelector('.graph__level--js-min');
//: MENU                                                                    ://
const burgerBtn = document.querySelector('.button--js-burger');
//: SIDEBAR                                                                 ://
const archiveTabButton = document.querySelector('.tab__button--js-archive');
const statsTabButton = document.querySelector('.tab__button--js-stats');
const settingTabButton = document.querySelector('.tab__button--js-settings');
//: ARCHIVE                                                                 ://
const archiveContainer = document.querySelector('.tab__container--js-archive');
let weeks = null;
let weekLists = null;
const addEntryButton = createAddEntryButton();
const removeEntryButton = createRemoveEntryButton();
let currentWeekIndex = 0;
//: STATS                                                                   ://
const statsContent = document.querySelector('.stats--js');



//: NEW ENTRY                                                               ://
const newEntryMode = document.querySelector('.newEntry--js');
const newEntryValue = document.querySelector('.newEntry__value--js');
const newEntryDay = document.querySelector('.newEntry__day--js');
const newEntryDate = document.querySelector('.newEntry__date--js');
const newEntryDecrease = document.querySelector('.newEntry__button--js-decrease');
const newEntryIncrease = document.querySelector('.newEntry__button--js-increase');
const newEntryCancel = document.querySelector('.newEntry__button--js-cancel');
const newEntrySave = document.querySelector('.newEntry__button--js-save');
//: STATS                                                                   ://
const statsContainer = document.querySelector('.tab__container--js-stats');
//: SETTINGS                                                                ://
const settingsContainer = document.querySelector('.tab__container--js-settings');

////                                                                       ////
const weekDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
let hydrappJson = {};
//| CLASS FOR ENTRY                                                         |//
class Entry {
  constructor(date) {
    this.value = 0;
    //this.dateObj = date;
    this._date = date;
    this._id = this.date;
    this._day = date;
  }
  /* get _dateObj() {
    return this.dateObj;
  }
  set _dateObj(date) {
    this.dateObj = getOffsetedDate(date);
  } */
  get _date() {
    return this.date;
  }
  set _date(date) {
    this.date = getOffsetedDate(date)
    .toISOString()
    .slice(0,10)
    .split('-')
    .reverse()
    .join(' ');
  }
  get _id() {
    return this.id;
  }
  set _id(date) {
    this.id = date.replace(/\s/g,'');
  }
  get _day() {
    return this.day;
  }
  set _day(date) {
    const dayIndex = date.getDay();
    this.day = weekDay[dayIndex];
  }
}
//| FUNCTION CALLS                                                          |//
////                                                                       ////
/* const date = new Date();
const testEntry = new Entry(date);
console.log('testEntry', testEntry); */

const hydrappUser = localStorage.getItem('hydrapp-Jakub');
if (hydrappUser) {
  hydrappJson = JSON.parse(hydrappUser);
  loadApp();
} else {
  createUser();
}


toggleSidebar(burgerBtn);                                 // ! FOR TESTS ONLY
//enterNewEntryValue(107);                                  // ! FOR TESTS ONLY

//| VARIABLES                                                               |//
let editButtons = document.querySelectorAll('.edition__button--js-edit');
let entries = document.querySelectorAll('.entry--js');
//| EVENT LISTENERS                                                         |//
////                                                                       ////
controls.addEventListener('click', handleWaterChange);
window.addEventListener('resize', handleWindowResize);
burgerBtn.addEventListener('click', toggleSidebar);
appSidebar.addEventListener('click', toggleSidebarTabs);