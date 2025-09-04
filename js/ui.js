/**
 * ui.js — GRAPHICS / UI MODULE
 * - Removed the top score "bubble"; HUD uses the existing text in HTML.
 * - Safer score element lookup.
 * - Robust start flow (buttons + Space/canvas fallback in Ready state).
 */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ===== Canvas scaling (HiDPI crispness) =====
function resizeCanvas(){
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const rect = canvas.getBoundingClientRect();
  const w = Math.floor(rect.width * dpr);
  const h = Math.floor(rect.height * dpr);
  if (canvas.width !== w || canvas.height !== h){
    canvas.width = w; canvas.height = h;
  }
  ctx.imageSmoothingEnabled = false;
  drawPlaceholder();
  window.dispatchEvent(new CustomEvent('ui:resize', { detail: { width: w, height: h, dpr } }));
}

// ===== Placeholder splash art =====
function drawPlaceholder(){
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.globalAlpha = .35;
  for(let i=0;i<6;i++){
    ctx.strokeStyle = i%2 ? '#ffffff22' : '#00e5ff22';
    ctx.lineWidth = 2; ctx.strokeRect(12+i*3, 12+i*3, w-24-i*6, h-24-i*6);
  }
  ctx.globalAlpha = 1;
  ctx.font = `${Math.floor(h*0.06)}px Impact, system-ui, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const gradient = ctx.createLinearGradient(0,0,0,h*.3);
  gradient.addColorStop(0,'#fff'); gradient.addColorStop(1,'#dff9ff');
  ctx.fillStyle = gradient;
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 24;
  ctx.fillText('FLAPPY CLONE', w/2, h*0.28);
  ctx.shadowBlur = 0;
  ctx.font = `${Math.floor(h*0.03)}px system-ui, sans-serif`;
  ctx.fillStyle = '#ffffffaa';
  ctx.fillText('Click / Space / Touch to flap', w/2, h*0.36);
}

window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

// ===== UI elements and events =====
const panelReady = document.getElementById('panelReady');
const panelGameOver = document.getElementById('panelGameOver');
const btnStart = document.getElementById('btnStart');
const btnReady = document.getElementById('btnReady');
const btnRestart = document.getElementById('btnRestart');
const btnMenu = document.getElementById('btnMenu');
const btnHelp = document.getElementById('btnHelp');
const btnMute = document.getElementById('btnMute');
const btnResetHigh = document.getElementById('btnResetHigh');
const touchFlap = document.getElementById('touchFlap');

// HUD: get #score safely (works with or without wrappers)
const scoreEl =
  document.querySelector('.score-badge #score') ||
  document.getElementById('score');

function show(el){ if(el) el.hidden = false; }
function hide(el){ if(el) el.hidden = true; }

// ===== Controls -> game events =====
btnStart?.addEventListener('click', ()=>{
  hide(panelGameOver);
  show(panelReady);
  window.dispatchEvent(new CustomEvent('ui:menuStart'));
});

btnReady?.addEventListener('click', ()=>{
  hide(panelReady);
  window.dispatchEvent(new CustomEvent('ui:readyConfirm'));
});

btnRestart?.addEventListener('click', ()=>{
  hide(panelGameOver);
  show(panelReady);
  window.dispatchEvent(new CustomEvent('ui:restart'));
});

btnMenu?.addEventListener('click', ()=>{
  hide(panelGameOver);
  show(panelReady);
  window.dispatchEvent(new CustomEvent('ui:menu'));
});

btnHelp?.addEventListener('click', ()=>{
  alert('Controls: Click / Space / Touch to flap. Avoid pipes and survive as long as you can.');
});

btnMute?.addEventListener('click', ()=>{
  const pressed = btnMute.getAttribute('aria-pressed') === 'true';
  btnMute.setAttribute('aria-pressed', String(!pressed));
  btnMute.textContent = pressed ? '🔊 Sound' : '🔇 Muted';
  window.dispatchEvent(new CustomEvent('ui:muteToggle', { detail: { muted: !pressed } }));
});

btnResetHigh?.addEventListener('click', ()=>{
  if (!confirm('Reset saved high score?')) return;
  window.dispatchEvent(new CustomEvent('ui:resetHigh'));
});

// Touch-only FLAP button
const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
if (!isTouch) touchFlap?.setAttribute('hidden','');
touchFlap?.addEventListener('pointerdown', ()=>{
  window.dispatchEvent(new CustomEvent('ui:flap'));
});

// Fallbacks: start from READY also with Space or canvas click
window.addEventListener('keydown', (e)=>{
  if (e.code === 'Space' && !panelReady.hidden) {
    hide(panelReady);
    window.dispatchEvent(new CustomEvent('ui:readyConfirm'));
    e.preventDefault();
  }
});

canvas.addEventListener('pointerdown', ()=>{
  if (!panelReady.hidden) {
    hide(panelReady);
    window.dispatchEvent(new CustomEvent('ui:readyConfirm'));
  } else {
    // If already playing, forward flap
    window.dispatchEvent(new CustomEvent('ui:flap'));
  }
});

// ===== Public API =====
window.UI = {
  setScore(value){
    if (scoreEl) scoreEl.textContent = String(value|0);
  },
  setHighScore(_v){ /* no-op: not displayed on HUD */ },
  showReady(){ hide(panelGameOver); show(panelReady); },
  hideOverlays(){ hide(panelReady); hide(panelGameOver); },
  showGameOver({ score = 0, highScore = 0 } = {}){
    const fs = document.getElementById('finalScore');
    const hs = document.getElementById('highScore');
    if (fs) fs.textContent = String(score|0);
    if (hs) hs.textContent = String(highScore|0);
    hide(panelReady); show(panelGameOver);
  },
  setMuted(muted){
    btnMute?.setAttribute('aria-pressed', String(!!muted));
    if (btnMute) btnMute.textContent = muted ? '🔇 Muted' : '🔊 Sound';
  },
  getCanvas(){ return canvas; },
  getContext(){ return ctx; },
};

// Show Ready on load (game.js will also call UI.showReady() via toReady)
show(panelReady);

export const UI = window.UI;
