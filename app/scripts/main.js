'use strict';
//#region [ HorizonDark ] SERVICE WORKER
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
//#endregion

//#region [ HorizonDark ] HELPERS FUNCTIONS

const getFormattedString = (string) => string.replace(/\s/g,'_').toLowerCase();

const loopedRange = (max, num, action) => {
  action === 'increase' ? num >= max ? num = 0 : num++ : false;
  action === 'decrease' ? num <= 0 ? num = max : num-- : false;
  return num;
}

const limitedRange = (max, num, action) => {
  action === 'increase' ? num >= max ? false : num++ : false;
  action === 'decrease' ? num <= 0 ? false : num-- : false;
  return num;
}

const findFirstParentOfClass = (node, classname) => {
  while (!node.parentNode.classList.contains(classname)
  && node.parentNode.tagName !== 'HTML') node = node.parentNode;
  return node.parentNode;
}

const handleWindowResize = () => {
  const waterValue = hydrappUser.entries[0].value;
  handleWaterLevel(waterValue);
  handleWaterWaves(waterObj);
  handleWaterWaves(introObj);
  handleWaterMeasure();
}

const handleContainerHeight = (container, elements) => {
  const childrenArray = [...elements.children];
  const childrenHeight = childrenArray.reduce((a,b) => a + b.clientHeight, 0);
  container.style.height = `${childrenHeight}px`;
}

const handleContainerHeightThroughTime = (container, elements, time) => {
  const intervalId = setInterval(() => {
    handleContainerHeight(container, elements);
  }, 10);

  const timeoutId = setTimeout(() => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  }, time);
}

const getGlasses = (key, value) => {
  const glasses = key === 'waterMax' || key === 'waterMin' || key === 'waterAvg'
  ? `${value} ${value > 1 || value === 0 ? 'glasses' : 'glass'}`
  : value;
  return glasses;
}

const findUserPropsWithTag = (tag) => {
  const keys = Object.keys(hydrappUser);
  return [...keys]
  .filter(key => hydrappUser[key].tags)
  .filter(key => hydrappUser[key].tags.includes(tag));
}
//#endregion

//#region [ HorizonDark ] DATES

const getOffsetedDate = (obj) => {
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(obj - timeZoneOffset));
}

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
//#endregion

//#region [ HorizonDark ] INPUTS VALIDATION

const filterUserInput = (e) => {
  if (e.keyCode  === 13 || e.keyCode  === 27) return false;
  const self = e.target;
  const { value } = self;
  const filteredValue = value.match(/\d/g);
  const outputValue = filteredValue ? filteredValue.join('') : '';
  self.value = outputValue;
}

const handleInputAlert = (alertBox, prop, option) => {
  const alertText = alertBox.firstElementChild;
  let alertTextContent = '';

  if (!prop) {
    alertBox.style.height = '';
    alertText.textContent = '';
  } else {

    if (prop === 'login' && option === 'empty') {
      alertTextContent = 'Please enter your name'

    } else if (prop === 'login' && option === 'existing') {
      alertTextContent = 'This user name is already taken'

    } else {
      const userProp = hydrappUser[prop];
      const { min, max } = userProp;
      const label = prop === 'waterMax' ? userProp.alertLabel : userProp.label;
      alertTextContent = `${label} should be between ${min} and ${max}`;
    }  
    alertText.textContent = alertTextContent;
    alertBox.style.height = `${alertText.clientHeight}px`;
  }
}

const isInputValid = (input, prop, alertBox) => {
  const { value } = input;
  // check user login input
  if (prop === 'login') {
    // check if input is empty
    const isEmpty = value.slice().replace(/\s/g,'').length <= 0;
    // get new nameId
    const { nameId } = hydrappUser.login;
    const newNameId = getFormattedString(value);
    // exclude user's nameId when editing existing value
    const otherUsersNames = [...hydrappUsers]
    .map(({login}) => login.nameId)
    .filter(userNameId => userNameId !== nameId);
    // check if there is no the same user name existing
    const isExisting = [...otherUsersNames]
    .filter(userNameId => userNameId === newNameId).length > 0;

    if (isEmpty) {
      handleInputAlert(alertBox, prop, 'empty');
      return false;
    } else if (isExisting) {
      handleInputAlert(alertBox, prop, 'existing');
      return false;
    } else {
      handleInputAlert(alertBox);
      hydrappUser.login.nameId = newNameId;
      return true;
    }
  // check user's numerical inputs
  } else {
    const { min, max } = hydrappUser[prop];
    if (value < min || value > max) {
      handleInputAlert(alertBox, prop);
      input.focus();
      return false;
    } else {
      handleInputAlert(alertBox);
      return true;
    }
  }
}
//#endregion

//#region [ HorizonDark ] LOCAL STORAGE & JSON

const getHydrappUsers = () => {
  const regex = /hydrapp-/;
  return Object
  .keys(localStorage)
  .filter(key => regex.test(key))
}

const fetchUsersFromLS = () => {
  return Object
  .keys(localStorage)
  .filter(key => key.match(/hydrapp/))
  .map(key => JSON.parse(localStorage.getItem(key)));
}

const getLoggedUserKey = () => {
  return [...hydrappUsers].filter(user => user.isLoggedIn)[0].key;
}

const exportJsonToLS = () => {
  const { nameId } = hydrappUser.login;
  localStorage.setItem(`hydrapp-${nameId}`, JSON.stringify(hydrappUser));
}

const updateJsonOnDateChange = () => {
  const currentDate = new Date();
  let currentDateId = getDateId(currentDate);
  let newEntries = [];
  const lastEntryDateId = hydrappUser.entries[0].id;

  while (currentDateId !== lastEntryDateId) {
    const newEntry = new Entry(currentDate);
    newEntries = [...newEntries, newEntry];
    currentDateId = getDateId(currentDate.setDate(currentDate.getDate() - 1));
  }
  hydrappUser.entries = [...newEntries, ...hydrappUser.entries];
  exportJsonToLS();
}
//#endregion

//#region [ HorizonDark ] HTML CODE

const getHtmlOfUserLogIn = (user) => {
  return `
    <li class="usersList__item">
      <button class="usersList__button userList__button--js">
        ${user}
      </button>
    </li>
  `;  
}

