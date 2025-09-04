
// main.js — application entry point
import './ui.js';                 // initialize window.UI and overlays
import { UI } from './ui.js';
import { initGame } from './game.js';
import { setMuted, playMusic, stopMusic } from './audio.js';

// initialize the sound button UI state 
setMuted(false);
UI.setMuted(false);

// start the game
const game = initGame();

window.addEventListener('ui:muteToggle', (e)=>{
  const muted = e.detail.muted;
  if (muted) stopMusic();
  else if (game.state === 'playing') playMusic();
});

initGame();