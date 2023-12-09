import { addListener, getNodeValue, setNodeInnerText } from './utils';

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
    addListener(id, 'click', callback);
  }

  setupEventListeners() {
    this.clickBtn('btn_save', this.handleBtnSaveClick.bind(this));
    this.clickBtn('btn_generate', this.handleBtnGenerateClick.bind(this));
    this.clickBtn('btn_exit', this.handleBtnExitClick.bind(this));
  }

  handleBtnSaveClick() {
    const inputs = document.querySelectorAll('.input-js');
    const isError = this.validateInputs(inputs);
    const userNumber = document.getElementById('guess');

    if (!isError) {
      this.updateGameSettings();
      this.removeDisableBtn('btn_generate');
      this.disableBtn('btn_save');
      userNumber.value = '';
      setNodeInnerText('message', 'Почати...');
    }
  }

  handleBtnGenerateClick() {
    this.disableBtn('btn_save');
    const userNumber = Number(document.getElementById('guess').value);
    this.checkUserNumber(userNumber);
  }

  handleBtnExitClick() {
    this.resetGame();
  }

  validateInputs(inputs) {
    let isError = false;

    inputs.forEach((input) => {
      if (!this.isValidationNumber(input.value)) {
        this.handleInputError(input, 'Числа попинні бути не негативні та цілими!');
        this.disableBtn('btn_generate');
        isError = true;
      } else if (input.id === 'min' || input.id === 'max') {
        if (this.validationMinAndMax(input.value)) {
          this.handleInputError(input, 'Можливий діапазон чисел від 1 до 200!');
          this.disableBtn('btn_generate');
          isError = true;
        }
      } else if (input.id === 'attempt') {
        if (this.validationAttempt(input.value)) {
          this.handleInputError(input, 'Можлива кількість спроб від 1 до 15!');
          this.disableBtn('btn_generate');
          isError = true;
        }
        setNodeInnerText('attempt', this.attempt);
      } else {
        isError = false;
      }
    });
    return isError;
  }

  handleInputError(input, message) {
    input.classList.add('bounce');
    setNodeInnerText('error', message);

    setTimeout(function () {
      input.classList.remove('bounce');
      setNodeInnerText('error', '');
    }, 1100);
  }

  updateGameSettings() {
    const message = document.getElementById('message');
    const secretContainer = document.getElementById('secret');
    const body = document.querySelector('body');

    this.saveSettings();
    this.renderSettingsToTitle();
    body.removeAttribute('style');

    message.classList.remove('lost');
    message.classList.remove('win');
    secretContainer.classList.remove('shake');

    secretContainer.classList.add('base');
    secretContainer.classList.remove('container-lost');
    setNodeInnerText('secret', '?');
  }

  resetGame() {
    const inputMin = document.getElementById('min');
    const inputMax = document.getElementById('max');
    const inputAttempt = document.getElementById('attempt');
    const userNumber = document.getElementById('guess');
    const message = document.getElementById('message');
    const secretContainer = document.getElementById('secret');
    const body = document.querySelector('body');

    body.removeAttribute('style');

    message.classList.remove('lost');
    message.classList.remove('win');
    secretContainer.classList.remove('shake');

    secretContainer.classList.add('base');
    secretContainer.classList.remove('container-lost');

    setNodeInnerText('secret', '?');

    this.removeDisableBtn('btn_save');
    this.removeDisableBtn('btn_generate');

    inputMin.value = '1';
    inputMax.value = '100';
    inputAttempt.value = '5';
    userNumber.value = '';

    this.min = 1;
    this.max = 100;
    this.attempt = 5;
    this.secretNumber = this.generateRandomNumber(this.min, this.max);
    setNodeInnerText('message', 'Почати...');
    setNodeInnerText('attempt', '5');
  }

  checkUserNumber(userNumber) {
    const secretContainer = document.getElementById('secret');
    const message = document.getElementById('message');
    const body = document.querySelector('body');

    if (!userNumber) {
      setNodeInnerText('message', 'Не число!');
    } else if (userNumber === this.secretNumber) {
      this.handleCorrectGuess(body, message, secretContainer);
    } else {
      this.handleIncorrectGuess(userNumber, body, message, secretContainer);
    }
  }

  handleCorrectGuess(body, message, secretContainer) {
    setNodeInnerText('secret', this.secretNumber);
    setNodeInnerText('message', 'Ви виграли!');
    body.style.background = '#3d7e52';
    message.classList.add('win');
    secretContainer.classList.add('shake');
    this.disableBtn('btn_generate');
    this.removeDisableBtn('btn_save');
  }

  handleIncorrectGuess(userNumber, body, message, secretContainer) {
    if (this.attempt > 1) {
      setNodeInnerText('message', userNumber > this.secretNumber ? 'Занадто велике!' : 'Занадто маленьке!');
      this.attempt--;
      setNodeInnerText('attempt_count', this.attempt);
    } else {
      setNodeInnerText('message', 'Ви програли!');
      message.classList.add('lost');
      setNodeInnerText('secret', this.secretNumber);
      secretContainer.classList.remove('base');
      secretContainer.classList.add('shake');
      secretContainer.classList.add('container-lost');
      setNodeInnerText('attempt_count', '0');
      this.disableBtn('btn_generate');
      this.removeDisableBtn('btn_save');
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

  removeDisableBtn(id) {
    const btn = document.getElementById(id);
    btn.disabled = false;
  }

  disableBtn(id) {
    const btn = document.getElementById(id);
    btn.disabled = true;
  }
}
