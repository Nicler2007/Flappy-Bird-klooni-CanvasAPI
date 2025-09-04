
// audio.js — sounds, music and muting
let muted = false;

// SFX-äänet
const sounds = {
  flap: new Audio('./assets/sfx/flap.wav'),
  hit:  new Audio('./assets/sfx/hit.wav'),
  point:new Audio('./assets/sfx/point.wav'),
};

// Background music
const music = new Audio('.audio/backgroundmusic.mp3'); //***Location has been chance in the files***
music.loop = true;
music.volume = 0.5;     // Volume

for (const a of Object.values(sounds)) {
  a.preload = 'auto';
  a.volume = 0.8;
}
music.preload = 'auto';

// --- Exportoidut funktiot ---
export function setMuted(v){
  muted = !!v;
  if (muted) music.pause();
}

export function play(name){
  if (muted) return;
  const a = sounds[name];
  if (!a) return;
  try { a.currentTime = 0; a.play(); } catch {}
}

// Background music control
export function playMusic(){
  if (!muted) {
    music.currentTime = 0;
    music.play().catch(() => {});
  }
}

export function stopMusic(){
  music.pause();
  music.currentTime = 0;
}

// kuuntele UI:n napista tuleva toggle
window.addEventListener('ui:muteToggle', (e)=>{
  setMuted(e.detail.muted);
});