const getHtmlOfEmoji = (id) => {
  let emojiHtml = `<div class="emoji emoji--${id} emoji--js-${id}">`;

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

const getHtmlOfWaterContainer = (obj, isIntro) => {

  const introLogo = `
    <div class="intro__logo">
      <svg class="intro__svg" viewBox="0 0 512 135">
        <use href="assets/svg/icons.svg#logo-white"></use>
      </svg>
      <svg class="intro__svg intro__svg--color" viewBox="0 0 512 135">
        <use href="assets/svg/icons.svg#logo-color"></use>
      </svg>
    </div>
  `;

  const getHtmlOfWavePeriodsSVGs = (amount) => {
    let html = ''
    for (let i = 1; i <= amount; i++) {
      html += `
        <div class="wave__period">
          <svg class="wave__svg wave__svg--solid" viewBox="0 0 100 10">
            <use href="assets/svg/wave.svg#wave"></use>
          </svg>
          <svg class="wave__svg wave__svg--line" viewBox="0 0 100 10">
            <use href="assets/svg/wave.svg#waveLine"></use>
          </svg>
        </div>
      `;
    }
    return html;
  }
  const waterPositions = Object.keys(obj);
  let html = '';
  [...waterPositions].forEach(position => {
    const intro = isIntro ? 'intro' : '';
    const { wavePeriodsTotal } = obj[position];
    html += `
      <div class="water water--${intro} water--${position} water--js-${position}">
        <div class="waves waves--${intro} waves--${position} waves--js-${position}">
          <div class="wave wave--before wave--${intro} wave--${position} wave--js">
            ${getHtmlOfWavePeriodsSVGs(wavePeriodsTotal)}
          </div>
          <div class="wave wave--${intro} wave--${position} wave--js">
            ${getHtmlOfWavePeriodsSVGs(wavePeriodsTotal)}
          </div>
          <div class="wave wave--after wave--${intro} wave--${position} wave--js">
            ${getHtmlOfWavePeriodsSVGs(wavePeriodsTotal)}
          </div>
        </div>
      </div>
    `
    position === 'center' ? html += introLogo : false;
  });
  return html;
}

const getHtmlOfCard = (card, userName, key) => {
  return `
    <section
      class="card card--${card} card--js-${card} ${key ? `card--js-${key}` : ''}"
    >
      <div class="card__container">
        <header class="card__header card__header--${card} card__header---js-${card}">
          ${card !== 'settings'
          ? `
          <button class="card__button card__button--prev card__button--js-prev">
            <svg class="card__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#left-arrow"></use>
            </svg>
          </button>
          ` : ''}
          <h4 class="card__heading card__heading--js-${card}">
            ${card === 'settings' ? 'Profile:' : ''} ${userName}
          </h4>
          ${card !== 'settings'
          ? `
          <button class="card__button card__button--next card__button--js-next">
            <svg class="card__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#right-arrow"></use>
            </svg>
          </button>
          ` : ''}
        </header>
        <ul class="card__list card__list--js-${card}"></ul>
      </div>
    </section>
  `;
}

const getHtmlOfEdition = (tab, id) => {
  return `
    <div class="edition edition--${tab} edition--js">
      <button class="edition__button edition__button--visible edition__button--edit edition__button--js-edit" ${id ? `id="${id}EditButton"` : ''}>
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

const getHtmlOfArchiveEntry = (index) => {

  const { date, day, id, value } = hydrappUser.entries[index];
  const dateId = date.split(' ').join('-');
  return `
    <li class="entry entry--js dateId-${dateId}">
      <header class="entry__header entry__header--js">
        <p class="entry__heading entry__heading--day">${day}</p>
        <p class="entry__heading entry__heading--date entry__heading--js-date">${date}</p>
      </header>
      <span class="entry__value entry__value--js">${value}</span>
      ${getHtmlOfEdition('archive')}
      ${getHtmlOfEmoji(id)}
    </li>
  `;
}

const getHtmlOfUserStats = (user) => {
  const stats = findUserPropsWithTag('stats');
  
  let html = '';
  [...stats].forEach(prop => {
    const { value, label } = user[prop];

    html += `
      <li class="userProp userProp--stats">
        <span class="userProp__label">
          ${label}
        </span>
        <span class="userProp__value userProp__value--${prop} userProp__value--js-${prop}">
            ${getGlasses(prop, value)}
        </span>
      </li>
    `
  });
  return html;
}

const getHtmlOfUserSettings = () => {

  const settings = findUserPropsWithTag('settings');
  
  let html = '';
  [...settings].forEach(prop => {
    const userProp = hydrappUser[prop];
    const value = prop === 'login' ? userProp.name : userProp.value;
    const { label, maxLength } = hydrappUser[prop];

    html += `
      <li class="userProp userProps--settings">
        <label for="${prop}Settings" class="userProp__label userProp__label--js">
          ${label}
        </label>
        <div class="userProp__value">
          <span class="userProp__output userProp__output--${prop} userProp__output--js userProp__output--js-${prop}">
            ${getGlasses(prop, value)}
          </span>
          <input
            id="${prop}Settings"
            class="userProp__input userProp__input--js"
            type="text"
            maxlength="${ maxLength }"
          >
        </div>
        ${getHtmlOfEdition('stats', prop)}
        <div class="userProp__alert userProp__alert--js">
          <p class="userProp__alertText"></p>
        </div>
      </li>
    `
  });
  return html;
}

const getHtmlOfProfileButtons = () => {
  
  let html = '';

    html += `
      <div class="profile">
        <button
          class="profile__button profile__button--logOut profile__button--js-logOut"
        >
          Log Out
        </button>
        <button
          class="profile__button profile__button--remove profile__button--js-remove"
        >
          Remove User
        </button>
      </div>
    `
  return html;
}
//#endregion HTML CODE

//#region [ HorizonDark ] CREATE NEW USER
const createNewUser = () => {
  
  const setNewUserDOM = () => {
    
    for (let i = 0; i < questions.length; i++) {
      const prop = questions[i];     
      const { maxLength } = hydrappUser[prop];
      const newUserHtml = `
        <div
          class="newUser ${prop === 'login' ? 'newUser--visible' : ''} newUser--js"
        >
          <label
            for="${prop}Question"
            class="newUser__label newUser__label--js"
          >
          </label>
          <input
            id="${prop}Question"
            class="newUser__input newUser__input--js"
            type="text"
            maxlength="${maxLength}"
            ${prop === 'login' ? 'autofocus' : ''}
          >
          <div class="newUser__alert newUser__alert--js">
            <p class="newUser__alertText"></p>
          </div>
          <button class="newUser__button newUser__button--prev newUser__button--js-prev">
            <svg class="newUser__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#left-arrow"></use>
            </svg>
          </button>
          <button class="newUser__button newUser__button--next newUser__button--js-next">
            <svg class="newUser__svg" viewBox="0 0 512 512">
              <use href="assets/svg/icons.svg#right-arrow"></use>
            </svg>
          </button>
        </div>
      `;
      appNewUser.innerHTML += newUserHtml;
    }
    isNewUserDOM = true;
    newUserQuestions = document.querySelectorAll('.newUser--js');
    newUserPrevButtons = document.querySelectorAll('.newUser__button--js-prev');
    newUserNextButtons = document.querySelectorAll('.newUser__button--js-next');
    newUserInputs = appNewUser.querySelectorAll('.newUser__input--js');
    // add buttons events
    [...newUserPrevButtons].forEach(button =>
    button.addEventListener('click', handleNewUser));
    [...newUserNextButtons].forEach(button =>
    button.addEventListener('click', handleNewUser));
    // add keyboard events
    [...newUserInputs]
    .filter((input, index) => index !== 0)
    .forEach(input => input.addEventListener('keyup', filterUserInput));
    appNewUser.addEventListener('keypress', (e) => {
      if (e.keyCode  === 13 || e.keyCode  === 27) e.preventDefault();
    });
    //appNewUser.addEventListener('keyup', handleNewUser);
  }
  
  const handleNewUserQuestion = (index, userName) => {
    const questionLabels = appNewUser.querySelectorAll('.newUser__label--js');
    const currentLabel = questionLabels[index];
    currentLabel.textContent =
    index === 0 ? 'What\'s your name, dear guest?' :
    index === 1 ? `Hello ${userName}, what\'s your age?` :
    index === 2 ? `What\'s your weight, ${userName}?` :
    index === 3 ? `Last question ${userName}, what\'s your height?`
    : false;
  }
  










  const handleNewUser = (e) => {
    e.preventDefault();
    const self = e.key || e.target;
  
    // TOGGLE VISIBILITY OF USER DETAIL WINDOW
    const toggleQuestion = (current, next, action, timeout) => {
      const hiddenSide = action === 'prev' ? 'Right' : 'Left';
      const visibleSide = action === 'prev' ? 'Left' : 'Right';
      const nextInput = next ? next.querySelector('.newUser__input--js') : false;
  
      current.classList.add(`newUser--hidden${hiddenSide}`);
      current.classList.remove('newUser--visible');
      next ? next.classList.add(`newUser--hidden${visibleSide}`) : false;
  
      questionTimeoutId = setTimeout(() => {
        if (next) {
          next.classList.add('newUser--visible');
          next.classList.remove(`newUser--hidden${visibleSide}`);
          nextInput.focus();
        }
        clearTimeout(questionTimeoutId);
        questionTimeoutId = null;
      }, timeout);
    }
    // RETURN USER INPUT VALUE AS INTEGER
    const getInputValue = (index) => parseInt(newUserInputs[index].value);
  
    if ((self.tagName === 'BUTTON' || self === 'Enter' || self === 'Escape')
    && questionTimeoutId === null) {
  
      const toggleTime = 300;
      const action = /prev/.test(self.className) ? 'prev' : 'next';
      const maxIndex = newUserQuestions.length - 1;
  
      // GO TO PREVIOUS USER DETAIL
      if (action === 'prev' || self === 'Escape') {
        const currentQuestion = newUserQuestions[currentQuestionIndex];
        const nextQuestion = newUserQuestions[currentQuestionIndex - 1];
        if (currentQuestionIndex > 0) {
          toggleQuestion(currentQuestion, nextQuestion, 'prev', toggleTime);
          currentQuestionIndex--;
        // go back to user log in box
        } else {
          appNewUser.classList.remove('app__newUser--visible');
          appLogIn.classList.add('app__logIn--visible');
        }

      } else if (action === 'next' || self === 'Enter') {
        const currentQuestion = newUserQuestions[currentQuestionIndex];
        const currentInput = currentQuestion.querySelector('.newUser__input--js');
        const currentAlert = currentQuestion.querySelector('.newUser__alert--js');
        const currentProp = questions[currentQuestionIndex];

        // AQUIRE USER DATA AND GO TO LANDING SECTION
        if (currentQuestionIndex >= maxIndex) {
          if (isInputValid(currentInput, currentProp, currentAlert)) {
            hydrappUser.age.value    = getInputValue(1);
            hydrappUser.weight.value = getInputValue(2);
            hydrappUser.height.value = getInputValue(3);
            hydrappUser.isLoggedIn = true;
            // set JSON object as local storage item
            exportJsonToLS();
            hydrappUsers = fetchUsersFromLS();
            loadApp();
            // change user section visibility
            toggleQuestion(currentQuestion, null, 'next', toggleTime);
            appNewUser.classList.remove('app__newUser--visible');
          }
        // GO TO NEXT USER DETAIL
        } else if (isInputValid(currentInput, currentProp, currentAlert)) {
          const inputValue = currentInput.value;
          if (currentQuestionIndex === 0) hydrappUser.login.name = inputValue;

          const { name } = hydrappUser.login;
          handleNewUserQuestion(currentQuestionIndex + 1, name);
          const nextQuestion = newUserQuestions[currentQuestionIndex + 1];
          toggleQuestion(currentQuestion, nextQuestion, 'next', toggleTime);
          currentQuestionIndex++;
        }
      }
    }
  }


















  // create new user object with empty entries
  const date = new Date();
  hydrappUser = new User(date);
  const newEntry = new Entry(date);
  hydrappUser.entries = [newEntry];
  // user questions keys
  const questions = findUserPropsWithTag('questions');

  let currentQuestionIndex = 0;
  let questionTimeoutId = null;
  let newUserQuestions, newUserPrevButtons, newUserNextButtons;
  let newUserInputs = appNewUser.querySelectorAll('.newUser__input--js');

  // create user DOM structure
  isNewUserDOM ? false : setNewUserDOM();

  // handle visibility of log in box and new user creator
  appLogIn.classList.remove('app__logIn--visible');
  appNewUser.classList.add('app__newUser--visible');
  handleNewUserQuestion(currentQuestionIndex);
  // clear all inputs
  [...newUserInputs].forEach(input => input.value = '');
}
//#endregion

