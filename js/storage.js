
// storage.js — high score persistence in localStorage
const KEY = 'flappy_highscore';

export function getHighScore(){
  try {
    const raw = localStorage.getItem(KEY);
    const v = parseInt(raw || '0', 10);
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}

export function setHighScore(score){
  try {
    const current = getHighScore();
    const next = Math.max(current, (score|0));
    localStorage.setItem(KEY, String(next));
    return next;
  } catch {
    return getHighScore();
  }
}

export function resetHighScore(){
  localStorage.removeItem(KEY);
  return 0;
}
