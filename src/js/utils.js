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
