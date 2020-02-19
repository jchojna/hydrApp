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

const getFormattedString = (string) => string
.replace(/^\s+/, '')
.replace(/\s/g,'_')
.toLowerCase();

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
  const waterValue = loggedUser.entries[0].value;
  handleWaterLevel(waterValue);
  handleWaterWaves(waterObj);
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

const setNodes = (obj, root) => {
  obj.front.water  = root.querySelector('.water--js-front');
  obj.front.waves  = root.querySelector('.waves--js-front');
  obj.center.water = root.querySelector('.water--js-center');
  obj.center.waves = root.querySelector('.waves--js-center');
  obj.back.water   = root.querySelector('.water--js-back');
  obj.back.waves   = root.querySelector('.waves--js-back');
}

const getRandomFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getAverageOfArrayValues = (array) => {
  const average = [...array]
    .map(elem => elem.value)
    .reduce((a,b) => a + b) / array.length;

  return Math.round(average * 100) / 100;
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

    if (prop === 'name' && option === 'empty') {
      alertTextContent = 'Please enter your name';

    } else if (prop === 'name' && option === 'existing') {
      alertTextContent = 'This user name is already taken';

    } else if (prop === 'login' && option === 'empty') {
      alertTextContent = 'Please enter your login';

    } else if (prop === 'login' && option === 'noMatch') {
      alertTextContent = 'There is no user of that name...';

    } else {
      const userProp = userHelper[prop];
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

  // validate user name
  if (prop === 'name') {
    
    // check if there is no the same user name existing
    const newLogin = getFormattedString(value);
    const isExisting = Object.keys(hydrappJSON.users)
    .filter(existingLogin => existingLogin === newLogin).length > 0;

    if (newLogin === '') {
      handleInputAlert(alertBox, prop, 'empty');
      return false;

    } else if (isExisting) {
      handleInputAlert(alertBox, prop, 'existing');
      return false;

    } else {
      handleInputAlert(alertBox);
      return true;
    }

  // check user's numerical inputs
  } else {
    const { min, max } = userHelper[prop];

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

//#region [ HorizonDark ] JSON

const getArrayOfUsers = () => {
  const usersLogins = Object.keys(hydrappJSON.users);
  return [...usersLogins].map(login => hydrappJSON.users[login]);
}

const fetchJSON = () => {
  hydrappJSON = JSON.parse(localStorage.getItem(localStorageKeyName));
}

const updateJSON = (user) => {
  const { login } = user;
  hydrappJSON.users[login] = user;
}

const exportJSON = () => {
  localStorage.setItem(localStorageKeyName, JSON.stringify(hydrappJSON));
}

const updateUsersEntries = () => {

  const users = getArrayOfUsers();

  [...users].forEach(user => {

    const currentDate = new Date();
    let currentDateId = getDateId(currentDate);
    let newEntries = [];
    const newestEntryDateId = user.entries[0].id;
    
    // keep adding new empty entries between today and latest new archive entry
    while (currentDateId !== newestEntryDateId) {
      const newEntry = new Entry(currentDate);
      newEntries = [...newEntries, newEntry];
      currentDateId = getDateId(currentDate.setDate(currentDate.getDate() - 1));
    }
  
    // update user entries
    user.entries = [...newEntries, ...user.entries];
    updateJSON(user);
  });

  startWaterValue = loggedUser.entries[0].value;
  exportJSON();
}

const updateUsersStats = () => {

  const users = getArrayOfUsers();

  // update users average water consumption amount
  [...users].forEach(user => {
    const { entries } = user;
    user.waterAvg = getAverageOfArrayValues(entries);
  });

  // update users rank position based on water average amount
  const sortedUsers = [...users]
  .sort((nextUser, user) => user.waterAvg - nextUser.waterAvg);

  [...sortedUsers].forEach((user, index) => {

    const prevUser = index > 0 ? sortedUsers[index - 1] : false;
    prevUser
    ? prevUser.waterAvg === user.waterAvg
      ? user.rank = prevUser.rank
      : user.rank = prevUser.rank + 1
    : user.rank = 1;
  });

  // sort object keys respectively to users array
  [...sortedUsers].forEach(user => {
    delete hydrappJSON.users[user.login];
    hydrappJSON.users[user.login] = user;
  });

  exportJSON();
}

//#endregion

//#region [ HorizonDark ] HTML CODE

const getHtmlOfNewUser = (prop, maxLength) => {
  return `
    <div
      class="newUser newUser--js ${prop === 'login' ? 'newUser--visible' : ''}"
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
}

const getHtmlOfEmoji = (id) => {
  let emojiHtml = `<div class="emoji__container emoji__container--${id} emoji__container--js-${id}">`;

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

  const startButton = `
    <button class="intro__start intro__start--js">Start</button>
  `

  const getHtmlOfWavePeriodsSVGs = (amount, position, isIntro) => {
    let html = ''
    for (let i = 1; i <= amount; i++) {
      html += `
        <div class="wave__period">
          <svg class="wave__svg wave__svg--solid" viewBox="0 0 100 10">
            <use href="assets/svg/wave.svg#wave"></use>
          </svg>
          ${
            isIntro || position !== 'front' ? '' : `
              <svg class="wave__svg wave__svg--line" viewBox="0 0 100 10">
                <use href="assets/svg/wave.svg#waveLine"></use>
              </svg>
            `
          }
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
      <div
        class="water water--${intro} water--${position} water--js-${position}"
      >
        <div class="waves waves--${intro} waves--${position} waves--js-${position}">
          <div class="wave wave--before wave--${intro} wave--${position} wave--js">
            ${getHtmlOfWavePeriodsSVGs(wavePeriodsTotal, position, isIntro)}
          </div>
          <div class="wave wave--${intro} wave--${position} wave--js">
            ${getHtmlOfWavePeriodsSVGs(wavePeriodsTotal, position, isIntro)}
          </div>
          <div class="wave wave--after wave--${intro} wave--${position} wave--js">
            ${getHtmlOfWavePeriodsSVGs(wavePeriodsTotal, position, isIntro)}
          </div>
        </div>
      </div>
    `
    html += position === 'center' && isIntro ? introLogo : '';
  });
  html += isIntro ? startButton : '';
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

  const { date, day, id, value } = loggedUser.entries[index];
  return `
    <li class="entry entry--js dateId-${id}">
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

  const { statsProps } = userHelper;
  let html = '';

  [...statsProps].forEach(prop => {

    const value = user[prop];
    const { label } = userHelper[prop];

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

  const { settingsProps } = userHelper;
  let html = '';

  [...settingsProps].forEach(prop => {

    const value = loggedUser[prop];
    const { label, maxLength } = userHelper[prop];

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

//#region [ HorizonDark ] INITIAL USERS

const initialUsers = [
  {
    name: 'Anna',
    age: 29,
    weight: 58,
    height: 176,
    dateCreated: 'February 01, 2020 23:30:05'
  },
  {
    name: 'Agnieszka',
    age: 28,
    weight: 75,
    height: 165,
    dateCreated: 'February 03, 2020 15:32:56'
  },
  {
    name: 'Aleksander',
    age: 28,
    weight: 70,
    height: 174,
    dateCreated: 'February 05, 2020 12:07:23'
  },
  {
    name: 'Jakub',
    age: 32,
    weight: 67,
    height: 181,
    dateCreated: 'February 06, 2020 14:45:13'
  }
];

const addInitialUsers = () => {
  hydrappJSON = {
    loggedUser: '',
    users: []
  };

  [...initialUsers].forEach(user => {
    const {
      name,
      login = getFormattedString(name),
      age,
      weight,
      height,
      dateCreated } = user;

      // create today's date and id
      const todaysDate = new Date();
      const todaysDateId = getDateId(todaysDate);

      // create date and id based on specific date
      let date = new Date(dateCreated);
      let dateId = getDateId(date);

      // create new initial user and set props
      const newUser = new User(date);
      newUser.login = login;
      newUser.name = name;
      newUser.age = age;
      newUser.weight = weight;
      newUser.height = height;
      
      // create the oldest archive entry
      const { waterMax } = newUser;
      const newEntry = new Entry(getRandomFromRange(0, waterMax), date);
      newUser.entries = [newEntry];      

      // keep adding archive entries until today's date
      while (dateId !== todaysDateId) {

        // move date one day ahead
        date = new Date(date.setDate(date.getDate() + 1));
        dateId = getDateId(date);

        // update entries array
        const newEntry = new Entry(getRandomFromRange(0, waterMax), date);
        const { entries } = newUser;
        newUser.entries = [newEntry, ...entries];
      }
    
    // add new user to hydrapp JSON object
    const { users } = hydrappJSON;
    hydrappJSON.users = { ...users, [login]: newUser };
  });
  exportJSON();
}
//#endregion

//#region [ HorizonDark ] INTRO

const setIntroWaves = () => {
  if (intro.innerHTML === '') {
    intro.innerHTML = getHtmlOfWaterContainer(introObj, true);
    // add button event
    const startButton = intro.querySelector('.intro__start--js');
    startButton.addEventListener('click', quitIntro);
  }
  setNodes(introObj, intro);
  // add fade in animation
  const keys = Object.keys(introObj);
  [...keys].forEach(key => introObj[key].water.classList.add('water--fadeIn'));
  // calculate height of every wave
  handleWaterWaves(introObj);
  // show start button after some time
  const timeoutId = setTimeout(() => {
    const startButton = intro.querySelector('.intro__start--js');
    startButton.classList.add('intro__start--visible');
    clearTimeout(timeoutId);
  }, 3000);
  // add event listener
  const handleIntroResize = () => handleWaterWaves(introObj);
  window.addEventListener('resize', handleIntroResize);
}

const quitIntro = () => {
  const keys = Object.keys(introObj);
  [...keys].forEach(key => {
    const { water } = introObj[key];
    water.classList.remove('water--fadeIn');
    water.classList.add('water--fadeOut');
  });
  intro.classList.remove('intro--visible');

  const startButton = intro.querySelector('.intro__start--js');
  startButton.classList.remove('intro__start--visible');

  const timeoutId = setTimeout(() => {
    intro.innerHTML = '';
    clearTimeout(timeoutId);
  }, 2000);
}

//#endregion

//#region [ HorizonDark ] LOG IN

const showLoginBox = () => {

  loginInput.value = '';
  loginBox.classList.add('loginBox--visible');
  appNewUser.classList.remove('app__newUser--visible');
}

const isMatchingUser = (login) => Object
.keys(hydrappJSON.users)
.filter(key => key === login)
.length > 0;

const handleLoginBox = (e) => {

  if (e.key && e.key !== 'Enter') return;

  const login = getFormattedString(loginInput.value);

  if (login === '') {
    handleInputAlert(loginAlert, 'login', 'empty');

  } else if (isMatchingUser(login)) {
    handleInputAlert(loginAlert);

    loggedUser = hydrappJSON.users[login];
    hydrappJSON.loggedUser = login;
    exportJSON();

    loadApp();
    loginBox.classList.remove('loginBox--visible');

  } else {
    handleInputAlert(loginAlert, 'login', 'noMatch');
  }
}

//#endregion

//#region [ HorizonDark ] CREATE NEW USER
  
const createNewUser = () => {
  
  // create new user object with empty entries
  const date = new Date();
  loggedUser = new User(date);
  const newEntry = new Entry(0, date);
  loggedUser.entries = [ newEntry ];

  setNewUserDOM();

  // handle visibility of log in box and new user creator
  loginBox.classList.remove('loginBox--visible');
  appNewUser.classList.add('app__newUser--visible');
  handleNewUserQuestion(0);
  // clear all inputs
  const newUserInputs = appNewUser.querySelectorAll('.newUser__input--js');
  [...newUserInputs].forEach(input => input.value = '');
}

const setNewUserDOM = () => {

  if (!isNewUserDOM) {

    // add html code of each user question
    const { questionsProps } = userHelper;
    [...questionsProps].forEach(prop => {
      const { maxLength } = userHelper[prop];
      appNewUser.innerHTML += getHtmlOfNewUser(prop, maxLength);
    });
    isNewUserDOM = true;

    // set variables
    const newUserButtons = appNewUser.querySelectorAll('[class*=newUser__button--js]');
    const newUserInputs = appNewUser.querySelectorAll('.newUser__input--js');

    // add buttons events
    [...newUserButtons].forEach(button =>
      button.addEventListener('click', handleNewUser));

    // add keyboard events
    [...newUserInputs]
    .filter((input, index) => index !== 0)
    .forEach(input => input.addEventListener('keyup', filterUserInput));
    appNewUser.addEventListener('keyup', handleNewUser);

    // remove default inputs behaviour on 'Enter' key press
    window.addEventListener('keypress', (e) =>
    e.keyCode  === 13 ? e.preventDefault() : false);
  }

  // set visibility of first user question
  const newUserQuestions = appNewUser.querySelectorAll('.newUser--js');
  newUserQuestions[0].style = 'transform: translateX(0px);';
  newUserQuestions[0].classList.add('newUser--visible');
}

const handleNewUserQuestion = (index, name) => {
  const questionLabels = appNewUser.querySelectorAll('.newUser__label--js');
  const currentLabel = questionLabels[index];
  currentLabel.textContent =
  index === 0 ? 'What\'s your name, dear guest?' :
  index === 1 ? `Hello ${name}, what\'s your age?` :
  index === 2 ? `What\'s your weight, ${name}?` :
  index === 3 ? `Last question ${name}, what\'s your height?`
  : false;
}

const handleNewUser = (e) => {

  // block default event behaviours
  e.preventDefault();
  let self, action, currentQuestion;
  const newUserQuestions = appNewUser.querySelectorAll('.newUser--js');

  // when keyboard is pressed
  if (e.key) {
    if (e.key !== 'Enter' && e.key !== 'Escape') return false;
    action = e.key === 'Escape' ? 'prev' : 'next';
    currentQuestion = [...newUserQuestions]
    .filter(question => /visible/.test(question.className))[0];

  // when button is pressed
  } else if (e.target) {
    self = e.target;
    if (self.tagName !== 'BUTTON') return false;
    action = /prev/.test(self.className) ? 'prev' : 'next';
    currentQuestion = findFirstParentOfClass(self, 'newUser');
  }
  
  const container = currentQuestion.parentNode;
  const containerWidth = container.clientWidth;
  const currentIndex = [...newUserQuestions].indexOf(currentQuestion);
  const maxIndex = newUserQuestions.length - 1;
  const inputs = container.querySelectorAll('.newUser__input--js');
  const delay = 100;
  const transitionTime = 500;

  // create and set promise function
  const slidePromise = new Promise((resolve, reject) => {
    resolve();
  });

  // slide questions with transition effect
  const slideQuestions = (newIndex, newQuestion, nextInput, offset) => {
    slideTimeoutId = setTimeout(() => {
      newQuestion.style = `
        transform: translateX(0);
        transition: opacity ${transitionTime}ms, transform ${transitionTime}ms;
      `;
      newQuestion.classList.add('newUser--visible');
      currentQuestion.style = `
        opacity: 0;
        transform: translateX(${offset}px);
        transition: opacity ${transitionTime}ms, transform ${transitionTime}ms;
      `;
      handleNewUserQuestion(newIndex, loggedUser.name);
      nextInput.focus();

    }, delay);
  }

  // hide previous card and clear timeouts
  const clearAfter = () => {
    const slideSecondTimeout = setTimeout(() => {
      currentQuestion.classList.remove('newUser--visible');
      clearTimeout(slideTimeoutId);
      clearTimeout(slideSecondTimeout);
      slideTimeoutId = null;
    }, transitionTime);
  }

  // return user input value as integer
  const getInputValue = (index) => parseInt(inputs[index].value);

  // perform sliding effect if previous one is already finished
  if (slideTimeoutId === null) {

    // find next index
    const newIndex = action === 'prev'
    ? limitedRange(maxIndex, currentIndex, 'decrease')
    : limitedRange(maxIndex, currentIndex, 'increase');

    // set new elements
    const newQuestion = newUserQuestions[newIndex];
    const nextInput = inputs[newIndex];

    // set initial position of a new card element
    const initialOffset = action === 'prev' ? -1 * containerWidth : containerWidth;
    const finalOffset = action === 'next' ? -1 * containerWidth : containerWidth;
    
    const willGoBackToPrevious = action === 'prev' || self === 'Escape';
    const willGoBackToLogin = willGoBackToPrevious && currentIndex <= 0;
    const willGoToNextQuestion = action === 'next' || self === 'Enter';
    const willCreateNewUser = willGoToNextQuestion && currentIndex >= maxIndex;

    const currentInput = currentQuestion.querySelector('.newUser__input--js');
    const currentAlert = currentQuestion.querySelector('.newUser__alert--js');
    const currentProp = userHelper.questionsProps[currentIndex];
    const shouldQuestionSlide = ((willGoToNextQuestion && isInputValid(currentInput, currentProp, currentAlert)) || willGoBackToPrevious);

    // GO BACK TO USER LOG IN
    if (willGoBackToLogin) {
      appNewUser.classList.remove('app__newUser--visible');
      loginBox.classList.add('loginBox--visible');  

    // GO TO THE NEXT QUESTION
    } else if (willGoToNextQuestion) {

      // CREATE NEW USER
      if (willCreateNewUser) {
        if (isInputValid(currentInput, currentProp, currentAlert)) {
          loggedUser.age    = getInputValue(1);
          loggedUser.weight = getInputValue(2);
          loggedUser.height = getInputValue(3);
          hydrappJSON.loggedUser = loggedUser.login;

          updateJSON(loggedUser);
          exportJSON();
          loadApp();

          // change user section visibility
          appNewUser.classList.remove('app__newUser--visible');
        }

      // VALIDATE CURRENT INPUT AND GO TO NEXT USER QUESTION 
      } else if (isInputValid(currentInput, currentProp, currentAlert)) {

        // set name and login id of a new user
        const inputValue = currentInput.value;
        if (currentIndex === 0) {
          loggedUser.name = inputValue;
          loggedUser.login = getFormattedString(inputValue);
        }

        // show entered user name in the next questions
        handleNewUserQuestion(currentIndex + 1, inputValue);
      }
    }

    // hide alert box when going back to previous questions
    if (willGoBackToPrevious) {
      handleInputAlert(currentAlert);
    }

    // set position of next question shortly before slide
    if (!willGoBackToLogin && !willCreateNewUser) {
      newQuestion.style = `
        transform: translateX(${initialOffset}px);
      `;
    }

    // apply sliding transition effect
    if (!willGoBackToLogin) {
      if (shouldQuestionSlide) {
        slidePromise
          .then(() => slideQuestions(newIndex, newQuestion, nextInput, finalOffset))
          .then(clearAfter);
          //catch(() => console.log('Something bad happened!'));
      }
    }
  } else return;
}
//#endregion

//#region [ HorizonDark ] EMOJI

const setEmojiDOM = () => {
  if (isFirstAppLoad) {
    emoji.innerHTML = getHtmlOfEmoji('controls');
    emojiNewEntry.innerHTML = getHtmlOfEmoji('newEntry');
  }
}

const handleEmoji = (id, number) => {
  let feedbackValue = getFeedbackValue(number);
  feedbackValue > 7 ? feedbackValue = 7 : false;
  const emojis = document.querySelectorAll(`.emoji__svg--js-${id}`);

  [...emojis].forEach((emoji, index) => {
    if (index === feedbackValue) {
      emoji.classList.add('emoji__svg--visible');
    } else {
      emoji.classList.remove('emoji__svg--visible');
    }
  });  
}
//#endregion

//#region [ HorizonDark ] LANDING - WATER

const setWaterWaves = () => {
  if (appWater.innerHTML === '') {
    appWater.innerHTML = getHtmlOfWaterContainer(waterObj, false);
  }
  setNodes(waterObj, appWater);
  handleWaterWaves(waterObj);
}

const handleWaterWaves = (obj) => {
  const waterPositions = Object.keys(obj);
  [...waterPositions].forEach(position => {
    const { waves, wavePeriodsTotal } = obj[position];
    
    const height = window.innerWidth / wavePeriodsTotal / 10;
    waves.style.height = `${height}px`;
    waves.style.top = `${-1 * (height - 2)}px`;
  });
}

const setWaterMeasureDOM = () => {

  const { waterMax } = loggedUser;
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

  const { waterMax } = loggedUser;
  const headerHeight = appHeader.clientHeight;
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
  if (self.tagName !== 'BUTTON') return false;

  const { waterMax } = loggedUser;
  let { value, id } = loggedUser.entries[0];
  const firstEntryValue = document.querySelector('.entry__value--js');

  switch (self) {

    case addBtn:
      if (value >= waterMax) return;
      handleCounter(landingCounter, value, ++value);
      break;

    case removeBtn:
      if (value <= 0) return;
      handleCounter(landingCounter, value, --value);
      break;

    default: break;
  }

  // value has been changed
  loggedUser.entries[0].value = value;
  firstEntryValue.textContent = value;
  updateJSON(loggedUser);
  exportJSON()
  handleWaterLevel(value);
  handleWaterShake();
  handleCounterMessage(value);
  handleWaterMin(value);
  handleWaterAverage();
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

  const { waterMax, waterMin, waterAvg } = loggedUser;
  const height = window.innerHeight;
  const waterOffset = height / waterMax * (waterMax - value);
  const waterOffsetPercent = waterOffset / height;
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
  const avgOffset = height / waterMax * (waterAvg);
  const minOffset = height / waterMax * (waterMin);
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

const handleWaterMin = (value) => {

  const { waterMin } = loggedUser;
  value >= waterMin
  ? levelMin.classList.remove('graph__level--negative')
  : levelMin.classList.add('graph__level--negative');
}

const handleWaterAverage = () => {

  const { key, entries, waterMin, waterMax } = loggedUser;
  const prop = 'waterAvg';
  const interval = appLanding.clientHeight / waterMax;
  const userCard = document.querySelector(`.card--js-${key}`);
  const statsOutput = userCard.querySelector(`.userProp__value--js-${prop}`);
  
  // calculate average number of consumed water
  const average = getAverageOfArrayValues(entries);
  loggedUser.waterAvg = average;

  // change app appearance using updated water average number
  average >= waterMin
  ? levelAvg.classList.remove('graph__level--negative')
  : levelAvg.classList.add('graph__level--negative');
  levelAvg.style.bottom = `${average * interval}px`;
  statsOutput.textContent = getGlasses(prop, average);
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

const getFeedbackValue = (value) => {

  const { waterMin, waterMax } = loggedUser;
  const diff = waterMax - waterMin;

  return value >= waterMax
  ? 8 : value >= Math.floor(waterMin + diff * 3/4)
  ? 7 : value >= Math.floor(waterMin + diff * 1/4)
  ? 6 : value >= Math.floor(waterMin)
  ? 5 : value >= Math.floor(waterMin * 4/5)
  ? 4 : value >= Math.floor(waterMin * 3/5)
  ? 3 : value >= Math.floor(waterMin * 2/5)
  ? 2 : value >= Math.floor(waterMin * 1/5)
  ? 1 : 0;
}

const handleCounterMessage = (value) => {
  const feedbackValue = getFeedbackValue(value);
  counterMessage.innerHTML = feedbackValue === 8
  ? 'It\'s enough for today!'
  : feedbackValue === 7
  ? 'You almost reached the top!'
  : feedbackValue === 6
  ? 'Woow.. You\'re on ... fire!'
  : feedbackValue === 5
  ? 'Good job! You reached your minimum water consumption'
  : feedbackValue === 4
  ? 'Keep going.. Yo\'re doing well'
  : feedbackValue === 3
  ? 'Much better, but still you can do more!'
  : feedbackValue === 2
  ? 'Still too little..'
  : feedbackValue === 1
  ? 'Uff.. Keep it going!'
  : 'Drink or you will dehydrate!';
}

const handleLandingCounterDate = () => {

  const { day, date } = loggedUser.entries[0];
  landingDay.innerHTML = day;
  landingDate.innerHTML = date.slice().split(' ').join('.');
}
//#endregion

//#region [ HorizonDark ] SIDEBAR

const toggleSidebar = (e) => {
  const self = e.target || e;
  if (self === burgerBtn) {
    isSidebarActive = !isSidebarActive;
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
  const self = e.target || e;

  if (self === archiveTabButton
  || self === statsTabButton 
  || self === settingTabButton) {

    const parentContainer = findFirstParentOfClass(self, 'tab');
    const svgIcon = parentContainer.querySelector('.tab__svg--js');
    const tabContainer = parentContainer.querySelector('.tab__container');
    const isActive = svgIcon.classList.contains('tab__svg--active');
    const weeks = archiveContainer.children;
    const currentWeek = [...weeks].filter(week => week.classList.contains('card--visible'))[0];
    
    switch (self) {
      case archiveTabButton:
        // show archive content
        if (!isActive) {
          handleContainerHeight(archiveContainer, currentWeek);
  
        // hide archive content
        } else {
          archiveContainer.style.height = 0;
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

const slideCard = (e) => {

  // slide cards with transition effect
  const slideCards = (newCard, newCardList, newCardHeading, offset) => {
    slideTimeoutId = setTimeout(() => {
      newCardList.style = `
        transform: translateX(0);
        transition: transform ${slideTime}ms;
      `;
      currentCardList.style = `
        transform: translateX(${offset}px);
        transition: transform ${slideTime}ms;
      `;
      currentCardHeader.style = `
        visibility: hidden;
        transition: visibility 0ms ${slideTime / 2}ms;
      `;
      newCardHeading.style = `
        opacity: 1;
        transition: opacity ${slideTime / 2}ms ${slideTime / 2}ms;
      `;
      currentCardHeading.style = `
        opacity: 0;
        transition: opacity ${slideTime / 2}ms;
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
    }, slideTime);
  }

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
  const slideTime = 500;
  const isLast = currentIndex === 0 && action === 'prev'
  || currentIndex === maxIndex && action === 'next';

  // perform sliding effect if previous one is already finished
  if (slideTimeoutId === null && !isLast) {
    // find next index
    const newIndex = action === 'prev'
    ? limitedRange(maxIndex, currentIndex, 'decrease')
    : limitedRange(maxIndex, currentIndex, 'increase');
    // set new elements
    const newCard = cards[newIndex];
    const newCardList = cardLists[newIndex];
    const newCardHeader = cardHeaders[newIndex];
    const newCardHeading = cardHeadings[newIndex];
    // set initial position of a new card element
    const initialOffset = action === 'prev' ? -1 * containerWidth : containerWidth;
    const finalOffset = action === 'next' ? -1 * containerWidth : containerWidth;

    newCardList.style = `transform: translateX(${initialOffset}px);`;
    newCardHeader.style = `
      visibility: visible;
      transition: visibility 0ms ${slideTime / 2}ms;
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
    handleCardButtons(container, newIndex);
  }
}

const handleCardButtons = (container, index) => {

  const cards = container.querySelectorAll('.card');
  const cardPrevButtons = container.querySelectorAll('[class*=card__button--js-prev]');
  const cardNextButtons = container.querySelectorAll('[class*=card__button--js-next]');
  const areCardsValid = cards.length === cardPrevButtons.length
  && cards.length === cardNextButtons.length;

  if (areCardsValid) {
    const maxIndex = cards.length - 1;
    const currentPrevButton = cardPrevButtons[index];
    const currentNextButton = cardNextButtons[index];

    if (maxIndex === 0) {
      currentPrevButton.classList.remove('card__button--visible');
      currentNextButton.classList.remove('card__button--visible');

    } else if (index === 0) {
      currentPrevButton.classList.remove('card__button--visible');
      currentNextButton.classList.add('card__button--visible');

    } else if (index === maxIndex) {
      currentPrevButton.classList.add('card__button--visible');
      currentNextButton.classList.remove('card__button--visible');

    } else {
      currentPrevButton.classList.add('card__button--visible');
      currentNextButton.classList.add('card__button--visible');
    }
  } else return;
}

const closeTabContainers = () => {
  const tabs = appSidebar.querySelectorAll('[class*=tab--js]');
  
  [...tabs].forEach(tab => {
    const svgIcon = tab.querySelector('.tab__svg--js');
    const tabButton = tab.querySelector('[class*=tab__button--js]');
    const isActive = svgIcon.classList.contains('tab__svg--active');
    if (isActive) {
      toggleSidebarTabs(tabButton);
    }
  });
}
//#endregion

//#region [ HorizonDark ] ARCHIVE

const setArchiveDOM = () => {

  // create DOM node with archive entries
  archiveContainer.innerHTML = '';
  for (let i = 0; i < loggedUser.entries.length; i++) {
    addArchiveEntry(i);
  }

  // set the newest week as visible and handle buttons visibility
  const weeks = document.querySelectorAll('.card--js-week');
  weeks[0].classList.add('card--visible');
  handleCardButtons(archiveContainer, 0);

  // add 'remove entry' button on the last entry
  handleArchiveLastEntry();
}

const addArchiveEntry = (index) => {

  const { value, id, day } = loggedUser.entries[index];
  const weekHtml = getHtmlOfCard('week');
  const entryHtml = getHtmlOfArchiveEntry(index);
  let weekLists = archiveContainer.querySelectorAll('.card__list--js-week');

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
  if (day === 'sunday' || index === 0) addWeek();

  // add next day entry
  const lastWeekList = weekLists[weekLists.length - 1];
  lastWeekList.insertAdjacentHTML('beforeend', entryHtml);
  const lastEntry = lastWeekList.lastElementChild;
  const editButton = lastEntry.querySelector('.edition__button--js-edit');
  editButton.index = index;
  editButton.addEventListener('click', handleEntryEdit);
  handleEmoji(id, value);
  
  // add 'add entry' button at the end
  if (index === loggedUser.entries.length - 1) {
    const lastWeekList = weekLists[weekLists.length - 1];
    lastWeekList.appendChild(addEntryButton);
  }
  handleWeekHeading();
}

const handleWeekHeading = () => {

  const weekLists = archiveContainer.querySelectorAll('.card__list--js-week');
  const weekHeadings = archiveContainer.querySelectorAll('.card__heading--js-week');

  const getHeadingDate = (entry) => {
    const entryDateId = entry.className
    .split(' ')
    .filter(a => /dateId-/.test(a))
    .toString()
    .replace('dateId-', '');

    return [...loggedUser.entries].filter(entry => entry.id === entryDateId)[0].date;
  }

  for (let i = 0; i < weekLists.length; i++) {
    const entries = weekLists[i].querySelectorAll('.entry--js');
    const heading = weekHeadings[i];
    
    if (entries.length === 0) {
      heading.textContent = 'New Week';
    } else {
      const currentWeekFirstEntry = entries[entries.length - 1];
      const currentWeekLastEntry = entries[0];
      const startDate = getHeadingDate(currentWeekFirstEntry);
      const endDate = getHeadingDate(currentWeekLastEntry);
  
      heading.textContent = startDate === endDate
      ? startDate
      : `${startDate.slice(0,5)} - ${endDate}`;
    }
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
  
  const self = e.target;
  const { entries, waterMax } = loggedUser;
  const lastWeek = archiveContainer.lastElementChild;
  
  // find date to display as new proposition
  const oldestEntryIndex = entries.length - 1;
  const oldestEntryDateKey = entries[oldestEntryIndex].dateKey;
  const prevDate = new Date(oldestEntryDateKey);
  prevDate.setDate(prevDate.getDate() - 1);
  
  // create new Entry object
  const newEntry = new Entry(0, prevDate);
  const { day, date } = newEntry;

  if (self === addEntryButton) {

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
    }
  
    const handleValue = (e) => {
      const self = e.keyCode || e.target;
      const { value } = newEntry;
      switch (self) {
  
        case 40:
        case newEntryDecrease:
          if (value > 0) {
            newEntry.value--;
            handleCounter(newEntryCounter, value, newEntry.value);
            handleEmoji('newEntry', newEntry.value);
          }
          break;

        case 38:
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
  }
}

const addNewEntry = (entry) => {

  let lastEntryIndex = loggedUser.entries.length - 1;
  let lastEntry = document.querySelectorAll('.entry--js')[lastEntryIndex];
  let lastWeek = archiveContainer.lastElementChild;
  const { day } = loggedUser.entries[lastEntryIndex];

  lastEntry.classList.remove('entry--last');
  // jump to the last week
  const cardNextButton = lastWeek.querySelector('.card__button--js-next');
  
  // create new entry node
  const { entries } = loggedUser;
  loggedUser.entries = [...entries, entry];
  lastEntryIndex = loggedUser.entries.length - 1;
  addArchiveEntry(lastEntryIndex);

  if (day === 'monday') slideCard(cardNextButton);

  lastWeek = archiveContainer.lastElementChild;
  const lastWeekIndex = archiveContainer.children.length - 1;
  handleContainerHeight(archiveContainer, lastWeek);
  handleArchiveLastEntry();
  handleWeekHeading();
  handleCardButtons(archiveContainer, lastWeekIndex);
  handleWaterAverage();
  exportJSON();
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
  
  const self = e.target;
  const { entries } = loggedUser;
  const lastEntryIndex = entries.length - 1;
  const { day } = entries[lastEntryIndex];
  const lastEntryNode = document.querySelectorAll('.entry--js')[lastEntryIndex];
  let lastWeek = archiveContainer.lastElementChild;
  
  if (self === removeEntryButton) {

    if (entries.length > 1 && !slideTimeoutId) {

      // remove entry from array and entry node from DOM
      loggedUser.entries = [...entries]
      .filter((entry, index) => index !== lastEntryIndex);
      lastEntryNode.parentNode.removeChild(lastEntryNode);
      exportJSON();

      // remove last week section after deleting last day of that week
      if (day === 'sunday') {
        const weekToRemove = archiveContainer.lastElementChild;
        const weekPrevButton = weekToRemove.querySelector('.card__button--js-prev');

        slideCard(weekPrevButton);
        archiveContainer.removeChild(weekToRemove);

        const weekLists = document.querySelectorAll('.card__list--js-week');
        const lastWeekList = weekLists[weekLists.length - 1];
        lastWeekList.appendChild(addEntryButton);
      }

      lastWeek = archiveContainer.lastElementChild;
      const lastWeekIndex = archiveContainer.children.length - 1;
      
      handleArchiveLastEntry();
      handleWeekHeading();
      handleCardButtons(archiveContainer, lastWeekIndex);
      handleContainerHeight(archiveContainer, lastWeek);
      handleWaterAverage();
    }
  }
}

const handleEntryEdit = (e) => {
  
  const itemIndex = e.target.index;
  const entry = document.querySelectorAll('.entry--js')
  [itemIndex];
  const entryHeader = document.querySelectorAll('.entry__header--js')
  [itemIndex];
  const entryValue = document.querySelectorAll('.entry__value--js')
  [itemIndex];
  const editSection = document.querySelectorAll('.edition--js')
  [itemIndex];
  const decreaseButton = document.querySelectorAll('.edition__button--js-decrease')
  [itemIndex];
  const increaseButton = document.querySelectorAll('.edition__button--js-increase')
  [itemIndex];
  const cancelButton = document.querySelectorAll('.edition__button--js-cancel')
  [itemIndex];
  const saveButton = document.querySelectorAll('.edition__button--js-save')
  [itemIndex];

  const toggleItemDisplay = () => {

    for (const editButton of editSection.children) {
      editButton.classList.toggle('edition__button--visible');
    }

    editSection.classList.toggle('edition--visible');
    entry.classList.toggle('entry--edit-mode');
    entryHeader.classList.toggle('entry__header--edit-mode');

    itemIndex === loggedUser.entries.length - 1
    ? removeEntryButton.classList.toggle('entry__remove--hidden')
    : false;
  }
  
  const exitEditMode = () => {

    const { value, id } = loggedUser.entries[itemIndex];
    
    toggleItemDisplay();
    entryValue.textContent = value;
    handleEmoji(id, value);

    window.removeEventListener('click', handleEdition);
    window.removeEventListener('keydown', handleEdition);
  }
  
  const handleEdition = (e) => {

    const self = e.keyCode || e.target;
    let dayValue = parseInt(entryValue.textContent);
    const { waterMax } = loggedUser;
    const { id, value } = loggedUser.entries[itemIndex];

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
        loggedUser.entries[itemIndex].value = dayValue;
        updateJSON(loggedUser);
        exportJSON();
        handleWaterAverage();
        exitEditMode();
      break;
    }
  }
  
  toggleItemDisplay();
  window.addEventListener('click', handleEdition);
  window.addEventListener('keydown', handleEdition);
}
//#endregion

//#region [ HorizonDark ] STATS

const handleStatsDOM = (user) => {

  // get html codes of user card and user props
  const { name, key } = user;
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

  const users = getArrayOfUsers();
  const usersTotal = Object.keys(hydrappJSON.users).length;

  // create DOM structure
  statsContainer.innerHTML = '';
  [...users].forEach(user => handleStatsDOM(user));

  // make logged in user's card visible
  const loggedUserCard = statsContainer.querySelector(`.card--js-${loggedUser.key}`);
  const cardIndex = [...loggedUserCard.parentNode.children].indexOf(loggedUserCard);
  loggedUserCard.classList.add('card--visible');

  // set visibility and events for card navigation buttons
  const allButtons = statsContainer.querySelectorAll('[class*=card__button--js');
  if (usersTotal > 1) {
    [...allButtons].forEach(button => {
      button.addEventListener('click', slideCard);
    });
  }
  handleCardButtons(statsContainer, cardIndex);
}

//#endregion

//#region [ HorizonDark ] SETTINGS
  
const setSettingsDOM = () => {

  // get html codes of user card and user settings
  const { name } = loggedUser;
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
  removeButton.addEventListener('click', toggleUserRemoveConfirmation);
}

const handleSettingsEdition = (e) => {

  const self = e.target;
  const { id } = self;
  const prop = id.replace('EditButton', '');
  const value = loggedUser[prop];

  const userProp = findFirstParentOfClass(self, 'userProp');
  const propName = userProp.querySelector('.userProp__label--js');
  const output = userProp.querySelector('.userProp__output--js');
  const input = userProp.querySelector('.userProp__input--js');
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
    output.classList.toggle('userProp__output--hidden');
    input.classList.toggle('userProp__input--visible');
    input.focus();

    // change placeholder of edited input
    input.value = '';
    input.placeholder = prop === 'weight'
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
    if (prop !== 'name') input.removeEventListener('keyup', filterUserInput);
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
        
        // set new value
        const newValue = typeof value === 'number'
        ? parseInt(input.value)
        : input.value;

        if (value === newValue || isInputValid(input, prop, inputAlert)) {

          // handle user name and login change
          if (prop === 'name' && newValue !== value) {
            const oldLogin = getFormattedString(value);
            const newLogin = getFormattedString(newValue);

            delete hydrappJSON.users[oldLogin];
            loggedUser.name = newValue;
            loggedUser.login = newLogin;
            hydrappJSON.loggedUser = newLogin;
            hydrappJSON.users[newLogin] = loggedUser;
            settingsHeading.textContent = newValue;
            
          // handle numerical settings
          } else if (newValue !== value) {
            loggedUser[prop] = newValue;
          }

          output.textContent = getGlasses(prop, newValue);
          exportJSON();
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
  if (typeof value === 'number') input.addEventListener('keyup', filterUserInput);
}

const quitLanding = () => {
  handleWaterLevel(0);
  levelAvg.style.bottom = '0';
  levelMin.style.bottom = 0;
  showLoginBox();
  closeTabContainers();
  appUser.classList.add('app__user--visible');
} 

const handleUserLogOut = () => {
  hydrappJSON.loggedUser = '';
  exportJSON();
  quitLanding();
}

const toggleUserRemoveConfirmation = () => {
  
  const userRemove = document.querySelector('.userRemove--js');
  const removeButton = document.querySelector('.userRemove__confirm--js');
  const cancelButton = document.querySelector('.userRemove__cancel--js');
  const isActive = userRemove.classList.contains('userRemove--visible');

  if (!isActive) {
    userRemove.classList.add('userRemove--visible');
    removeButton.addEventListener('click', handleUserRemove);
    cancelButton.addEventListener('click', toggleUserRemoveConfirmation);

  } else {
    userRemove.classList.remove('userRemove--visible');
    removeButton.removeEventListener('click', handleUserRemove);
    cancelButton.removeEventListener('click', toggleUserRemoveConfirmation);
  }
}

const handleUserRemove = () => {
  const { loggedUser } = hydrappJSON;
  delete hydrappJSON.users[loggedUser];
  hydrappJSON.loggedUser = '';
  exportJSON();
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
    this.name = '';
    this.login = '';
    this.age = 0;
    this.weight = 0;
    this.height = 0;
    this.waterMax = 20;
    this.waterMin = 8;
    this.waterAvg = 0;
    this.rank = 0;
    this._dateCreated = date;    
    this._key = date;
    this.entries = [];
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
    this.dateCreated = `${dateTime}, ${hourTime}`;
  }
  get _key() {
    return this.key;
  }
  set _key(date) {
    this.key = date.getTime();
  }
}

class Entry {
  constructor(value, date) {
    this.value = value;
    this._dateKey = date;
    this._date = date;
    this._day = date;
    this._id = this.date;
  }
  get _dateKey() {
    return this.dateKey;
  }
  set _dateKey(date) {
    this.dateKey = getOffsetedDate(date)
    .toISOString()
    .slice(0,10);
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
    this.day = userHelper.weekDays[date.getDay()];
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
    wavePeriodsTotal: 4
  }
};

//#endregion
//#region [ HorizonDark ] VARIABLES - LOGIN BOX

const loginBox = document.querySelector('.loginBox--js');
const loginInput = document.querySelector('.loginBox__input--js');
const loginAlert = document.querySelector('.loginBox__alert--js');
const loginButton = loginBox.querySelector('.loginBox__button--js-logIn');
const signUpButton = loginBox.querySelector('.loginBox__button--js-signUp');

loginButton.addEventListener('click', handleLoginBox);
signUpButton.addEventListener('click', createNewUser);
loginInput.addEventListener('keydown', handleLoginBox);

//#endregion
//#region [ HorizonDark ] VARIABLES - FLAGS

let isFirstAppLoad = true;
let isNewUserDOM = false;
let isSidebarActive = false;

//#endregion
//#region [ HorizonDark ] VARIABLES - APP

const localStorageKeyName = 'hydrapp';
const mediaMd = 768;
const mediaLg = 1200;
let slideTimeoutId = null;
let startWaterValue = 0;

const userHelper = {
  name: {
    label: 'Name',
    maxLength: 20
  },
  age: {
    label: 'Age',
    maxLength: 3,
    min: 10,
    max: 120
  },
  weight: {
    label: 'Weight',
    maxLength: 3,
    min: 8,
    max: 200
  },
  height: {
    label: 'Height',
    maxLength: 3,
    min: 70,
    max: 250
  },
  waterMax: {
    label: 'Maximum per day',
    alertLabel: 'Maximum amount of glasses per day',
    maxLength: 2,
    min: 10,
    max: 40
  },
  waterMin: { label: 'Minimum per day' },
  waterAvg: { label: 'Average per day' },
  rank: { label: 'Ranking position' },
  questionsProps: ['name', 'age', 'weight', 'height'],
  settingsProps: ['name', 'age', 'weight', 'height', 'waterMax'],
  statsProps: ['waterMin', 'waterAvg', 'rank'],
  weekDays: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]
}

const appHeader = document.querySelector('.app__header--js');
const appUser = document.querySelector('.app__user--js');
const appNewUser = document.querySelector('.app__newUser--js');
const appLanding = document.querySelector('.app__landing--js');
const appWater = document.querySelector('.app__water--js');
const appSidebar = document.querySelector('.app__sidebar--js');

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

//#region [ HorizonDark ] APP LOADING

const loadApp = () => {

  updateUsersEntries();
  updateUsersStats();
  setArchiveDOM();
  handleStats();
  setSettingsDOM();
  setWaterMeasureDOM();
  setEmojiDOM();
  handleCounter(landingCounter, startWaterValue);
  handleCounter(newEntryCounter, 0);
  handleCounterMessage(startWaterValue);
  handleLandingCounterDate();
  handleEmoji('controls', startWaterValue);
  handleEmoji('newEntry', 0);
  setWaterWaves();
  handleWaterLevel(startWaterValue);
  handleWaterMin(startWaterValue);
  handleWaterAverage();
  handleWaterShake();
  handleWaterMeasure();
  handleWeekHeading();

  appLanding.classList.add('app__landing--visible');
  appUser.classList.remove('app__user--visible');

  if (isFirstAppLoad) {
    landingControls.addEventListener('click', handleWaterChange);
    window.addEventListener('resize', handleWindowResize);
    burgerBtn.addEventListener('click', toggleSidebar);
    appSidebar.addEventListener('click', toggleSidebarTabs);
  }
  isFirstAppLoad = false;
}

//#endregion

//#region [ HorizonDark ] FUNCTION CALLS

// create JSON object with initial users on first app load
let hydrappJSON;
fetchJSON();
if (!hydrappJSON) {
  addInitialUsers();
  fetchJSON();
}

// automatically log in unlogged user
let { loggedUser } = hydrappJSON;

if (loggedUser !== '') {
  loggedUser = hydrappJSON.users[loggedUser];
  loadApp() 
} else {
  showLoginBox();
}
//setIntroWaves();

//#endregion



toggleSidebar(burgerBtn);