//#region [ HorizonDark ] APP INITIAL

const setLogInDOM = () => {
  // set DOM structure of list of users in log in box
  usersList.innerHTML = '';
  [...hydrappUsers].forEach(user => {
    const { key } = user;
    const { name } = user.login;
    usersList.insertAdjacentHTML('beforeend', getHtmlOfUserLogIn(name));
    const userItem = usersList.lastElementChild;
    const userButton = userItem.querySelector('.userList__button--js');
    userButton.userKey = key;
    userButton.addEventListener('click', handleUserLogin);
  });
  // add 'create new user' button event only at first page load
  if (isFirstLoginLoad) {
    const createUserButton = appLogIn.querySelector('.app__createUserButton--js');
    createUserButton.addEventListener('click', createNewUser);
  }
  isFirstLoginLoad = false;
  // show log in box
  appLogIn.classList.add('app__logIn--visible');
}

const handleUserLogin = (e) => {
  const self = e.target;
  const { userKey } = self;
  // assign selected user to JSON object and load app
  hydrappUser = [...hydrappUsers].filter(({ key }) => key === userKey)[0];
  hydrappUser.isLoggedIn = true;
  loadApp();
  // hide log in box
  appLogIn.classList.remove('app__logIn--visible');

  /* const userLogInButtons = usersList.querySelectorAll('.userList__button--js');
  [...userLogInButtons].forEach(button => button.removeEventListener('click', handleUserLogin)); */
}

const loadApp = () => {
  updateJsonOnDateChange();
  const startValue = hydrappUser.entries[0].value;
  setArchiveDOM();
  handleStats();
  setSettingsDOM();
  setWaterMeasureDOM();
  setWaterWaves();
  handleCounter(landingCounter, startValue);
  handleCounter(newEntryCounter, 0);
  handleWaterLevel(startValue);
  handleWaterShake();
  handleWaterMeasure();
  handleCounterMessage(startValue);
  handleLandingCounterDate();
  emoji.innerHTML = getHtmlOfEmoji('controls');
  emojiNewEntry.innerHTML = getHtmlOfEmoji('newEntry');
  handleEmoji('controls', startValue);
  handleEmoji('newEntry', 0);
  handleWeekHeading();
  handleWaterAverage();
  appLanding.classList.add('app__landing--visible');
  appUserProfile.classList.remove('app__userProfile--visible');

  if (isFirstAppLoad) {
    landingControls.addEventListener('click', handleWaterChange);
    window.addEventListener('resize', handleWindowResize);
    burgerBtn.addEventListener('click', toggleSidebar);
    appSidebar.addEventListener('click', toggleSidebarTabs);
  }
  isFirstAppLoad = false;
}
//#endregion

//#region [ HorizonDark ] EMOJI 
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
//#endregion

//#region [ HorizonDark ] LANDING - WATER

const setWaterWaves = () => {

  const setNodes = (obj, root) => {
    obj.front.water  = root.querySelector('.water--js-front');
    obj.front.waves  = root.querySelector('.waves--js-front');
    obj.center.water = root.querySelector('.water--js-center');
    obj.center.waves = root.querySelector('.waves--js-center');
    obj.back.water   = root.querySelector('.water--js-back');
    obj.back.waves   = root.querySelector('.waves--js-back');
  }

  if (isFirstAppLoad) {
    appWater.innerHTML = getHtmlOfWaterContainer(waterObj, false);
    intro.innerHTML = getHtmlOfWaterContainer(introObj, true);
    setNodes(waterObj, appWater);
    setNodes(introObj, intro);
  }
  handleWaterWaves(waterObj);
  handleWaterWaves(introObj);
}

const handleWaterWaves = (obj) => {
  const waterPositions = Object.keys(obj);
  [...waterPositions].forEach(position => {
    const { waves, wavePeriodsTotal } = obj[position];
    const height = appWater.clientWidth / wavePeriodsTotal / 10;
    if (waves) {
      waves.style.height = `${height}px`;
      waves.style.top = `${-1 * (height - 1)}px`;
    }
  });
}

