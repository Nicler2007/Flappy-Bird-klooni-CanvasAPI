
// storage.js — high score recovery
const KEY = 'flappy.highscore';

export function getHighScore(){
  const v = localStorage.getItem(KEY);
  return v ? parseInt(v,10) : 0;
}

export function setHighScore(score){
  const hs = getHighScore();
  if (score > hs) localStorage.setItem(KEY, String(score));
  return getHighScore();
}