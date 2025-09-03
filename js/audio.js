
// audio.js — sounds, music and muting
let muted = false;

// SFX-äänet
const sounds = {
  flap: new Audio('./assets/sfx/flap.wav'),
  hit:  new Audio('./assets/sfx/hit.wav'),
  point:new Audio('./assets/sfx/point.wav'),
};

// Taustamusiikki
const music = new Audio('./assets/music/backgroundmusic.mp3'); // <- vaihda tiedostonimi
music.loop = true;      // pyörii loopissa
music.volume = 0.5;     // voit säätää äänenvoimakkuutta

// Lataa kaikki äänet valmiiksi
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

// Taustamusiikin hallinta
export function playMusic(){
  if (!muted) {
    music.currentTime = 0; // alkaa alusta
    music.play().catch(() => {}); // estää virheet, jos ei voi toistaa
  }
}

export function stopMusic(){
  music.pause();
  music.currentTime = 0; // resetoi aloitukseen
}

// kuuntele UI:n napista tuleva toggle
window.addEventListener('ui:muteToggle', (e)=>{
  setMuted(e.detail.muted);
});

