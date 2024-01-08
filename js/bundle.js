
export class Game {
  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.min = 1;
    this.max = 100;
    this.attempt = 5;
    this.secretNumber = this.generateRandomNumber(this.min, this.max);

    setNodeInnerText('message', 'Почати...');
    this.setupEventListeners();
  }

  clickBtn(id, callback) {
    addEventToElement(id, 'click', callback);
  }

  setupEventListeners() {
    this.clickBtn('btn_save', this.handleBtnSaveClick.bind(this));
    this.clickBtn('btn_generate', this.handleBtnGenerateClick.bind(this));
    this.clickBtn('btn_exit', this.handleBtnExitClick.bind(this));
  }

  handleBtnSaveClick() {
    const inputs = document.querySelectorAll('.input-js');
    const isError = this.validateInputs(inputs);

    if (!isError) {
      this.updateGameSettings();
      enableButton('btn_generate');
      disableBtn('btn_save');
      setNodeValue('guess', '');
      setNodeInnerText('message', 'Почати...');
    }
  }

  handleBtnGenerateClick() {
    disableBtn('btn_save');
    const userNumber = Number(getNodeValue('guess'));
    this.checkUserNumber(userNumber);
  }

  handleBtnExitClick() {
    this.resetGame();
  }

  validateInputs(inputs) {
    let isError = false;

    inputs.forEach((input) => {
      if (!this.isValidationNumber(input.value)) {
        this.handleInputError(input.id, 'Числа попинні бути не негативні та цілими!');
        disableBtn('btn_generate');
        isError = true;
      } else if (input.id === 'min' || input.id === 'max') {
        if (this.validationMinAndMax(input.value)) {
          this.handleInputError(input.id, 'Можливий діапазон чисел від 1 до 200!');
          disableBtn('btn_generate');
          isError = true;
        }
      } else if (input.id === 'attempt') {
        if (this.validationAttempt(input.value)) {
          this.handleInputError(input.id, 'Можлива кількість спроб від 1 до 15!');
          disableBtn('btn_generate');
          isError = true;
        }
        setNodeInnerText('attempt', this.attempt);
      } else {
        isError = false;
      }
    });
    return isError;
  }

  handleInputError(inputId, message) {
    addClassToElement(inputId, 'bounce');
    setNodeInnerText('error', message);

    setTimeout(function () {
      removeClassFromElement(inputId, 'bounce');
      setNodeInnerText('error', '');
    }, 1100);
  }

  updateGameSettings() {
    const body = document.querySelector('body');

    this.saveSettings();
    this.renderSettingsToTitle();
    body.removeAttribute('style');

    removeClassFromElement('message', 'win');
    removeClassFromElement('message', 'lost');
    removeClassFromElement('secret', 'shake');

    addClassToElement('secret', 'base');
    removeClassFromElement('secret', 'container-lost');
    setNodeInnerText('secret', '?');
  }

  resetGame() {
    const body = document.querySelector('body');

    body.removeAttribute('style');

    removeClassFromElement('message', 'lost');
    removeClassFromElement('message', 'win');
    removeClassFromElement('secret', 'shake');

    addClassToElement('secret', 'base');
    removeClassFromElement('secret', 'container-lost');

    setNodeInnerText('secret', '?');

    enableButton('btn_save');
    enableButton('btn_generate');

    setNodeValue('min', '1');
    setNodeValue('max', '100');
    setNodeValue('attempt', '5');
    setNodeValue('guess', '');

    this.min = 1;
    this.max = 100;
    this.attempt = 5;
    this.secretNumber = this.generateRandomNumber(this.min, this.max);
    setNodeInnerText('message', 'Почати...');
    setNodeInnerText('attempt', '5');
  }

  checkUserNumber(userNumber) {
    const body = document.querySelector('body');

    if (!userNumber) {
      setNodeInnerText('message', 'Не число!');
    } else if (userNumber === this.secretNumber) {
      this.handleCorrectGuess(body);
    } else {
      this.handleIncorrectGuess(userNumber);
    }
  }

  handleCorrectGuess(body) {
    setNodeInnerText('secret', this.secretNumber);
    setNodeInnerText('message', 'Ви виграли!');
    body.style.background = '#3d7e52';
    addClassToElement('message', 'win');
    addClassToElement('secret', 'shake');
    disableBtn('btn_generate');
    enableButton('btn_save');
  }

  handleIncorrectGuess(userNumber) {
    if (this.attempt > 1) {
      setNodeInnerText('message', userNumber > this.secretNumber ? 'Занадто велике!' : 'Занадто маленьке!');
      this.attempt--;
      setNodeInnerText('attempt_count', this.attempt);
    } else {
      setNodeInnerText('message', 'Ви програли!');
      addClassToElement('message', 'lost');
      setNodeInnerText('secret', this.secretNumber);
      removeClassFromElement('secret', 'base');
      addClassToElement('secret', 'shake');
      addClassToElement('secret', 'container-lost');
      setNodeInnerText('attempt_count', '0');
      disableBtn('btn_generate');
      enableButton('btn_save');
    }
  }

  renderSettingsToTitle() {
    setNodeInnerText('min_number_text', getNodeValue('min'));
    setNodeInnerText('max_number_text', getNodeValue('max'));
    setNodeInnerText('attempt_text', getNodeValue('attempt'));
    setNodeInnerText('attempt_count', getNodeValue('attempt'));
  }

  saveSettings() {
    this.min = getNodeValue('min');
    this.max = getNodeValue('max');
    this.attempt = getNodeValue('attempt');
    this.secretNumber = this.generateRandomNumber(Number(getNodeValue('min')), Number(getNodeValue('max')));
  }

  generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  isValidationNumber(value) {
    return !(!Number.isInteger(Number(value)) || Math.sign(value) < 0);
  }

  validationAttempt(value) {
    return value > 15 || value <= 0;
  }

  validationMinAndMax(value) {
    return value > 200 || value <= 0;
  }
}


export function init() {
  new Game();
}

document.addEventListener('DOMContentLoaded', init);

export function addEventToElement(id, eventType, callback) {
  const node = document.getElementById(id);
  if (node) {
    node.addEventListener(eventType, callback);
  }
}

export function getNodeValue(id) {
  const node = document.getElementById(id);
  if (node) {
    return node.value;
  }
  return '';
}

export function setNodeValue(id, value) {
  const node = document.getElementById(id);
  if (node) {
    return (node.value = value);
  }
  return '';
}

export function setNodeInnerText(id, value = '') {
  const node = document.getElementById(id);
  if (node) {
    node.innerText = value;
    return true;
  }
  return false;
}

export function enableButton(id) {
  const btn = document.getElementById(id);
  btn.disabled = false;
}

export function disableBtn(id) {
  const btn = document.getElementById(id);
  btn.disabled = true;
}

export function addClassToElement(id, className) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add(className);
  }
}

export function removeClassFromElement(id, className) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.remove(className);
  }
}
