
// main.js — application entry point
import './ui.js'; // initialize window.UI and overlays
import { UI } from './ui.js';
import { initGame } from './game.js';
import { setMuted, playMusic, stopMusic } from './audio.js';

// Initialize the sound button UI state
setMuted(false);
UI.setMuted(false);

// Create the (single) game instance
const game = initGame();

// Sync background music with mute state and gameplay
window.addEventListener('ui:muteToggle', (e) => {
  const isMuted = !!e.detail.muted;
  if (isMuted) {
    stopMusic();
  } else if (game && game.state === 'playing') {
    playMusic();
  }
});


