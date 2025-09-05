
// audio.js — sounds, music and muting
let muted = false;

// SFX
const sounds = {
  flap: new Audio('./audio/flap.mp3'),
  point: new Audio('./audio/point.mp3'),
  game_over: new Audio('./audio/game_over.mp3'),
  btn: new Audio('./audio/button-click.mp3'),
  new_record: new Audio('./audio/new-record.mp3'),
};

// Background music
const music = new Audio('./audio/backgroundmusic1.mp3'); // path changed earlier in files
music.loop = true;
music.volume = 0.2; // default volume

for (const a of Object.values(sounds)) {
  a.preload = 'auto';
  a.volume = 0.8;
}
music.preload = 'auto';

// --- Exportoidut funktiot ---

export function setMuted(v) {
  muted = !!v;
  if (muted) music.pause();
}

export function setVolume(value) {
  // clamp 0–1
  const vol = Math.max(0, Math.min(1, value));
  music.volume = vol;
  for (const a of Object.values(sounds)) {
    a.volume = vol;
  }
}

export function play(name) {
  if (muted) return;
  const a = sounds[name];
  if (!a) return;
  try {
    a.currentTime = 0;
    a.play();
  } catch {}
}

// Background music control
export function playMusic() {
  if (!muted) {
    music.currentTime = 0;
    music.play().catch(() => {});
  }
}

export function stopMusic() {
  music.pause();
  music.currentTime = 0;
}

// listen to UI toggle
window.addEventListener('ui:muteToggle', (e) => {
  setMuted(e.detail.muted);
});

// listen to UI volume change
window.addEventListener('ui:volumeChange', (e) => {
  setVolume(e.detail.volume);
});