const setWaterMeasureDOM = () => {
  const waterMax = hydrappUser.waterMax.value;
  measure.innerHTML = '';
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

const handleWaterMeasure = () => {
  const headerHeight = appHeader.clientHeight;
  const waterMax = hydrappUser.waterMax.value;
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

const handleWaterChange = (e) => {
  const self = e.target;
  const { waterMax } = hydrappUser;
  let { value, id } = hydrappUser.entries[0];
  const firstEntryValue = document.querySelector('.entry__value--js');

  // if add button clicked
  if (self === addBtn) {
    if (value >= waterMax) return;
    handleCounter(landingCounter, value, ++value);

  // if remove button clicked
  } else if (self === removeBtn) {
    if (value <= 0) return;
    handleCounter(landingCounter, value, --value);
  }
  // value has been changed
  hydrappUser.entries[0].value = value;
  exportJsonToLS();
  handleWaterLevel(value);
  handleWaterShake();
  handleCounterMessage(value);
  handleWaterAverage();
  firstEntryValue.textContent = value;
  handleEmoji('controls', value);
  handleEmoji(id, value);
}

const handleWatersArray = (callback) => {
  const waterPositions = Object.keys(waterObj);
  [...waterPositions].forEach(position => {
    const { water } = waterObj[position];
    callback(water, position);
  });
}

const handleWaterLevel = (value) => {
  const waterMax = hydrappUser.waterMax.value;
  const waterMin = hydrappUser.waterMin.value;
  const waterAvg = hydrappUser.waterAvg.value;
  const landingHeight = appLanding.clientHeight;
  const waterOffset = landingHeight / waterMax * (waterMax - value);
  const waterOffsetPercent = waterOffset / landingHeight;
  const maxOffsetBetween = 200;
  const waterOffsets = {
    front: waterOffset,
    center: waterOffset - (maxOffsetBetween / 1.5 * waterOffsetPercent),
    back: waterOffset - (maxOffsetBetween * waterOffsetPercent)
  }
  // use callback function to set waters levels
  const setTopOffset = (water, position) =>
  water.style.top = `${waterOffsets[position]}px`;
  handleWatersArray(setTopOffset);
  // handle average and minimum levels of water measure
  const avgOffset = landingHeight / waterMax * (waterAvg);
  const minOffset = landingHeight / waterMax * (waterMin);
  levelAvg.style.bottom = `${avgOffset}px`;
  levelMin.style.bottom = `${minOffset}px`;
}

const handleWaterShake = () => {
  const shakeDuration = 1500;

  const addShakeAnimation = (water, position) => {

    const { isShakeTimeoutActive, shakeTimeoutDelay } = waterObj[position];

    if (!isShakeTimeoutActive) {

      const delayTimeoutId = setTimeout(() => {
        waterObj[position].isShakeTimeoutActive = true;
        water.classList.add('water--shake');
        water.style.animationDuration = `${shakeDuration}ms`
        clearTimeout(delayTimeoutId);  
  
        const timeoutId = setTimeout(() => {
          water.classList.remove('water--shake');
          clearTimeout(timeoutId);
          waterObj[position].isShakeTimeoutActive = false;
        }, shakeDuration);
        
      }, shakeTimeoutDelay);
    }
  }

  // use callback function to add water shake
  handleWatersArray(addShakeAnimation);
}

const handleWaterAverage = () => {
  const { key, entries } = hydrappUser;
  const waterMax = hydrappUser.waterMax.value;
  const prop = 'waterAvg';
  const interval = appLanding.clientHeight / waterMax;
  const userCard = document.querySelector(`.card--js-${key}`);
  const statsOutput = userCard.querySelector(`.userProp__value--js-${prop}`);
  const waterAvg = [...entries]
    .map(elem => elem.value)
    .reduce((a,b) => a + b) / entries.length;
  const roundedWaterAvg = Math.round(waterAvg * 100) / 100;

  levelAvg.style.bottom = `${roundedWaterAvg * interval}px`;
  hydrappUser.waterAvg.value = roundedWaterAvg;
  statsOutput.textContent = getGlasses(prop, roundedWaterAvg);
}
//#endregion

//#region [ HorizonDark ] COUNTER

const handleCounter = (counterObj, currentValue, newValue) => {
  const getTenthsValue = (value) => Math.floor(value / 10);
  const getOnesValue = (value) => value % 10;

  const hrefPrefix = 'assets/svg/digits.svg#digit-';
  const currentTenthsValue = getTenthsValue(currentValue);
  const currentOnesValue = getOnesValue(currentValue);
  const currentTenthsHref = hrefPrefix + currentTenthsValue;
  const currentOnesHref = hrefPrefix + currentOnesValue;
  const {
    prevTenths,
    prevOnes,
    nextTenths,
    nextOnes } = counterObj;
  // set counter on page load
  if (newValue === undefined) {
    prevTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    prevOnes.firstElementChild.setAttribute('href', currentOnesHref);
    nextTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    nextOnes.firstElementChild.setAttribute('href', currentOnesHref);
    return;
  }
  // return false if value did not change
  if (newValue === currentValue) return;

  const newTenthsValue = getTenthsValue(newValue);
  const newOnesValue = getOnesValue(newValue);
  const newTenthsHref = hrefPrefix + newTenthsValue;
  const newOnesHref = hrefPrefix + newOnesValue;
  const tenthsTimeout = 200;
  const onesTimeout = 50;

  const removeAnimations = (digits) => {
    if (digits === 'tenths') {
      nextTenths.classList.remove('digit__svg--animateIn');
      nextTenths.classList.remove('digit__svg--animateOut');
      prevTenths.classList.remove('digit__svg--animateOut');
    } else if (digits === 'ones') {
      nextOnes.classList.remove('digit__svg--animateIn');
      nextOnes.classList.remove('digit__svg--animateOut');
      prevOnes.classList.remove('digit__svg--animateOut');
    }
  }
  // handle tenths on add button click
  if (newValue > currentValue && newTenthsValue !== currentTenthsValue) {

    nextTenths.firstElementChild.setAttribute('href', newTenthsHref);
    prevTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    nextTenths.classList.add('digit__svg--rotatedNext');
    prevTenths.classList.remove('digit__svg--rotatedPrev');
    removeAnimations('tenths');

    const timeoutId = setTimeout(() => {
      nextTenths.classList.remove('digit__svg--rotatedNext');
      nextTenths.classList.add('digit__svg--animateIn');
      prevTenths.classList.add('digit__svg--rotatedPrev');
      prevTenths.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, tenthsTimeout);

  // handle tenths on remove button click
  } else if (newValue < currentValue && newTenthsValue !== currentTenthsValue) {

    nextTenths.firstElementChild.setAttribute('href', currentTenthsHref);
    prevTenths.firstElementChild.setAttribute('href', newTenthsHref);
    nextTenths.classList.remove('digit__svg--rotatedNext');
    prevTenths.classList.add('digit__svg--rotatedPrev');
    removeAnimations('tenths');

    const timeoutId = setTimeout(() => {
      nextTenths.classList.add('digit__svg--rotatedNext');
      nextTenths.classList.add('digit__svg--animateOut');
      prevTenths.classList.remove('digit__svg--rotatedPrev');
      prevTenths.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, tenthsTimeout);
  }

  // handle ones on add button click
  if (newValue > currentValue && newOnesValue !== currentOnesValue) {

    nextOnes.firstElementChild.setAttribute('href', newOnesHref);
    prevOnes.firstElementChild.setAttribute('href', currentOnesHref);
    nextOnes.classList.add('digit__svg--rotatedNext');
    prevOnes.classList.remove('digit__svg--rotatedPrev');
    removeAnimations('ones');

    const timeoutId = setTimeout(() => {
      nextOnes.classList.remove('digit__svg--rotatedNext');
      nextOnes.classList.add('digit__svg--animateIn');
      prevOnes.classList.add('digit__svg--rotatedPrev');
      prevOnes.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, onesTimeout);
    
  // handle ones on remove button click
  } else if (newValue < currentValue && newOnesValue !== currentOnesValue) {
        
    nextOnes.firstElementChild.setAttribute('href', currentOnesHref);
    prevOnes.firstElementChild.setAttribute('href', newOnesHref);
    nextOnes.classList.remove('digit__svg--rotatedNext');
    prevOnes.classList.add('digit__svg--rotatedPrev');
    removeAnimations('ones');
    
    const timeoutId = setTimeout(() => {
      nextOnes.classList.add('digit__svg--rotatedNext');
      nextOnes.classList.add('digit__svg--animateOut');
      prevOnes.classList.remove('digit__svg--rotatedPrev');
      prevOnes.classList.add('digit__svg--animateOut');
      clearTimeout(timeoutId);
    }, onesTimeout);
  }
}

const handleCounterMessage = (value) => {
  const { waterMax, waterMin, waterAvg } = hydrappUser;
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

const handleLandingCounterDate = () => {
  const { day, date } = hydrappUser.entries[0];
  landingDay.innerHTML = day;
  landingDate.innerHTML = date.slice().split(' ').join('.');
}
//#endregion

//#region [ HorizonDark ] SIDEBAR

const toggleSidebar = (e) => {
  const self = e.target || e;
  if (self === burgerBtn) {
    self.classList.toggle('button--active');
    appSidebar.classList.toggle('app__sidebar--visible');
    appLanding.classList.toggle('app__landing--onSide');
    // update waves height and offset during css transition
    clearInterval(wavesIntervalId);
    clearTimeout(wavesTimeoutId);
    if (window.innerWidth >= mediaMd) {
      wavesIntervalId = setInterval(() => {
        handleWaterWaves(waterObj);
      }, 10);
      wavesTimeoutId = setTimeout(() => {
        clearInterval(wavesIntervalId);
        clearTimeout(wavesTimeoutId);
      }, 1000);
    }
  }
}

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
        // show archive content
        if (!isActive) {
          const currentWeek = weeks[currentWeekIndex];
          handleContainerHeight(archiveContainer, currentWeek);
          window.addEventListener('keydown', enterNewEntryValue);
          window.addEventListener('keydown', removeLastEntry);
          window.addEventListener('keydown', slideCard);
  
        // hide archive content
        } else {
          archiveContainer.style.height = 0;
          window.removeEventListener('keydown', enterNewEntryValue);
          window.removeEventListener('keydown', removeLastEntry);
          window.removeEventListener('keydown', slideCard);
        }
        break;
      case statsTabButton:
      case settingTabButton:
        // show stats content
        if (!isActive) {
          handleContainerHeight(tabContainer, tabContainer.firstElementChild);
        // hide stats content
        } else {
          tabContainer.style.height = 0;
        }
        break;
      default: false;
    }
    svgIcon.classList.toggle('tab__svg--active');
  }
}

const slideCard = (e, isLooped) => {
  const self = e.target || e;
  const action = /prev/.test(self.className) ? 'prev' : 'next';
  const currentCard = findFirstParentOfClass(self, 'card');
  const container = currentCard.parentNode;
  const containerWidth = container.clientWidth;
  const cards = container.children;
  const cardLists = container.querySelectorAll('[class*=card__list--js]');
  const cardHeaders = container.querySelectorAll('[class*=card__header---js]');
  const cardHeadings = container.querySelectorAll('[class*=card__heading--js]');
  const currentIndex = [...cards].indexOf(currentCard);
  const currentCardList = cardLists[currentIndex];
  const currentCardHeader = cardHeaders[currentIndex];
  const currentCardHeading = cardHeadings[currentIndex];
  const maxIndex = cards.length - 1;
  const delay = 50;
  const transitionTime = 500;

  // slide cards with transition effect
  const slideCards = (newCard, newCardList, newCardHeading, offset) => {
    slideTimeoutId = setTimeout(() => {
      newCardList.style = `
        transform: translateX(0);
        transition: transform ${transitionTime}ms;
      `;
      currentCardList.style = `
        transform: translateX(${offset}px);
        transition: transform ${transitionTime}ms;
      `;
      currentCardHeader.style = `
        visibility: hidden;
        transition: visibility 0ms ${transitionTime / 2}ms;
      `;
      newCardHeading.style = `
        opacity: 1;
        transition: opacity ${transitionTime / 2}ms ${transitionTime / 2}ms;
      `;
      currentCardHeading.style = `
        opacity: 0;
        transition: opacity ${transitionTime / 2}ms;
      `;
      newCard.classList.add('card--visible');
    }, delay);
  }
  // hide previous card and clear timeouts
  const clearAfter = () => {
    const slideSecondTimeout = setTimeout(() => {
      currentCard.classList.remove('card--visible');
      clearTimeout(slideTimeoutId);
      clearTimeout(slideSecondTimeout);
      slideTimeoutId = null;
    }, transitionTime);
  }

  // perform sliding effect if previous one is already finished
  if (slideTimeoutId === null) {
    // find next index
    const newIndex = action === 'prev'
    ? limitedRange(maxIndex, currentIndex, 'decrease')
    : limitedRange(maxIndex, currentIndex, 'increase');
    // set new elements
    var newCard = cards[newIndex];
    const newCardList = cardLists[newIndex];
    var newCardHeader = cardHeaders[newIndex];
    var newCardHeading = cardHeadings[newIndex];
    // set initial position of a new card element
    const initialOffset = action === 'prev' ? -1 * containerWidth : containerWidth;
    const finalOffset = action === 'next' ? -1 * containerWidth : containerWidth;
    newCardList.style = `transform: translateX(${initialOffset}px);`;
    newCardHeader.style = `
      visibility: visible;
      transition: visibility 0ms ${transitionTime / 2}ms;
    `;
    // create and set promise function
    const slidePromise = new Promise((resolve, reject) => {
      resolve();
    });
    slidePromise
      .then(() => slideCards(newCard, newCardList, newCardHeading, finalOffset))
      .then(clearAfter);
      //catch(() => console.log('Something bad happened!'));

    // adjust container height to its current content
    handleContainerHeight(container, newCard);
  }
}
//#endregion

//#region [ HorizonDark ] ARCHIVE
const setArchiveDOM = () => {

  const { entries } = hydrappUser;
  for (let i = 0; i < entries.length; i++) {
    addArchiveEntry(i);
  }
  // set the newest week as visible
  weeks = document.querySelectorAll('.card--js-week');
  weekLists = document.querySelectorAll('.card__list--js-week');
  weeks[currentWeekIndex].classList.add('card--visible');
  // add 'remove entry' button on the last entry
  handleArchiveLastEntry();
}

const addArchiveEntry = (index, option) => {

  const {value, id, day} = hydrappUser.entries[index];
  const weekHtml = getHtmlOfCard('week');
  const entryHtml = getHtmlOfArchiveEntry(index);

  // function adding new week DOM node
  const addWeek = () => {
    archiveContainer.insertAdjacentHTML('beforeend', weekHtml);
    const lastWeek = archiveContainer.lastElementChild;
    const weekPrevButton = lastWeek.querySelector('.card__button--js-prev');
    const weekNextButton = lastWeek.querySelector('.card__button--js-next');
    weekPrevButton.addEventListener('click', slideCard);
    weekNextButton.addEventListener('click', slideCard);
    weekLists = archiveContainer.querySelectorAll('.card__list--js-week');
  }

  // add new week
  if (((day === 'sunday' || index === 0)) && option !== 'add') addWeek();

  // add next day entry
  const lastWeekList = weekLists[weekLists.length - 1];
  lastWeekList.insertAdjacentHTML('beforeend', entryHtml);
  handleEmoji(id, value);
  
  // add 'add entry button at the end
  if (index === hydrappUser.entries.length - 1) {
    if (day === 'monday') addWeek();
    const lastWeekList = weekLists[weekLists.length - 1];
    lastWeekList.appendChild(addEntryButton);
  }
  handleWeekHeading();
  // add event listeners to edit button

  // ! FIND ANOTHER WAY OF ASSIGNING EVENT LISTENERS TO THOSE BUTTONS

  // ! CHECK REMOVING EVENTS WHEN WEEK IS GETTING REMOVED

  const editButtons = archiveContainer.querySelectorAll('.edition__button--js-edit');
  const editButton = editButtons[index];
  editButton.index = index;
  editButton.addEventListener('click', handleEntryEdit);
}

const handleWeekHeading = () => {
  weekLists = document.querySelectorAll('.card__list--js-week');
  const weekHeadings = document.querySelectorAll('.card__heading--js-week');

  const getDate = (element) => {
    const dateId = element.className.split(' ').filter(a => /dateId-/.test(a));
    return dateId.toString().replace(/dateId-/,'').split('-').join('.');
  }
  
  const setButtonsVisiblity = (index, option) => {
    const prevWeekButton = document.querySelectorAll('.card__button--js-prev')[index];
    const nextWeekButton = document.querySelectorAll('.card__button--js-next')[index];
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
//#endregion

//#region [ HorizonDark ] ARCHIVE ENTRIES

const createRemoveEntryButton = () => {
  const removeEntryButton = document.createElement('button');
  removeEntryButton.className = 'entry__remove';
  removeEntryButton.innerHTML = `
    <svg class="entry__svg" viewBox="0 0 512 512">
      <use href="assets/svg/icons.svg#remove-icon"></use>
    </svg>
  `
  removeEntryButton.addEventListener('click', removeLastEntry);
  return removeEntryButton;
}

const createAddEntryButton = () => {
  const addEntryItem = document.createElement('li');
  addEntryItem.className = 'entry entry__add';
  addEntryItem.innerHTML = `
    <button class="entry__button entry__button--add entry__button--js-add">
      Add previous day..
    </button>
  `;
  const addEntryButton = addEntryItem.firstElementChild;
  addEntryButton.addEventListener('click', enterNewEntryValue);
  return addEntryButton;
}

const enterNewEntryValue = (e) => {
  const self = e.keyCode || e.target || e;                // ! e only for tests
  // find date to display as new proposition
  const displayDate = new Date();
  let displayDateId = getDateId(displayDate);
  const { entries } = hydrappUser;
  const waterMax = hydrappUser.waterMax.value;
  const oldestEntryIndex = entries.length - 1;
  const oldestEntryDateId = entries[oldestEntryIndex].id;
  while (displayDateId !== oldestEntryDateId) {
    displayDate.setDate(displayDate.getDate() - 1);
    displayDateId = getDateId(displayDate);
  }
  displayDate.setDate(displayDate.getDate() - 1);
  // create new Entry object
  const newEntry = new Entry(displayDate);
  const { day, date } = newEntry;

  if (self === 107 || self === addEntryButton) {
    newEntryMode.classList.add('newEntry--visible');
    burgerBtn.classList.add('button--hidden');
    newEntryDay.textContent = day;
    newEntryDate.textContent = date;
    handleCounter(newEntryCounter, 0);
    handleEmoji('newEntry', 0);
  
    const modeOff = () => {
      newEntryMode.classList.remove('newEntry--visible');
      burgerBtn.classList.remove('button--hidden');
      newEntryMode.removeEventListener('click', handleValue);
      window.removeEventListener('keydown', handleValue);
      window.addEventListener('keydown', enterNewEntryValue);
      window.addEventListener('keydown', slideCard);
    }
  
    const handleValue = (e) => {
      const self = e.keyCode || e.target;
      const { value } = newEntry;
      switch (self) {
  
        case 37:
        case newEntryDecrease:
          if (value > 0) {
            newEntry.value--;
            handleCounter(newEntryCounter, value, newEntry.value);
            handleEmoji('newEntry', newEntry.value);
          }
          break;

        case 39:
        case newEntryIncrease:
          if (value < waterMax) {
            newEntry.value++;
            handleCounter(newEntryCounter, value, newEntry.value);
            handleEmoji('newEntry', newEntry.value);
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
    window.removeEventListener('keydown', slideCard);
  }
}

const addNewEntry = (entry) => {

  let lastEntryIndex = hydrappUser.entries.length - 1;
  let lastEntry = document.querySelectorAll('.entry--js')[lastEntryIndex];
  lastEntry.classList.remove('entry--last');
  
  // create new entry node
  const { entries } = hydrappUser;
  hydrappUser.entries = [...entries, entry];
  lastEntryIndex = hydrappUser.entries.length - 1;
  addArchiveEntry(lastEntryIndex, 'add');

  // jump to the last week
  const weeks = archiveContainer.children
  const lastWeekIndex = weeks.length - 1;
  const lastWeek = weeks[lastWeekIndex];
  const cardNextButton = archiveContainer.querySelectorAll('.card__button--js-next')[currentWeekIndex];
  if (currentWeekIndex !== lastWeekIndex) {
    currentWeekIndex = lastWeekIndex;
    slideCard(cardNextButton);
  }
  handleContainerHeight(archiveContainer, lastWeek);
  handleArchiveLastEntry();
  handleWeekHeading();
  handleWaterAverage();
  exportJsonToLS();
}

const handleArchiveLastEntry = () => {
  const entries = document.querySelectorAll('.entry--js');
  const lastEntry = entries[entries.length - 1];
  const lastEntryValueNode = lastEntry.querySelector('.entry__value--js');

  if (entries.length > 1) {
    lastEntry.insertBefore(removeEntryButton, lastEntryValueNode);
    lastEntry.classList.add('entry--last');
  }
}

const removeLastEntry = (e) => {
  const self = e.keyCode || e. target;
  const { entries } = hydrappUser;
  const lastEntryIndex = entries.length - 1;
  const {day, key} = entries[lastEntryIndex];
  const lastEntryNode = document.querySelectorAll('.entry--js')[lastEntryIndex];
  let lastWeek = weeks[weeks.length - 1];

  if (self === 109 || self === removeEntryButton) {

    if (entries.length > 1) {
      hydrappUser.entries = [...entries]
      .filter((entry, index) => index !== lastEntryIndex);
      exportJsonToLS();
      lastEntryNode.parentNode.removeChild(lastEntryNode);

      // removing last week section after deleting last day of that week
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
      // add remove button on current last item
      handleArchiveLastEntry();
      handleWeekHeading();
      handleContainerHeight(archiveContainer, lastWeek);
      handleWaterAverage();
    }
  }
}

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

  const toggleItemDisplay = () => {
    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
    entry.classList.toggle('entry--edit-mode');
    entryHeader.classList.toggle('entry__header--edit-mode');

    itemIndex === hydrappUser.entries.length - 1
    ? removeEntryButton.classList.toggle('entry__remove--hidden')
    : false;
  }
  
  const exitEditMode = () => {
    const {value, id} = hydrappUser.entries[itemIndex];
    
    toggleItemDisplay();
    entryValue.textContent = value;
    handleEmoji(id, value);

    window.removeEventListener('click', handleEdition);
    window.removeEventListener('keydown', handleEdition);
    window.addEventListener('keydown', slideCard);
  }
  
  const handleEdition = (e) => {
    const self = e.keyCode || e.target;
    let dayValue = parseInt(entryValue.textContent);
    const waterMax = hydrappUser.waterMax.value;
    const { id, value } = hydrappUser.entries[itemIndex];

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
          handleCounter(landingCounter, value, dayValue);
          handleWaterLevel(dayValue);
          handleWaterShake();
          handleCounterMessage(dayValue);
          handleEmoji('controls', dayValue);
        }
        hydrappUser.entries[itemIndex].value = dayValue;
        exportJsonToLS();
        handleWaterAverage();
        exitEditMode();
      break;
    }
  }
  
  toggleItemDisplay();
  window.addEventListener('click', handleEdition);
  window.addEventListener('keydown', handleEdition);
  window.removeEventListener('keydown', slideCard);
}
//#endregion

//#region [ HorizonDark ] STATS

const handleStatsDOM = (user) => {
  // get html codes of user card and user props
  const { key } = user;
  const { name } = user.login;
  const statsCardHtml = getHtmlOfCard('stats', name, key);
  const userHtml = getHtmlOfUserStats(user);
  // create DOM node of user card
  statsContainer.insertAdjacentHTML('beforeend', statsCardHtml);
  const userCard = statsContainer.querySelector(`.card--js-${key}`);
  // create DOM nodes of user props
  const cardList = userCard.querySelector('.card__list--js-stats');
  cardList.insertAdjacentHTML('beforeend', userHtml);
}

const handleStats = () => {
  const usersTotal = hydrappUsers.length;
  // create DOM structure
  [...hydrappUsers].forEach(user => handleStatsDOM(user));
  // make logged in user's card visible
  const loggedUserCard = statsContainer.querySelector(`.card--js-${hydrappUser.key}`);
  loggedUserCard.classList.add('card--visible');
  // set visibility and events for card navigation buttons
  const cardPrevButtons = statsContainer.querySelectorAll('.card__button--js-prev');
  const cardNextButtons = statsContainer.querySelectorAll('.card__button--js-next');
  if (usersTotal > 1) {
    [...cardPrevButtons].forEach(button => {
      button.classList.add('card__button--visible');
      button.addEventListener('click', slideCard);
    });
    [...cardNextButtons].forEach(button => {
      button.classList.add('card__button--visible');
      button.addEventListener('click', slideCard);
    });
  }
}
//#endregion

//#region [ HorizonDark ] SETTINGS
  
const setSettingsDOM = () => {
  // get html codes of user card and user settings
  const { name } = hydrappUser.login;
  const settingsCardHtml = getHtmlOfCard('settings', name);
  const settingsHtml = getHtmlOfUserSettings();
  const profileButtonsHtml = getHtmlOfProfileButtons();
  // create DOM node of settings card
  settingsContainer.innerHTML = settingsCardHtml;
  const settingsCard = settingsContainer.querySelector('.card--js-settings');
  const cardContainer = settingsCard.firstElementChild;
  settingsCard.classList.add('card--visible');
  // create DOM nodes of user props
  const cardList = settingsContainer.querySelector('.card__list--js-settings');
  cardList.innerHTML = settingsHtml;
  // create DOM nodes of user profile buttons
  cardContainer.insertAdjacentHTML('beforeend', profileButtonsHtml);
  const logOutButton = document.querySelector('.profile__button--js-logOut');
  const removeButton = document.querySelector('.profile__button--js-remove');
  // add event listeners
  const editButtons = settingsContainer.querySelectorAll('.edition__button--js-edit');
  [...editButtons].forEach(button => {
    button.addEventListener('click', handleSettingsEdition);
  });
  logOutButton.addEventListener('click', handleUserLogOut);
  removeButton.addEventListener('click', handleUserRemove);
}

const handleSettingsEdition = (e) => {
  const self = e.target;
  const { id } = self;
  const prop = id.replace('EditButton', '');
  const propObj = hydrappUser[prop];
  const value = prop === 'login' ? propObj.name : propObj.value;
  const userProp = findFirstParentOfClass(self, 'userProp');
  const propName = userProp.querySelector('.userProp__label--js');
  const outputValue = userProp.querySelector('.userProp__output--js');
  const inputValue = userProp.querySelector('.userProp__input--js');
  const cancelButton = userProp.querySelector('.edition__button--js-cancel');
  const saveButton = userProp.querySelector('.edition__button--js-save');
  const editSection = userProp.querySelector('.edition--js');
  const inputAlert = userProp.querySelector('.userProp__alert--js');
  const settingsCard = settingsContainer.querySelector('.card--js-settings');
  const settingsHeading = settingsCard.querySelector('.card__heading--js-settings');
  const transitionTime = 1000;

  const togglePropDisplay = () => {
    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }
    editSection.classList.toggle('edition--visible');
    userProp.classList.toggle('userProp--editMode');
    propName.classList.toggle('userProp__label--editMode');
    outputValue.classList.toggle('userProp__output--hidden');
    inputValue.classList.toggle('userProp__input--visible');
    inputValue.focus();
    // change placeholder of edited input
    inputValue.value = '';
    inputValue.placeholder = prop === 'weight'
    ? `${value} kg` : prop === 'height'
    ? `${value} cm` : prop === 'waterMax'
    ? `${getGlasses('waterMax', value)}` : value;
  }
  
  const exitEditMode = () => {
    togglePropDisplay();
    handleInputAlert(inputAlert);
    handleContainerHeightThroughTime(settingsContainer, settingsContainer.firstElementChild, transitionTime);
    editSection.removeEventListener('click', handleEdition);
    window.removeEventListener('keydown', handleEdition);
    if (prop !== 'name') inputValue.removeEventListener('keyup', filterUserInput);

    //window.addEventListener('keydown', slideCard); // ! slide between cards
  }
  
  const handleEdition = (e) => {
    const self = e.keyCode || e.target;
    switch (self) {
      case 27:
      case cancelButton:
        exitEditMode();
      break;
      case 13:
      case saveButton:
        if (isInputValid(inputValue, prop, inputAlert)) {
          // update new value
          const newValue = typeof value === 'number'
          ? parseInt(inputValue.value)
          : inputValue.value
          outputValue.textContent = getGlasses(prop, newValue);
          // handle updated local storage key
          if (prop === 'login' && newValue !== value) {
            const oldNameId = getFormattedString(value);
            const newNameId = getFormattedString(newValue);
            localStorage.removeItem(`hydrapp-${oldNameId}`);
            hydrappUser[prop].name = newValue;
            hydrappUser[prop].nameId = newNameId;
            settingsHeading.textContent = newValue;
          } else if (newValue !== value) {
            hydrappUser[prop].value = newValue;
          }
          // handle JSON object
          exportJsonToLS();
          exitEditMode();
        } else {
          handleContainerHeightThroughTime(settingsContainer, settingsContainer.firstElementChild, transitionTime);
        }
      break;
    }
  }
  
  togglePropDisplay();
  editSection.addEventListener('click', handleEdition);
  window.addEventListener('keydown', handleEdition);
  if (typeof value === 'number') inputValue.addEventListener('keyup', filterUserInput);

  //window.removeEventListener('keydown', slideCard); // ! slide between cards
}

const quitLanding = () => {
  levelAvg.style.bottom = 0;
  levelMin.style.bottom = 0;
  handleWaterLevel(0);
  setLogInDOM();
  appUserProfile.classList.add('app__userProfile--visible');
} 

const handleUserLogOut = () => {
  hydrappUser.isLoggedIn = false;
  exportJsonToLS();
  quitLanding();
}

const handleUserRemove = () => {
  const { nameId } = hydrappUser.login;
  localStorage.removeItem(`hydrapp-${nameId}`);
  hydrappUsers = fetchUsersFromLS();
  quitLanding();
}
//#endregion

//#region [ HorizonDark ] CLASSES

class Counter {
  constructor(container) {
    this.container = container,
    this.prevTenths = container.querySelector('.digit__svg--js-prevTenths'),
    this.nextTenths = container.querySelector('.digit__svg--js-nextTenths'),
    this.prevOnes = container.querySelector('.digit__svg--js-prevOnes'),
    this.nextOnes = container.querySelector('.digit__svg--js-nextOnes')
  }
}

class User {
  constructor(date) {
    this.login = {
      name: '',
      nameId: '',
      label: 'Name',
      maxLength: 20,
      tags: ['questions', 'settings']
    };
    this.age = {
      value: 0,
      label: 'Age',
      maxLength: 3,
      min: 10,
      max: 120,
      tags: ['questions', 'settings']
    };
    this.weight = {
      value: 0,
      label: 'Weight',
      maxLength: 3,
      min: 8,
      max: 200,
      tags: ['questions', 'settings']
    };
    this.height = {
      value: 0,
      label: 'Height',
      maxLength: 3,
      min: 70,
      max: 250,
      tags: ['questions', 'settings']
    };
    this.waterMax = {
      value: 20,
      label: 'Maximum per day',
      alertLabel: 'Maximum amount of glasses per day',
      maxLength: 2,
      min: 10,
      max: 40,
      tags: ['settings']
    };
    this.waterMin = {
      value: 8,
      label: 'Minimum per day',
      tags: ['stats']
    };
    this.waterAvg = {
      value: 0,
      label: 'Average per day',
      tags: ['stats']
    };
    this.userRank = {
      value: 0,
      label: 'Ranking position',
      tags: ['stats']
    }
    this._dateCreated = date;    
    this._key = date;
    this.entries = ['stats'];
  }

  get _dateCreated() {
    return this.dateCreated;
  }
  set _dateCreated(date) {
    const dateTime = getOffsetedDate(date)
    .toISOString()
    .slice(0,10)
    .split('-')
    .reverse()
    .join('.');
    const hourTime = getOffsetedDate(date).toISOString().slice(11,16);
    this.dateCreated = {
      value: `${dateTime}, ${hourTime}`,
      label: 'Created at'
    }
  }
  get _key() {
    return this.key;
  }
  set _key(date) {
    this.key = date.getTime();
  }
}

class Entry {
  constructor(date) {
    this.value = 0;
    this._date = date;
    this._id = this.date;
    this._day = date;
  }
  get _date() {
    return this.date;
  }
  set _date(date) {
    this.date = getOffsetedDate(date)
    .toISOString()
    .slice(0,10)
    .split('-')
    .reverse()
    .join('.');
  }
  get _id() {
    return this.id;
  }
  set _id(date) {
    this.id = date.replace(/[.]/g,'');
  }
  get _day() {
    return this.day;
  }
  set _day(date) {
    const dayIndex = date.getDay();
    this.day = weekDay[dayIndex];
  }
}
//#endregion

//#region [ HorizonDark ] VARIABLES - INTRO
const intro = document.querySelector('.intro--js');
const introObj = {
  front: {
    wavePeriodsTotal: 2
  },
  center: {
    wavePeriodsTotal: 3
  },
  back: {
    wavePeriodsTotal: 5
  }
};
//#endregion
//#region [ HorizonDark ] VARIABLES - APP
const mediaMd = 768;
const mediaLg = 1200;
let isFirstAppLoad = true;
let isFirstLoginLoad = true;
let isNewUserDOM = false;
let slideTimeoutId = null;
const weekDay = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];
const appHeader = document.querySelector('.app__header--js');
const appUserProfile = document.querySelector('.app__userProfile--js');
const appLogIn = document.querySelector('.app__logIn--js');
const appNewUser = document.querySelector('.app__newUser--js');
const appLanding = document.querySelector('.app__landing--js');
const appWater = document.querySelector('.app__water--js');
const appSidebar = document.querySelector('.app__sidebar--js');

const usersList = document.querySelector('.usersList--js');
//#endregion
//#region [ HorizonDark ] VARIABLES - COUNTER
const landingCounterContainer = document.querySelector('.counter--js-landing');
const landingCounter = new Counter(landingCounterContainer);
const landingDay = landingCounterContainer.querySelector('.counter__day--js-landing');
const landingDate = landingCounterContainer.querySelector('.counter__date--js-landing');
const counterMessage = document.querySelector('.counter__message--js');
//#endregion
//#region [ HorizonDark ] VARIABLES - CONTROLS
const landingControls = document.querySelector('.controls--js-landing');
const addBtn = document.querySelector('.button--js-add');
const removeBtn = document.querySelector('.button--js-remove');
const emoji = document.querySelector('.emoji--js-controls');
const emojiAmount = 8;
const burgerBtn = document.querySelector('.button--js-burger');
//#endregion
//#region [ HorizonDark ] VARIABLES - WATER
const waterObj = {
  front: {
    wavePeriodsTotal: 2,
    shakeTimeoutDelay: 0,
    isShakeTimeoutActive: false
  },
  center: {
    wavePeriodsTotal: 3,
    shakeTimeoutDelay: 100,
    isShakeTimeoutActive: false
  },
  back: {
    wavePeriodsTotal: 4,
    shakeTimeoutDelay: 200,
    isShakeTimeoutActive: false
  }
};
let wavesIntervalId = null;
let wavesTimeoutId = null;
const measure = document.querySelector('.graph__measure--js');
const levelAvg = document.querySelector('.graph__level--js-avg');
const levelMin = document.querySelector('.graph__level--js-min');
//#endregion
//#region [ HorizonDark ] VARIABLES - SIDEBAR
const archiveTabButton = document.querySelector('.tab__button--js-archive');
const statsTabButton = document.querySelector('.tab__button--js-stats');
const settingTabButton = document.querySelector('.tab__button--js-settings');
const archiveContainer = document.querySelector('.tab__container--js-archive');
const statsContainer = document.querySelector('.tab__container--js-stats');
const settingsContainer = document.querySelector('.tab__container--js-settings');
//#endregion
//#region [ HorizonDark ] VARIABLES - ARCHIVE
let weeks = null;
let weekLists = null;
let currentWeekIndex = 0;
const addEntryButton = createAddEntryButton();
const removeEntryButton = createRemoveEntryButton();
//#endregion
//#region [ HorizonDark ] VARIABLES - NEW ENTRY
const newEntryMode = document.querySelector('.newEntry--js');
const newEntryCounterContainer = document.querySelector('.counter--js-newEntry');
const newEntryCounter = new Counter(newEntryCounterContainer);
const newEntryDay = newEntryCounterContainer.querySelector('.counter__day--js-newEntry');
const newEntryDate = newEntryCounterContainer.querySelector('.counter__date--js-newEntry');
const newEntryDecrease = newEntryMode.querySelector('.button--js-decrease');
const newEntryIncrease = newEntryMode.querySelector('.button--js-increase');
const newEntryCancel = newEntryMode.querySelector('.button--js-cancel');
const newEntrySave = newEntryMode.querySelector('.button--js-save');
const emojiNewEntry = document.querySelector('.emoji--js-newEntry');
//#endregion

//#region [ HorizonDark ] FUNCTION CALLS
let hydrappUser = {};
let hydrappUsers = fetchUsersFromLS();
const loggedUser = [...hydrappUsers].filter(user => user.isLoggedIn);

// fix visibility
if (hydrappUsers) {
  if (loggedUser.length > 0) {
    hydrappUser = loggedUser[0];
    loadApp() 
  } else {
    setLogInDOM();
  }
} else {
  createNewUser();
};
//#endregion

//#region [ HorizonDark ] UNUSED

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
//#endregion

toggleSidebar(burgerBtn);
//window.addEventListener('click', (e) => console.log(e.target));