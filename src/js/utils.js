export function addListener(id, eventType, callback) {
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

export function setNodeInnerText(id, value = '') {
  const node = document.getElementById(id);
  if (node) {
    node.innerText = value;
    return true;
  }
  return false;
}
