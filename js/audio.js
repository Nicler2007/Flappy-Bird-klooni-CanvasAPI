
// audio.js — sounds and muting
let muted = false;

const sounds = {
  flap: new Audio('./assets/sfx/flap.wav'),
  hit:  new Audio('./assets/sfx/hit.wav'),
  point:new Audio('./assets/sfx/point.wav'),
};

for (const a of Object.values(sounds)) {
  a.preload = 'auto';
  a.volume = 0.8;
}

export function setMuted(v){
  muted = !!v;
}

export function play(name){
  if (muted) return;
  const a = sounds[name];
  if (!a) return;
  try { a.currentTime = 0; a.play(); } catch {}
}

// listen for the toggle coming from the UI button
window.addEventListener('ui:muteToggle', (e)=>{
  setMuted(e.detail.muted);
});
