!function(e){var n={};function t(l){if(n[l])return n[l].exports;var c=n[l]={i:l,l:!1,exports:{}};return e[l].call(c.exports,c,c.exports,t),c.l=!0,c.exports}t.m=e,t.c=n,t.d=function(e,n,l){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:l})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var l=Object.create(null);if(t.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var c in e)t.d(l,c,function(n){return e[n]}.bind(null,c));return l},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(module,exports,__webpack_require__){"use strict";eval("\n\nif ('serviceWorker' in navigator) {\n  window.addEventListener('load', function() {\n    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {\n      // Registration was successful\n      console.log('ServiceWorker registration successful with scope: ', registration.scope);\n    }, function(err) {\n      // registration failed :(\n      console.log('ServiceWorker registration failed: ', err);\n    });\n  });\n}\n\n/********** VARIABLES **********/\n\nconst addGlass = document.querySelector('.app__button--js-add');\nconst removeGlass = document.querySelector('.app__button--js-remove');\nconst counter = document.querySelector('.glass__counter--js');\nconst historyList = document.querySelector('.history__list--js');\n\n/********** FUNCTIONS **********/\n\n// create hydrApp date key\nconst setDateKey = (obj) => {\n  const prefix = 'hydrApp-';\n  const date = obj.toISOString().slice(0,10);\n  return prefix.concat(date);\n}\n\n// create key value pair in localStorage\nconst setNewKeyValue = (key, value) => {\n  if ( !localStorage.getItem(key) ) {\n    localStorage.setItem(key, value);\n  };\n}\n\nconst getHydrappKeys = () => {\n  // create array of hydrApp localStorage keys\n  const regex = /hydrApp-/;\n  return Object\n  .keys(localStorage)\n  .filter(key => regex.test(key))\n  .sort((a,b) => a<b);\n}\n\nconst setCounter = () => {\n  let date = new Date();\n  let dateKey = setDateKey(date);\n\n  setNewKeyValue(dateKey, 0);\n\n  const hydrappKeys = getHydrappKeys();\n  const oldestKey = hydrappKeys[hydrappKeys.length-1];\n\n  // autocomplete missing keys\n  if ( hydrappKeys.length > 1 ) {\n    let limit = 0; // for tests to avoid loop error\n\n    while (setDateKey(date) !== oldestKey && limit < 50) {\n      date.setDate( date.getDate() - 1 );\n      const prevDateKey = setDateKey(date);\n      setNewKeyValue(prevDateKey, 0);\n      limit++;\n    }\n  }\n  counter.innerHTML = localStorage.getItem(dateKey);\n}\n\nconst setHistory = () => {\n  const hydrappKeys = getHydrappKeys();\n\n  for (const key of hydrappKeys) {\n    const value = localStorage.getItem(key);\n    const date = key\n      .replace('hydrApp-','')\n      .split('-')\n      .reverse()\n      .join(' ');\n\n    historyList.innerHTML += `\n    <li class=\"history__item\">\n      <span>${date}</span>\n      <span>${value}</span>\n    </li>\n    `;\n  }\n\n}\n\nconst updateCounter = (e) => {\n  const key = setDateKey(new Date());\n  const value = parseInt(localStorage.getItem(key));\n  let newValue;\n\n  if (e.target === addGlass) {\n    value < 100 ? newValue = value + 1 : newValue = 100;\n  } else if (e.target === removeGlass) {\n    value > 0 ? newValue = value - 1 : newValue = 0;\n  }\n\n  localStorage.setItem(key, newValue);\n  counter.innerHTML = newValue;\n}\n\n\nsetCounter();\nsetHistory();\naddGlass.addEventListener('click', updateCounter);\nremoveGlass.addEventListener('click', updateCounter);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLEtBQUs7QUFDbkIsY0FBYyxNQUFNO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJ3NlcnZpY2V3b3JrZXIuanMnKS50aGVuKGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xuICAgICAgLy8gUmVnaXN0cmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3VjY2Vzc2Z1bCB3aXRoIHNjb3BlOiAnLCByZWdpc3RyYXRpb24uc2NvcGUpO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZCA6KFxuICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJywgZXJyKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKioqKioqKioqIFZBUklBQkxFUyAqKioqKioqKioqL1xuXG5jb25zdCBhZGRHbGFzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcHBfX2J1dHRvbi0tanMtYWRkJyk7XG5jb25zdCByZW1vdmVHbGFzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcHBfX2J1dHRvbi0tanMtcmVtb3ZlJyk7XG5jb25zdCBjb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdsYXNzX19jb3VudGVyLS1qcycpO1xuY29uc3QgaGlzdG9yeUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGlzdG9yeV9fbGlzdC0tanMnKTtcblxuLyoqKioqKioqKiogRlVOQ1RJT05TICoqKioqKioqKiovXG5cbi8vIGNyZWF0ZSBoeWRyQXBwIGRhdGUga2V5XG5jb25zdCBzZXREYXRlS2V5ID0gKG9iaikgPT4ge1xuICBjb25zdCBwcmVmaXggPSAnaHlkckFwcC0nO1xuICBjb25zdCBkYXRlID0gb2JqLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwxMCk7XG4gIHJldHVybiBwcmVmaXguY29uY2F0KGRhdGUpO1xufVxuXG4vLyBjcmVhdGUga2V5IHZhbHVlIHBhaXIgaW4gbG9jYWxTdG9yYWdlXG5jb25zdCBzZXROZXdLZXlWYWx1ZSA9IChrZXksIHZhbHVlKSA9PiB7XG4gIGlmICggIWxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkgKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gIH07XG59XG5cbmNvbnN0IGdldEh5ZHJhcHBLZXlzID0gKCkgPT4ge1xuICAvLyBjcmVhdGUgYXJyYXkgb2YgaHlkckFwcCBsb2NhbFN0b3JhZ2Uga2V5c1xuICBjb25zdCByZWdleCA9IC9oeWRyQXBwLS87XG4gIHJldHVybiBPYmplY3RcbiAgLmtleXMobG9jYWxTdG9yYWdlKVxuICAuZmlsdGVyKGtleSA9PiByZWdleC50ZXN0KGtleSkpXG4gIC5zb3J0KChhLGIpID0+IGE8Yik7XG59XG5cbmNvbnN0IHNldENvdW50ZXIgPSAoKSA9PiB7XG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgbGV0IGRhdGVLZXkgPSBzZXREYXRlS2V5KGRhdGUpO1xuXG4gIHNldE5ld0tleVZhbHVlKGRhdGVLZXksIDApO1xuXG4gIGNvbnN0IGh5ZHJhcHBLZXlzID0gZ2V0SHlkcmFwcEtleXMoKTtcbiAgY29uc3Qgb2xkZXN0S2V5ID0gaHlkcmFwcEtleXNbaHlkcmFwcEtleXMubGVuZ3RoLTFdO1xuXG4gIC8vIGF1dG9jb21wbGV0ZSBtaXNzaW5nIGtleXNcbiAgaWYgKCBoeWRyYXBwS2V5cy5sZW5ndGggPiAxICkge1xuICAgIGxldCBsaW1pdCA9IDA7IC8vIGZvciB0ZXN0cyB0byBhdm9pZCBsb29wIGVycm9yXG5cbiAgICB3aGlsZSAoc2V0RGF0ZUtleShkYXRlKSAhPT0gb2xkZXN0S2V5ICYmIGxpbWl0IDwgNTApIHtcbiAgICAgIGRhdGUuc2V0RGF0ZSggZGF0ZS5nZXREYXRlKCkgLSAxICk7XG4gICAgICBjb25zdCBwcmV2RGF0ZUtleSA9IHNldERhdGVLZXkoZGF0ZSk7XG4gICAgICBzZXROZXdLZXlWYWx1ZShwcmV2RGF0ZUtleSwgMCk7XG4gICAgICBsaW1pdCsrO1xuICAgIH1cbiAgfVxuICBjb3VudGVyLmlubmVySFRNTCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGRhdGVLZXkpO1xufVxuXG5jb25zdCBzZXRIaXN0b3J5ID0gKCkgPT4ge1xuICBjb25zdCBoeWRyYXBwS2V5cyA9IGdldEh5ZHJhcHBLZXlzKCk7XG5cbiAgZm9yIChjb25zdCBrZXkgb2YgaHlkcmFwcEtleXMpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgY29uc3QgZGF0ZSA9IGtleVxuICAgICAgLnJlcGxhY2UoJ2h5ZHJBcHAtJywnJylcbiAgICAgIC5zcGxpdCgnLScpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuam9pbignICcpO1xuXG4gICAgaGlzdG9yeUxpc3QuaW5uZXJIVE1MICs9IGBcbiAgICA8bGkgY2xhc3M9XCJoaXN0b3J5X19pdGVtXCI+XG4gICAgICA8c3Bhbj4ke2RhdGV9PC9zcGFuPlxuICAgICAgPHNwYW4+JHt2YWx1ZX08L3NwYW4+XG4gICAgPC9saT5cbiAgICBgO1xuICB9XG5cbn1cblxuY29uc3QgdXBkYXRlQ291bnRlciA9IChlKSA9PiB7XG4gIGNvbnN0IGtleSA9IHNldERhdGVLZXkobmV3IERhdGUoKSk7XG4gIGNvbnN0IHZhbHVlID0gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGxldCBuZXdWYWx1ZTtcblxuICBpZiAoZS50YXJnZXQgPT09IGFkZEdsYXNzKSB7XG4gICAgdmFsdWUgPCAxMDAgPyBuZXdWYWx1ZSA9IHZhbHVlICsgMSA6IG5ld1ZhbHVlID0gMTAwO1xuICB9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSByZW1vdmVHbGFzcykge1xuICAgIHZhbHVlID4gMCA/IG5ld1ZhbHVlID0gdmFsdWUgLSAxIDogbmV3VmFsdWUgPSAwO1xuICB9XG5cbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBuZXdWYWx1ZSk7XG4gIGNvdW50ZXIuaW5uZXJIVE1MID0gbmV3VmFsdWU7XG59XG5cblxuc2V0Q291bnRlcigpO1xuc2V0SGlzdG9yeSgpO1xuYWRkR2xhc3MuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB1cGRhdGVDb3VudGVyKTtcbnJlbW92ZUdsYXNzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlQ291bnRlcik7Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n")}]);