
// main.js — application entry point
import './ui.js';                 // initialize window.UI and overlays
import { UI } from './ui.js';
import { initGame } from './game.js';
import { setMuted } from './audio.js';

// initialize the sound button UI state (you can read from storage if you want)
setMuted(false);
UI.setMuted(false);

// start the game
initGame();
