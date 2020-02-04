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
const setDateKey = (obj) => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  let dateObj = obj || new Date();
  dateObj = (new Date(dateObj - timeZoneOffset));

  const prefix = 'hydrApp-';
  const dateStr = dateObj.toISOString().slice(0,10);
  return prefix.concat(dateStr);
}
//| CREATE ARRAY OF HYDRAPP LOCAL STORAGE KEYS                              |//
const getHydrappKeys = () => {
  const regex = /hydrApp-/;
  return Object
  .keys(localStorage)
  .filter(key => regex.test(key))
  .sort()
  .reverse();
}
//| CREATE KEY VALUE PAIR IN LOCAL STORAGE                                  |//
const setNewKeyValue = (key, value) => {
  if ( !localStorage.getItem(key) ) {
    localStorage.setItem(key, value);
  };
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
//| GET EMOJIS HTML STRING                                                  |//
const getEmojiHtml = (id) => {
  let emojiHtml = '';

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
  return emojiHtml;
}
//| SET LOCAL STORAGE                                                       |//
const setData = () => {
  const date = new Date();
  let dateKey = setDateKey(date);
  setNewKeyValue(dateKey, 0);
  let hydrappKeys = getHydrappKeys();
  const oldestKey = hydrappKeys[hydrappKeys.length - 1];
  //: create object for each key                                            ://
  const createEntryObject = (date) => {
    const newEntry = new Entry(date);
    hydrappArray.push(newEntry);
  }
  //: first object of array                                                 ://
  createEntryObject(date);
  //: autocomplete the rest of keys if needed                               ://
  while (dateKey !== oldestKey) {
    dateKey = setDateKey(date.setDate(date.getDate() - 1));
    lastEntryDate.setDate(lastEntryDate.getDate() - 1);
    setNewKeyValue(dateKey, 0);
    createEntryObject(date);
  }
  // to update
  // handleWaterChange('displayValue');
}
//| HANDLE ELEMENTS ON WINDOW RESIZE                                        |//
const handleWindowResize = () => {
  const waterValue = hydrappArray[0].value;
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
//// APP MAIN SECTION                                                      ////
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
  const self = e.target || e;
  const key = setDateKey();
  let value = parseInt(hydrappArray[0].value);
  const firstEntryValue = document.querySelector('.entry__value--js');

  //. if add button clicked                                               .//
  if (self === addBtn) {
    if (value >= waterMax) return;
    handleCounter(value, ++value);

  //. if remove button clicked                                            .//
  } else if (self === removeBtn) {
    if (value <= 0) return;
    handleCounter(value, --value);
  }
  localStorage.setItem(key, value);
  hydrappArray[0].value = key;
  handleWaterLevel(value);
  handleWaterShake();
  handleCounterMessage(value);
  firstEntryValue.textContent = hydrappArray[0].value;
  handleEmoji('controls', value);
  handleEmoji(hydrappArray[0].id, value);
}
//| HANDLE WATER MEASURE APPEARANCE                                         |//
const handleWaterMeasure = () => {
  const headerHeight = appHeader.clientHeight;
  const interval = window.innerHeight / waterMax;

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
  wavesContainer.style.top = `${-1 * (size - 3)}px`;
}
//| HANDLE WATER LEVEL                                                      |//
const handleWaterLevel = (value) => {
  const windowHeight = window.innerHeight;
  const waterOffset = windowHeight / waterMax * (waterMax - value);
  const avgOffset = windowHeight / waterMax * (waterAvg);
  const minOffset = windowHeight / waterMax * (waterMin);

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
    } else if (digits === 'ones') {
      counterNextOnes.classList.remove('digit__svg--animateIn');
      counterNextOnes.classList.remove('digit__svg--animateOut');
    }
  } 

  if (newTenthsValue > currentTenthsValue) {

    counterNextTenths.firstElementChild.setAttribute('href', newTenthsHref);
    counterPrevTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    counterNextTenths.classList.add('digit__svg--rotated');
    removeAnimations('tenths');

    const timeoutId = setTimeout(() => {
      counterNextTenths.classList.remove('digit__svg--rotated');
      counterNextTenths.classList.add('digit__svg--animateIn');
      clearTimeout(timeoutId);
    }, tenthsTimeout);

  } else if (newTenthsValue < currentTenthsValue) {

    counterNextTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    counterPrevTenths.firstElementChild.setAttribute('href', newTenthsHref);
    counterNextTenths.classList.remove('digit__svg--rotated');
    removeAnimations('tenths');

    const timeoutId = setTimeout(() => {
      counterNextTenths.classList.add('digit__svg--rotated');
      counterNextTenths.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, tenthsTimeout);
  }

  if (newValue > currentValue
  && (newOnesValue > currentOnesValue || newOnesValue === 0)) {

    counterNextOnes.firstElementChild.setAttribute('href', newOnesHref);
    counterPrevOnes.firstElementChild.setAttribute('href', currentOnesHref);
    counterNextOnes.classList.add('digit__svg--rotated');
    removeAnimations('ones');

    const timeoutId = setTimeout(() => {
      counterNextOnes.classList.remove('digit__svg--rotated');
      counterNextOnes.classList.add('digit__svg--animateIn');
      clearTimeout(timeoutId);
    }, onesTimeout);
    

  } else if (newValue < currentValue
  && newOnesValue < currentOnesValue || currentOnesValue === 0) {
        
    counterNextOnes.firstElementChild.setAttribute('href', currentOnesHref);
    counterPrevOnes.firstElementChild.setAttribute('href', newOnesHref);
    counterNextOnes.classList.remove('digit__svg--rotated');
    removeAnimations('ones');
    
    const timeoutId = setTimeout(() => {
      counterNextOnes.classList.add('digit__svg--rotated');
      counterNextOnes.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, onesTimeout);
  }
}
//| HANDLE MESSAGE DEPENDING ON AMOUNT OF CONSUMED WATER                    |//
const handleCounterMessage = (value) => {  
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

  const { day, date } = hydrappArray[0];

  counterDay.innerHTML = day;
  counterDate.innerHTML = date.slice().split(' ').join('.');



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
//// ARCHIVE TAB                                                           ////
//| SET ARCHIVE                                                             |//
const setArchiveDOM = () => {
  for (let i = 0; i < hydrappArray.length; i++) {
    addArchiveEntry(i);
  }
  //: set the newest week as visible                                        ://
  weeks = document.querySelectorAll('.week--js');
  weekLists = document.querySelectorAll('.week__list--js');
  weeks[currentWeekIndex].classList.add('week--visible');
  //: add 'remove entry' button on the last entry                           ://
  handleArchiveLastEntry();
  //: generate indicators for new entry mode                                ://
  const emojiContainer = document.querySelector('.emoji--js-new');
  emojiContainer.innerHTML = getEmojiHtml('new');
  handleEmoji('new', 0);
}
//| ADD ARCHIVE NODE                                                        |//
const addArchiveEntry = (index, option) => {
  const {value, id, day, dayHtml, weekHtml} = hydrappArray[index];
  //: function adding new week DOM node                                     ://
  const addWeek = () => {
    archiveContainer.insertAdjacentHTML('beforeend', weekHtml);
    const lastWeek = archiveContainer.lastElementChild;
    const lastWeekHeader = lastWeek.querySelector('.week__header--js');
    lastWeekHeader.addEventListener('click', slideWeek);
    weekLists = document.querySelectorAll('.week__list--js');
  }
  //: add new week                                                          ://
  if (((day === 'sunday' || index === 0)) && option !== 'add') addWeek();
  //: add next day entry                                                    ://
  const lastWeekList = weekLists[weekLists.length - 1];
  lastWeekList.insertAdjacentHTML('beforeend', dayHtml);
  handleEmoji(id, value);
  //: add 'add entry button at the end                                      ://
  if (index === hydrappArray.length - 1) {
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
  weekLists = document.querySelectorAll('.week__list--js');
  const weekHeadings = document.querySelectorAll('.week__heading--js');
  //: GET DATE                                                              ://
  const getDate = (element) => {
    if (element) {
      const filtered = element.className.split(' ').filter(a => /hydrApp/.test(a));
      return filtered.toString().slice(10).split('-').reverse().join('.');
    } else {
      return false;
    }
  }
  //: SET BUTTONS VISIBILITY                                                ://
  const setButtonsVisiblity = (index, option) => {
    const prevWeekButton = document.querySelectorAll('.week__button--js-prev')[index];
    const nextWeekButton = document.querySelectorAll('.week__button--js-next')[index];
    switch (index) {
      case 0:
        prevWeekButton.classList.remove('week__button--visible');
        option === 'oneWeek'
        ? nextWeekButton.classList.remove('week__button--visible')
        : nextWeekButton.classList.add('week__button--visible');
        break;
      
      case weekHeadings.length - 1:
        prevWeekButton.classList.add('week__button--visible');
        nextWeekButton.classList.remove('week__button--visible');
        break;

      default:
        prevWeekButton.classList.add('week__button--visible');
        nextWeekButton.classList.add('week__button--visible');
        break;
    }
  }

  for (let i = 0; i < weekLists.length; i++) {
    const entries = weekLists[i].querySelectorAll('.entry--js');
    const startDate = getDate(entries[entries.length - 1]);
    const endDate = getDate(entries[0]);
    const heading = weekHeadings[i];

    heading.textContent = `${startDate
    ? (startDate === endDate ? startDate : `${startDate.slice(0,5)} - ${endDate}`)
    : 'New Week'}`;
    weekLists.length > 1 ? setButtonsVisiblity(i) : setButtonsVisiblity(i, 'oneWeek');
  }
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
//| SLIDE WEEK                                                              |//
const slideWeek = (e) => {
  const self = e.keyCode || e.target;
  const prevWeekButton = document.querySelectorAll('.week__button--js-prev')[currentWeekIndex];
  const nextWeekButton = document.querySelectorAll('.week__button--js-next')[currentWeekIndex];
  const weeksAmount = archiveContainer.children.length;

  const handleSlide = (direction) => {
    //: handle previous section                                             ://
    archiveContainer.children[currentWeekIndex].className = `week week--js week--slide-out-to-${direction === 'toLeft' ? 'right' : 'left'}`;
    const previousWeekIndex = currentWeekIndex;
    //: change index                                                        ://
    currentWeekIndex = limit(archiveContainer.children.length - 1, currentWeekIndex, direction === 'toLeft' ? 'decrease' : 'increase');
    //: handle next section                                                 ://
    if (currentWeekIndex !== previousWeekIndex) {
      archiveContainer.children[currentWeekIndex].classList = `week week--js week--visible week--slide-in-from-${direction === 'toLeft' ? 'left' : 'right'}`;
    } else {
      archiveContainer.children[currentWeekIndex].classList = 'week week--js week--visible';
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
    entriesFade('in');
  }
}
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
  //: set day and date for display                                          ://
  const displayDate = new Date();
  const lastEntryKey = hydrappArray[hydrappArray.length - 1].key;
                                   
  while (setDateKey(displayDate) !== lastEntryKey) {
    displayDate.setDate(displayDate.getDate() - 1);
  }
  displayDate.setDate(displayDate.getDate() - 1);

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
          value !== 0 ? value-- : false;
          newEntryValue.textContent = value;
          handleEmoji('new', value);
          break;

        case 39:
        case newEntryIncrease:
          value !== waterMax ? value++ : false;
          newEntryValue.textContent = value;
          handleEmoji('new', value);
          break;
  
        case 27:
        case newEntryCancel:
          modeOff();
          break;
  
        case 13:
        case newEntrySave:
          e.preventDefault();
          addNewEntry(value);
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
const addNewEntry = (value) => {

  let lastEntryIndex = hydrappArray.length - 1;
  let lastEntry = document.querySelectorAll('.entry--js')[lastEntryIndex];
  lastEntry.classList.remove('entry--last');

  lastEntryDate.setDate(lastEntryDate.getDate() - 1);
  const newEntryKey = setDateKey(lastEntryDate);
  
  //: handle local storage and array of objects                           ://
  setNewKeyValue(newEntryKey, value);
  const newEntry = new Entry(lastEntryDate);
  newEntry.value = newEntryKey;
  hydrappArray = [...hydrappArray, newEntry];

  //: create new entry node                                               ://
  lastEntryIndex = hydrappArray.length - 1;
  addArchiveEntry(lastEntryIndex, 'add');
  lastEntry = document.querySelectorAll('.entry--js')[lastEntryIndex];
  lastEntry.classList.add('entry--visible');
  lastEntry.classList.add('entry--fadeIn');
  //: jump to the last week                                               ://
  weeks = archiveContainer.children;
  const currentWeek = weeks[currentWeekIndex];
  console.log('weeks', weeks);
  const lastWeekIndex = weeks.length - 1;
  const lastWeek = weeks[lastWeekIndex];
  if (currentWeekIndex !== lastWeekIndex) {
    currentWeekIndex = lastWeekIndex;
    currentWeek.className = 'week week--js week--slide-out-to-left';
    lastWeek.className = 'week week--js week--visible week--slide-in-from-right';
  }
  handleContainerHeight(archiveContainer, lastWeek);
  handleArchiveLastEntry();
  updateWeekHeading();
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
//| REMOVE LAST ITEM << SHOW ARCHIVE                                        |//
const removeLastEntry = (e) => {
  const self = e.keyCode || e. target;
  const lastEntryIndex = hydrappArray.length - 1;
  const {day, key} = hydrappArray[lastEntryIndex];
  const lastEntryNode = document.querySelectorAll('.entry--js')[lastEntryIndex];
  let lastWeek = weeks[weeks.length - 1];

  if (self === 109 || self === removeEntryButton) {

    if (hydrappArray.length > 1) {
      hydrappArray.pop();
      localStorage.removeItem(key);
      lastEntryDate.setDate(lastEntryDate.getDate() + 1);
      lastEntryNode.parentNode.removeChild(lastEntryNode);
      //: removing last week section after deleting last day of that week   ://
      if (day === 'monday') {
        const weekToRemove = archiveContainer.lastElementChild;
        const ifVisible = weekToRemove.classList.contains('week--visible');
        archiveContainer.removeChild(archiveContainer.lastElementChild);
        lastWeek = archiveContainer.lastElementChild;
        const lastWeekList = lastWeek.lastElementChild;
        if (ifVisible) {
          lastWeek.className = 'week week--js week--visible week--slide-in-from-left';currentWeekIndex--;
        }
        lastWeekList.appendChild(addEntryButton);
      }
      //: add remove button on current last item                            ://
      handleArchiveLastEntry();
      updateWeekHeading();
      handleContainerHeight(archiveContainer, lastWeek);
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

    itemIndex === hydrappArray.length - 1
    ? removeEntryButton.classList.toggle('entry__remove--hidden')
    : false;
  }
  //: EXIT EDIT MODE                                                        ://
  const exitEditMode = () => {
    const {value, id} = hydrappArray[itemIndex];
    
    toggleItemDisplay();
    entryValue.textContent = value;
    handleEmoji(id, value);

    archiveContainer.removeEventListener('click', handleEdition);
    archiveContainer.removeEventListener('keydown', handleEdition);
    window.addEventListener('keydown', slideWeek);
  }
  //: HANDLE EDITION                                                        ://
  const handleEdition = (e) => {
    const self = e.keyCode || e.target;
    let dayValue = parseInt(entryValue.textContent);

    // update main counter here
    //const glassCounter = document.querySelector('.glass__counter--js');
    // update main counter here

    const {key, id} = hydrappArray[itemIndex];

    switch (self) {

      case 40:
      case decreaseButton:
        //e.preventDefault();
        dayValue > 0 ? dayValue-- : false;
        entryValue.textContent = dayValue;
        handleEmoji(id, dayValue);
      break;
      
      case 38:
      case increaseButton:
        //e.preventDefault();
        dayValue < waterMax ? dayValue++ : false;
        entryValue.textContent = dayValue;
        handleEmoji(id, dayValue);
      break;

      case 27:
      case cancelButton:
        //e.preventDefault();
        exitEditMode();
      break;

      case 13:
      case saveButton:
        //e.preventDefault();
        handleCounter(hydrappArray[0].value, dayValue);
        //: change global values (must be after counter handler             ://
        //: which uses previous value before change                         ://
        localStorage.setItem(key, dayValue);
        hydrappArray[itemIndex].value = key;
        exitEditMode();
      break;
    }
  }
  //: FUNCTION CALLS                                                        ://
  toggleItemDisplay();
  archiveContainer.addEventListener('click', handleEdition);
  archiveContainer.addEventListener('keydown', handleEdition);
  window.removeEventListener('keydown', slideWeek);
}
//| END OF HANDLE ITEM EDIT                                                 |//

//| VARIABLES                                                               |//
////                                                                       ////
const appHeader = document.querySelector('.app__header--js');
const appLanding = document.querySelector('.app__landing--js');
//: MEDIA                                                                   ://
const mediaMd = 768;
const mediaLg = 1200;
//: WATER VALUE                                                             ://
const waterMax = 20;
let waterMin = 7;
let waterAvg = 12;
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
const appSidebar = document.querySelector('.app__sidebar--js');
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
let hydrappArray = [];
const lastEntryDate = new Date();
const weekDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
//| CLASS FOR ENTRY                                                         |//
class Entry {
  constructor(date) {
    this.key = setDateKey(date);
    this.value = this.key;
    this.date = date;
    this.id = this.date;
    this.day = date;

    this.weekHtml = `
      <section class="week week--js">
      <div class="week__container">
        <header class="week__header week__header--js">
          <button class="week__button week__button--prev week__button--js-prev">
            <svg class="week__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#left-arrow"></use>
            </svg>
          </button>
          <h3 class="week__heading week__heading--js">New week</h3>
          <button class="week__button week__button--next week__button--js-next">
            <svg class="week__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#right-arrow"></use>
            </svg>
          </button>
        </header>
        <ul class="week__list week__list--js"></ul>
      </div>
      </section>
    `;

    this.dayHtml = `
      <li class="entry entry--js ${this.key}">
        <header class="entry__header entry__header--js">
          <p class="entry__heading entry__heading--day">${this.day}</p>
          <p class="entry__heading entry__heading--date entry__heading--js-date">${this.date}</p>
        </header>
        <span class="entry__value entry__value--js">${this.value}</span>
        <div class="edition edition--js">
          <button class="edition__button edition__button--visible edition__button--edit edition__button--js-edit">
            <svg class="edition__svg edition__svg--edit">
              <use href="assets/svg/icons.svg#edit-mode"></use>
            </svg>
          </button>
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
        <div class="emoji emoji--js-${this.id}">
          ${getEmojiHtml(this.id)}
        </div>
      </li>
    `;
  }

  get value() {
    return this._value;
  }
  set value(key) {
    this._value = parseInt(localStorage.getItem(key));
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
}

//| FUNCTION CALLS                                                          |//
////                                                                       ////
setData();
setArchiveDOM();
setWaterMeasureDOM();
setWaterWaves(wavesAmount);
const startValue = hydrappArray[0].value;
const measureLevels = document.querySelectorAll('.measurePart--js');
handleCounter(startValue);
handleWaterLevel(startValue);
handleWaterShake();
handleWaterMeasure();
handleCounterMessage(startValue);
handleCounterDate();
emoji.innerHTML = getEmojiHtml('controls');
handleEmoji('controls', startValue);
updateWeekHeading();


toggleSidebar(burgerBtn);                           // ! FOR TESTS ONLY
//enterNewEntryValue(107);                                    // ! FOR TESTS ONLY

//| VARIABLES                                                               |//
let editButtons = document.querySelectorAll('.edition__button--js-edit');
let entries = document.querySelectorAll('.entry--js');
//| EVENT LISTENERS                                                         |//
////                                                                       ////
controls.addEventListener('click', handleWaterChange);
window.addEventListener('resize', handleWindowResize);
burgerBtn.addEventListener('click', toggleSidebar);
appSidebar.addEventListener('click', toggleSidebarTabs);