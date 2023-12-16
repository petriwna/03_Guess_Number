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

describe('addEventToElement', () => {
  test('should add an event listener to the specified node', () => {
    const mockAddEventListener = jest.fn();

    jest.spyOn(document, 'getElementById').mockReturnValue({
      addEventListener: mockAddEventListener,
    });

    const id = 'nodeId';
    const eventType = 'click';
    const callback = jest.fn();

    addEventToElement(id, eventType, callback);

    expect(document.getElementById).toHaveBeenCalledWith(id);
    expect(mockAddEventListener).toHaveBeenCalledWith(eventType, callback);
  });

  test('should not add an event listener if the node is not found', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    const id = 'nonExistentNodeId';
    const eventType = 'click';
    const callback = jest.fn();

    addEventToElement(id, eventType, callback);

    expect(document.getElementById).toHaveBeenCalledWith(id);
    expect(callback).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

describe('getNodeValue', () => {
  test('should get the value from the specified node', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue({
      value: 'mockedValue',
    });

    const id = 'nodeId';
    const result = getNodeValue(id);

    expect(document.getElementById).toHaveBeenCalledWith(id);
    expect(result).toEqual('mockedValue');
  });

  test('should return an empty string if the node is not found', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    const id = 'nonExistentNodeId';
    const result = getNodeValue(id);

    expect(document.getElementById).toHaveBeenCalledWith(id);
    expect(result).toEqual('');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

describe('setNodeValue', () => {
  test('should set the value of an existing node', () => {
    document.body.innerHTML = '<input id="testInput" />';

    const result = setNodeValue('testInput', 'newValue');

    const testInput = document.getElementById('testInput');
    expect(testInput.value).toBe('newValue');
    expect(result).toBe('newValue');
  });

  test('should return an empty string for a non-existing node', () => {
    const result = setNodeValue('nonExistentNode', 'someValue');

    expect(result).toBe('');
  });
});

describe('setNodeInnerText', () => {
  test('should set the inner text of the specified node', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue({
      innerText: '',
    });

    const id = 'nodeId';
    const value = 'mockedValue';
    const result = setNodeInnerText(id, value);

    expect(document.getElementById).toHaveBeenCalledWith(id);
    expect(result).toEqual(true);
    expect(document.getElementById(id).innerText).toEqual(value);
  });

  test('should return false if the node is not found', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    const id = 'nonExistentNodeId';
    const value = 'mockedValue';
    const result = setNodeInnerText(id, value);

    expect(document.getElementById).toHaveBeenCalledWith(id);
    expect(result).toEqual(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

describe('enableButton', () => {
  test('should enable a button', () => {
    document.body.innerHTML = '<button id="testBtn"></button>';

    enableButton('testBtn');

    const btn = document.getElementById('testBtn');
    expect(btn.disabled).toBe(false);
  });
});

describe('disableBtn', () => {
  test('should disable a button', () => {
    document.body.innerHTML = '<button id="testBtn"></button>';

    disableBtn('testBtn');

    const btn = document.getElementById('testBtn');
    expect(btn.disabled).toBe(true);
  });
});

describe('addClassToElement', () => {
  beforeEach(() => {
    jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should add a class to an existing element', () => {
    document.body.innerHTML = '<div id="testElement"></div>';

    addClassToElement('testElement', 'newClass');

    const testElement = document.getElementById('testElement');
    expect(testElement.classList.contains('newClass')).toBe(true);
  });

  test('should not add a class if the element does not exist', () => {
    addClassToElement('nonExistentElement', 'newClass');

    expect(document.getElementById).toHaveBeenCalledWith('nonExistentElement');
    const nonExistentElement = document.getElementById('nonExistentElement');
    expect(nonExistentElement).toBeNull();
  });
});

describe('removeClassFromElement', () => {
  beforeEach(() => {
    jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should remove a class from an existing element', () => {
    document.body.innerHTML = '<div id="testElement" class="initialClass"></div>';

    removeClassFromElement('testElement', 'initialClass');

    expect(document.getElementById).toHaveBeenCalledWith('testElement');
    const testElement = document.getElementById('testElement');
    expect(testElement.classList.contains('initialClass')).toBe(false);
  });

  test('should do nothing if the element does not exist', () => {
    removeClassFromElement('nonExistentElement', 'someClass');

    expect(document.getElementById).toHaveBeenCalledWith('nonExistentElement');
    expect(document.getElementById('nonExistentElement')).toBeNull();
  });

  test('should do nothing if the class is not present', () => {
    document.body.innerHTML = '<div id="testElement"></div>';

    removeClassFromElement('testElement', 'nonExistingClass');

    expect(document.getElementById).toHaveBeenCalledWith('testElement');
    const testElement = document.getElementById('testElement');
    expect(testElement.classList.contains('nonExistingClass')).toBe(false);
  });
});
