import { Game } from './Game';

export function init() {
  new Game();
}

document.addEventListener('DOMContentLoaded', init);
