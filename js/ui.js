/**
 * ui.js — GRAPHICS/UI MODULE (muokattu: High HUD luonti automaattisesti)
 */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ===== Canvas scaling (keeps crisp pixels on HiDPI) =====
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
  // Notify mechanics that the canvas size changed
  window.dispatchEvent(new CustomEvent('ui:resize', { detail: { width: w, height: h, dpr } }));
}

// ===== Placeholder splash art (until real sprites/parallax are integrated) =====
function drawPlaceholder(){
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  // border lines
  ctx.globalAlpha = .35;
  for(let i=0;i<6;i++){
    ctx.strokeStyle = i%2 ? '#ffffff22' : '#00e5ff22';
    ctx.lineWidth = 2; ctx.strokeRect(12+i*3, 12+i*3, w-24-i*6, h-24-i*6);
  }
  ctx.globalAlpha = 1;
  // title
  ctx.font = `${Math.floor(h*0.06)}px Impact, system-ui, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const gradient = ctx.createLinearGradient(0,0,0,h*.3);
  gradient.addColorStop(0,'#fff'); gradient.addColorStop(1,'#dff9ff');
  ctx.fillStyle = gradient;
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 24;
  ctx.fillText('FLAPPY CLONE', w/2, h*0.28);
  ctx.shadowBlur = 0;
  // hint
  ctx.font = `${Math.floor(h*0.03)}px system-ui, sans-serif`;
  ctx.fillStyle = '#ffffffaa';
  ctx.fillText('Click / Space / Touch to flap', w/2, h*0.36);
  // bird icon
  const r = Math.max(10, Math.floor(h*0.018));
  const cx = w*0.34, cy = h*0.55;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(Date.now()/250)*0.1);
  ctx.fillStyle = '#ffde59';
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff9f1c'; ctx.beginPath(); ctx.ellipse(r*.7, 0, r*.5, r*.35, 0, 0, Math.PI*2); ctx.fill(); // beak
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-r*.2, -r*.2, r*.12, 0, Math.PI*2); ctx.fill(); // eye
  ctx.restore();
  // pipe icon
  const px = w*0.58, py = h*0.55, pw = r*2.2, ph = r*4.2;
  ctx.fillStyle = '#2ecc71'; ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = '#27ae60'; ctx.fillRect(px-6, py-8, pw+12, 12);
}

window.addEventListener('resize', resizeCanvas, {passive:true});
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
const touchFlap = document.getElementById('touchFlap');

// HUD: varmista, että Score ja High ovat olemassa
const hud = document.querySelector('.hud');
let scoreEl = document.getElementById('score');
let scoreHighEl = document.getElementById('scoreHigh');
let hudHigh = document.getElementById('hudHigh');

function ensureHud(){
  if (!hud) return;

  // Jos HUD ei ole flexattu vasen-oikea, aseta se (turvallinen lisäys)
  const style = hud.style;
  if (!style.display) style.display = 'flex';
  if (!style.alignItems) style.alignItems = 'center';
  if (!style.justifyContent) style.justifyContent = 'space-between';
  if (!style.padding) style.padding = '0 16px';
  if (!style.left) hud.style.left = '0';
  if (!style.right) hud.style.right = '0';
  if (!style.top) hud.style.top = '10px';

  // Score (vasen) — jos puuttuu, luodaan
  if (!scoreEl){
    const badge = document.createElement('div');
    badge.className = 'score-badge';
    badge.innerHTML = `Score: <span id="score">0</span>`;
    hud.prepend(badge);
    scoreEl = badge.querySelector('#score');
  }

  // High (oikea) — jos puuttuu, luodaan
  if (!scoreHighEl){
    const badge = document.createElement('div');
    badge.className = 'score-badge ghost';
    badge.id = 'hudHigh';
    badge.innerHTML = `High: <span id="scoreHigh">0</span>`;
    hud.appendChild(badge);
    scoreHighEl = badge.querySelector('#scoreHigh');
    hudHigh = badge;
  }
}
ensureHud();

function show(el){ el && (el.hidden = false); }
function hide(el){ el && (el.hidden = true); }

// TEAM HOOKS: UI -> Mechanics via CustomEvents
btnStart?.addEventListener('click', ()=>{
  hide(panelGameOver); show(panelReady);
  window.dispatchEvent(new CustomEvent('ui:menuStart'));
});
btnReady?.addEventListener('click', ()=>{
  hide(panelReady);
  window.dispatchEvent(new CustomEvent('ui:readyConfirm'));
});
btnRestart?.addEventListener('click', ()=>{
  hide(panelGameOver); show(panelReady);
  window.dispatchEvent(new CustomEvent('ui:restart'));
});
btnMenu?.addEventListener('click', ()=>{
  hide(panelGameOver); show(panelReady);
  window.dispatchEvent(new CustomEvent('ui:menu'));
});

btnHelp?.addEventListener('click', ()=>{
  const msg = 'Controls: Click / Space / Touch to flap. Avoid pipes and survive as long as you can.';
  alert(msg); // lightweight placeholder
});

btnMute?.addEventListener('click', ()=>{
  const pressed = btnMute.getAttribute('aria-pressed') === 'true';
  btnMute.setAttribute('aria-pressed', String(!pressed));
  btnMute.textContent = pressed ? '🔊 Sound' : '🔇 Muted';
  window.dispatchEvent(new CustomEvent('ui:muteToggle', { detail: { muted: !pressed } }));
});

// Show mobile-only flap button on touch devices
const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
if(!isTouch) touchFlap?.setAttribute('hidden','');
touchFlap?.addEventListener('pointerdown', ()=>{
  window.dispatchEvent(new CustomEvent('ui:flap'));
});

// ===== Public UI API for the mechanics team =====
window.UI = {
  setScore(value){
    if (!scoreEl) ensureHud();
    if (scoreEl) scoreEl.textContent = String(value|0);
  },
  setHighScore(value){
    if (!scoreHighEl) ensureHud();
    if (scoreHighEl) scoreHighEl.textContent = String(value|0);
    if (hudHigh) hudHigh.hidden = false;
  },
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

// Initial state
show(panelReady);

// export viite muille moduuleille
export const UI = window.UI;
