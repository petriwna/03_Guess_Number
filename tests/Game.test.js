import { Game } from '../src/js/Game';
import {
  addClassToElement,
  addEventToElement,
  disableBtn,
  enableButton,
  getNodeValue,
  removeClassFromElement,
  setNodeInnerText,
  setNodeValue,
} from '../src/js/utils';

jest.mock('../src/js/utils', () => {
  const originalModule = jest.requireActual('../src/js/utils');

  return {
    __esModule: true,
    ...originalModule,
    setNodeInnerText: jest.fn(() => true),
    addEventToElement: jest.fn(() => true),
    enableButton: jest.fn(),
    disableBtn: jest.fn(),
    getNodeValue: jest.fn(),
    setNodeValue: jest.fn(),
    addClassToElement: jest.fn(),
    removeClassFromElement: jest.fn(),
  };
});

document.getElementById = jest.fn();
document.querySelectorAll = jest.fn();

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeGame', () => {
    test('should set initial game values and call setNodeInnerText', () => {
      expect(game.min).toEqual(1);
      expect(game.max).toEqual(100);
      expect(game.attempt).toEqual(5);
      expect(typeof game.secretNumber).toBe('number');
      expect(setNodeInnerText).toHaveBeenCalledWith('message', 'Почати...');
    });
  });

  describe('clickBtn', () => {
    test('should call addListener with the correct arguments', () => {
      game.clickBtn('btn_save', game.handleBtnSaveClick);
      expect(addEventToElement).toHaveBeenCalledWith('btn_save', 'click', game.handleBtnSaveClick);
    });
    test('should call addListener with the correct arguments', () => {
      game.clickBtn('btn_generate', game.handleBtnGenerateClick);
      expect(addEventToElement).toHaveBeenCalledWith('btn_generate', 'click', game.handleBtnGenerateClick);
    });
  });

  describe('setupEventListeners', () => {
    test('should call clickBtn with the correct arguments for each button', () => {
      jest.spyOn(game, 'handleBtnSaveClick');
      jest.spyOn(game, 'handleBtnGenerateClick');
      jest.spyOn(game, 'handleBtnExitClick');

      const clickBtnSpy = jest.spyOn(game, 'clickBtn');

      game.setupEventListeners();

      expect(clickBtnSpy).toHaveBeenCalledWith('btn_save', expect.any(Function));
      expect(clickBtnSpy).toHaveBeenCalledWith('btn_generate', expect.any(Function));
      expect(clickBtnSpy).toHaveBeenCalledWith('btn_exit', expect.any(Function));
    });
  });

  describe('handleBtnSaveClick', () => {
    test('should update game settings and reset inputs when no input error', () => {
      document.body.innerHTML = '<input id="guess" value="42" />';
      document.body.innerHTML += '<div class="input-js"></div>';

      jest.spyOn(game, 'validateInputs').mockReturnValue(false);

      game.handleBtnSaveClick();

      expect(enableButton).toHaveBeenCalledWith('btn_generate');
      expect(disableBtn).toHaveBeenCalledWith('btn_save');
      expect(setNodeValue).toHaveBeenCalledWith('guess', '');
      expect(setNodeInnerText).toHaveBeenCalledWith('message', 'Почати...');
    });

    test('should not update game settings and inputs when input error', () => {
      document.body.innerHTML = '<input id="guess" value="invalid" />';
      document.body.innerHTML += '<div class="input-js"></div>';

      jest.spyOn(game, 'validateInputs').mockReturnValue(true);

      game.handleBtnSaveClick();

      expect(enableButton).not.toHaveBeenCalled();
      expect(disableBtn).not.toHaveBeenCalled();
      expect(setNodeValue).not.toHaveBeenCalled();
    });
  });

  describe('handleBtnGenerateClick', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should disable save button and check user number for correct guess', () => {
      document.body.innerHTML = '<input id="guess" value="42" />';

      getNodeValue.mockReturnValue('42');

      jest.spyOn(game, 'checkUserNumber').mockImplementation((userNumber) => {
        expect(userNumber).toBe(42);
      });

      game.handleBtnGenerateClick();

      expect(disableBtn).toHaveBeenCalledWith('btn_save');
      expect(getNodeValue).toHaveBeenCalledWith('guess');
    });
  });

  describe('handleBtnExitClick', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should call resetGame', () => {
      const resetGameMock = jest.fn();

      jest.spyOn(game, 'resetGame').mockImplementation(resetGameMock);

      game.handleBtnExitClick();

      expect(resetGameMock).toHaveBeenCalled();
    });
  });

  describe('validateInputs', () => {
    test('should return false for valid inputs', () => {
      const isValidationNumberMock = jest.fn().mockReturnValue(true);
      const validationMinAndMaxMock = jest.fn().mockReturnValue(false);
      const validationAttemptMock = jest.fn().mockReturnValue(false);

      jest.spyOn(game, 'isValidationNumber').mockImplementation(isValidationNumberMock);
      jest.spyOn(game, 'validationMinAndMax').mockImplementation(validationMinAndMaxMock);
      jest.spyOn(game, 'validationAttempt').mockImplementation(validationAttemptMock);

      const input1 = { id: 'example1', value: '10' };
      const input2 = { id: 'min', value: '250' };
      const input3 = { id: 'attempt', value: '20' };

      const inputs = [input1, input2, input3];

      const result = game.validateInputs(inputs);

      expect(result).toBe(false);
      expect(isValidationNumberMock).toHaveBeenCalledTimes(3);
      expect(validationMinAndMaxMock).toHaveBeenCalledTimes(1);
      expect(validationAttemptMock).toHaveBeenCalledTimes(1);
    });

    test('should call handleInputError and disableBtn when isValidationNumber returns false', () => {
      const input = { id: 'testId', value: 'invalidValue' };
      const handleInputErrorMock = jest.fn();
      jest.spyOn(game, 'isValidationNumber').mockReturnValue(false);
      jest.spyOn(game, 'handleInputError').mockImplementation(handleInputErrorMock);

      game.validateInputs([input]);

      expect(handleInputErrorMock).toHaveBeenCalledWith('testId', 'Числа попинні бути не негативні та цілими!');
      expect(disableBtn).toHaveBeenCalledWith('btn_generate');
    });

    test('should not call handleInputError and disableBtn when isValidationNumber returns true', () => {
      const handleInputErrorMock = jest.fn();

      jest.spyOn(game, 'isValidationNumber').mockReturnValue(true);
      jest.spyOn(game, 'handleInputError').mockImplementation(handleInputErrorMock);

      const input = { id: 'testId', value: 'validValue' };

      game.validateInputs([input]);

      expect(handleInputErrorMock).not.toHaveBeenCalled();
      expect(disableBtn).not.toHaveBeenCalled();
    });

    test('should call handleInputError and disableBtn when validationMinAndMax returns true', () => {
      const handleInputErrorMock = jest.fn();

      jest.spyOn(game, 'isValidationNumber').mockReturnValue(true);
      jest.spyOn(game, 'validationMinAndMax').mockReturnValue(true);
      jest.spyOn(game, 'handleInputError').mockImplementation(handleInputErrorMock);

      const input = { id: 'min', value: '201' };

      game.validateInputs([input]);

      expect(handleInputErrorMock).toHaveBeenCalledWith('min', 'Можливий діапазон чисел від 1 до 200!');
      expect(disableBtn).toHaveBeenCalledWith('btn_generate');
    });

    test('should call handleInputError and disableBtn when validationAttempt returns true', () => {
      const handleInputErrorMock = jest.fn();

      jest.spyOn(game, 'isValidationNumber').mockReturnValue(true);
      jest.spyOn(game, 'validationMinAndMax').mockReturnValue(false);
      jest.spyOn(game, 'validationAttempt').mockReturnValue(true);
      jest.spyOn(game, 'handleInputError').mockImplementation(handleInputErrorMock);

      const input = { id: 'attempt', value: '16' };

      game.validateInputs([input]);

      expect(handleInputErrorMock).toHaveBeenCalledWith('attempt', 'Можлива кількість спроб від 1 до 15!');
      expect(disableBtn).toHaveBeenCalledWith('btn_generate');
    });
  });

  describe('handleInputError', () => {
    beforeEach(() => {
      addClassToElement.mockImplementation();
      removeClassFromElement.mockImplementation();
      setNodeInnerText.mockImplementation();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllTimers();
    });

    test('should add and remove classes, update node text, and clear error after a delay', () => {
      const inputId = 'exampleInput';
      const message = 'Example error message';

      game.handleInputError(inputId, message);

      expect(addClassToElement).toHaveBeenCalledWith(inputId, 'bounce');
      expect(setNodeInnerText).toHaveBeenCalledWith('error', message);

      jest.advanceTimersByTime(1100);

      expect(removeClassFromElement).toHaveBeenCalledWith(inputId, 'bounce');
      expect(setNodeInnerText).toHaveBeenCalledWith('error', '');
    });
  });

  describe('updateGameSettings', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="secret"></div>'; // Mock an element in the body for testing
    });

    test('should update game settings and apply styles', () => {
      const saveSettingsMock = jest.fn();
      const renderSettingsToTitleMock = jest.fn();

      jest.spyOn(game, 'saveSettings').mockImplementation(saveSettingsMock);
      jest.spyOn(game, 'renderSettingsToTitle').mockImplementation(renderSettingsToTitleMock);

      game.updateGameSettings();

      expect(saveSettingsMock).toHaveBeenCalled();
      expect(renderSettingsToTitleMock).toHaveBeenCalled();

      expect(addClassToElement).toHaveBeenCalledWith('secret', 'base');
      expect(removeClassFromElement).toHaveBeenCalledWith('secret', 'container-lost');
      expect(setNodeInnerText).toHaveBeenCalledWith('secret', '?');
    });
  });

  describe('resetGame', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="secret"></div>'; // Mock an element in the body for testing
    });

    test('should reset the game state', () => {
      game.resetGame();

      expect(addClassToElement).toHaveBeenCalledWith('secret', 'base');
      expect(removeClassFromElement).toHaveBeenCalledWith('secret', 'container-lost');
      expect(setNodeInnerText).toHaveBeenCalledWith('secret', '?');
      expect(enableButton).toHaveBeenCalledWith('btn_save');
      expect(enableButton).toHaveBeenCalledWith('btn_generate');
      expect(setNodeValue).toHaveBeenCalledWith('min', '1');
      expect(setNodeValue).toHaveBeenCalledWith('max', '100');
      expect(setNodeValue).toHaveBeenCalledWith('attempt', '5');
      expect(setNodeValue).toHaveBeenCalledWith('guess', '');
    });
  });

  describe('checkUserNumber', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="body"></div>';
    });

    test('should call setNodeInnerText with "Не число!" if userNumber is falsy', () => {
      game.checkUserNumber(null);
      expect(setNodeInnerText).toHaveBeenCalledWith('message', 'Не число!');
    });

    test('checkUserNumber should call handleCorrectGuess on correct guess', () => {
      const body = document.body;
      const userNumber = game.secretNumber;

      game.handleCorrectGuess = jest.fn();

      game.checkUserNumber(userNumber);

      expect(game.handleCorrectGuess).toHaveBeenCalledWith(body);
    });

    test('checkUserNumber should call handleIncorrectGuess on incorrect guess', () => {
      const userNumber = game.secretNumber + 1;

      game.handleIncorrectGuess = jest.fn();

      game.checkUserNumber(userNumber);

      expect(game.handleIncorrectGuess).toHaveBeenCalledWith(userNumber);
    });
  });

  describe('handleCorrectGuess', () => {
    test('should handle correct guess', () => {
      document.body.innerHTML = `
      <div id="message"></div>
      <div id="secret"></div>
      <button id="btn_generate"></button>
      <button id="btn_save"></button>
    `;

      const body = document.body;

      game.handleCorrectGuess(body);

      expect(setNodeInnerText).toHaveBeenCalledWith('secret', expect.any(Number));
      expect(setNodeInnerText).toHaveBeenCalledWith('message', 'Ви виграли!');
      expect(addClassToElement).toHaveBeenCalledWith('message', 'win');
      expect(addClassToElement).toHaveBeenCalledWith('secret', 'shake');
      expect(disableBtn).toHaveBeenCalledWith('btn_generate');
      expect(enableButton).toHaveBeenCalledWith('btn_save');
    });
  });

  describe('handleIncorrectGuess', () => {
    beforeEach(() => {
      setNodeInnerText.mockClear();
      addClassToElement.mockClear();
      removeClassFromElement.mockClear();
      disableBtn.mockClear();
      enableButton.mockClear();
    });
    test('should handle incorrect guess with attempts remaining', () => {
      document.body.innerHTML = `
      <div id="message"></div>
      <div id="secret"></div>
      <span id="attempt_count">5</span>
      <button id="btn_generate"></button>
      <button id="btn_save"></button>
    `;

      const userNumber = 42;

      game.handleIncorrectGuess.call(
        {
          attempt: 5,
          secretNumber: 24,
          disableBtn,
          enableButton,
        },
        userNumber,
      );

      expect(setNodeInnerText).toHaveBeenCalledWith('message', 'Занадто велике!');
      expect(setNodeInnerText).toHaveBeenCalledWith('attempt_count', 4);
      expect(disableBtn).not.toHaveBeenCalled();
      expect(enableButton).not.toHaveBeenCalled();
    });

    test('should decrease attempt count and set appropriate message when attempt > 1', () => {
      const userNumber = 20;

      game.handleIncorrectGuess.call(
        {
          attempt: 3,
          secretNumber: 24,
          disableBtn,
          enableButton,
        },
        userNumber,
      );

      expect(setNodeInnerText).toHaveBeenCalledWith('message', 'Занадто маленьке!');
      expect(setNodeInnerText).toHaveBeenCalledWith('attempt_count', 2);
    });

    test('should handle incorrect guess with no attempts remaining', () => {
      document.body.innerHTML = `
      <div id="message"></div>
      <div id="secret"></div>
      <span id="attempt_count">1</span>
      <button id="btn_generate"></button>
      <button id="btn_save"></button>
    `;

      const userNumber = 24;

      game.handleIncorrectGuess.call(
        {
          attempt: 1,
          secretNumber: 42,
          disableBtn,
          enableButton,
        },
        userNumber,
      );

      expect(setNodeInnerText).toHaveBeenCalledWith('message', 'Ви програли!');
      expect(addClassToElement).toHaveBeenCalledWith('message', 'lost');
      expect(setNodeInnerText).toHaveBeenCalledWith('secret', 42);
      expect(removeClassFromElement).toHaveBeenCalledWith('secret', 'base');
      expect(addClassToElement).toHaveBeenCalledWith('secret', 'shake');
      expect(addClassToElement).toHaveBeenCalledWith('secret', 'container-lost');
      expect(setNodeInnerText).toHaveBeenCalledWith('attempt_count', '0');
      expect(disableBtn).toHaveBeenCalledWith('btn_generate');
      expect(enableButton).toHaveBeenCalledWith('btn_save');
    });
  });

  describe('renderSettingsToTitle', () => {
    test('should render settings to title correctly', () => {
      getNodeValue.mockReturnValue('10');

      game.renderSettingsToTitle();

      expect(getNodeValue).toHaveBeenCalledWith('min');
      expect(getNodeValue).toHaveBeenCalledWith('max');
      expect(getNodeValue).toHaveBeenCalledWith('attempt');
      expect(setNodeInnerText).toHaveBeenCalledWith('min_number_text', '10');
      expect(setNodeInnerText).toHaveBeenCalledWith('max_number_text', '10');
      expect(setNodeInnerText).toHaveBeenCalledWith('attempt_text', '10');
      expect(setNodeInnerText).toHaveBeenCalledWith('attempt_count', '10');
    });
  });

  describe('saveSettings', () => {
    test('should save settings correctly', () => {
      jest.spyOn(game, 'generateRandomNumber').mockReturnValueOnce(42);

      game.saveSettings();

      expect(game.min).toBe('10');
      expect(game.max).toBe('10');
      expect(game.attempt).toBe('10');
      expect(game.generateRandomNumber).toHaveBeenCalledWith(10, 10);
      expect(game.secretNumber).toBe(42);
    });
  });

  describe('generateRandomNumber', () => {
    it('should generate a random number within the specified range', () => {
      const min = 1;
      const max = 10;
      const randomNumber = game.generateRandomNumber(min, max);
      expect(randomNumber).toBeGreaterThanOrEqual(min);
      expect(randomNumber).toBeLessThanOrEqual(max);
    });
  });

  describe('isValidationNumber', () => {
    it('should validate if a value is a valid number', () => {
      expect(game.isValidationNumber(5)).toBe(true);
      expect(game.isValidationNumber('abc')).toBe(false);
      expect(game.isValidationNumber('-5')).toBe(false);
    });
  });

  describe('validationAttempt', () => {
    test('should return true for values greater than 15 or less than or equal to 0', () => {
      expect(game.validationAttempt(16)).toBe(true);
      expect(game.validationAttempt(20)).toBe(true);
      expect(game.validationAttempt(0)).toBe(true);
      expect(game.validationAttempt(-5)).toBe(true);
    });

    test('should return false for values between 1 and 15 (inclusive)', () => {
      expect(game.validationAttempt(1)).toBe(false);
      expect(game.validationAttempt(10)).toBe(false);
      expect(game.validationAttempt(15)).toBe(false);
    });
  });

  describe('validationMinAndMax', () => {
    test('should return true for values greater than 200 or less than or equal to 0', () => {
      expect(game.validationMinAndMax(201)).toBe(true);
      expect(game.validationMinAndMax(250)).toBe(true);
      expect(game.validationMinAndMax(0)).toBe(true);
      expect(game.validationMinAndMax(-5)).toBe(true);
    });

    test('should return false for values between 1 and 200 (inclusive)', () => {
      expect(game.validationMinAndMax(1)).toBe(false);
      expect(game.validationMinAndMax(100)).toBe(false);
      expect(game.validationMinAndMax(200)).toBe(false);
    });
  });
});
