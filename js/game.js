// game.js — game loop, states, and pipes (muokattu: hitaampi tempo + HUD High Score)
import { UI } from './ui.js';
import { Bird } from './bird.js';
import { drawBackground } from './background.js';
import { getHighScore, setHighScore } from './storage.js';
import { play } from './audio.js';

export class Game {
  constructor(){
    this.canvas = UI.getCanvas();
    this.ctx = UI.getContext();
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.state = 'menu'; // menu -> ready -> playing -> over
    this.score = 0;
    this.highScore = getHighScore();
    this.time = 0;

    this.bird = new Bird(this.w*0.3, this.h*0.5);
    this.last = performance.now();

    // — Hitaampi ja helpompi moodi —
    this.pipeGap = 180;     // was 160
    this.pipeSpeed = 150;   // was 220
    this.spawnEvery = 1.8;  // was 1.4

    this.pipes = [];        // {x, topH, scored}
    this.spawnTimer = 0;

    // UI events
    window.addEventListener('ui:resize', (e)=>{
      this.w = e.detail.width; this.h = e.detail.height;
    });
    window.addEventListener('ui:menuStart', ()=>{ this.toReady(); });
    window.addEventListener('ui:readyConfirm', ()=>{ this.start(); });
    window.addEventListener('ui:restart', ()=>{ this.toReady(); });
    window.addEventListener('ui:flap', ()=>{
      if(this.state==='playing'){ this.bird.flap(); play('flap'); }
    });

    // mouse/keyboard
    window.addEventListener('pointerdown', ()=>{
      if(this.state==='playing'){ this.bird.flap(); play('flap'); }
    });
    window.addEventListener('keydown', (e)=>{
      if (e.code === 'Space') {
        if (this.state==='playing'){ this.bird.flap(); play('flap'); }
        e.preventDefault();
      }
    });

    requestAnimationFrame(this.loop.bind(this));
  }

  toReady(){
    this.state = 'ready';
    this.score = 0;
    this.bird = new Bird(this.w*0.3, this.h*0.5);
    this.pipes = [];
    this.spawnTimer = 0;
    UI.setScore(0);
    // Näytä HUDissa tämänhetkinen high score heti Ready-näytössä
    UI.setHighScore(this.highScore);
    UI.showReady();
  }

  start(){
    this.state = 'playing';
    UI.hideOverlays();
  }

  gameOver(){
    this.state = 'over';
    // Tallennus localStorageen — palauttaa päivitetyn high scoren
    this.highScore = setHighScore(this.score);
    // Päivitä HUD myös tallennuksen jälkeen
    UI.setHighScore(this.highScore);
    UI.showGameOver({ score: this.score, highScore: this.highScore });
    play('hit');
  }

  spawnPipe(){
    const minTop = 60;
    const maxTop = this.h - this.pipeGap - 160;
    const topH = Math.max(minTop, Math.min(maxTop, Math.random()*maxTop));
    this.pipes.push({ x: this.w + 40, topH, scored:false });
  }

  update(dt){
    if (this.state !== 'playing') return;

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnEvery){
      this.spawnTimer = 0; this.spawnPipe();
    }

    for (const p of this.pipes) p.x -= this.pipeSpeed * dt;
    this.pipes = this.pipes.filter(p => p.x > -120);

    this.bird.update(dt);

    // ground/ceiling
    const b = this.bird.getBounds();
    if (b.y + b.r > this.h*0.85 || b.y - b.r < 0) return this.gameOver();

    // pipe collisions + points
    for (const p of this.pipes){
      const pipeW = 80;
      const gapY1 = p.topH;
      const gapY2 = p.topH + this.pipeGap;
      const withinX = (b.x + b.r > p.x) && (b.x - b.r < p.x + pipeW);
      const hitTop = withinX && (b.y - b.r < gapY1);
      const hitBot = withinX && (b.y + b.r > gapY2);
      if (hitTop || hitBot) return this.gameOver();

      if (!p.scored && p.x + pipeW < b.x - b.r){
        p.scored = true;
        this.score++;
        UI.setScore(this.score);

        // Live-ennätysnäyttö (ei tallennusta vielä)
        if (this.score > this.highScore){
          this.highScore = this.score;
          UI.setHighScore(this.highScore);
        }
        play('point');
      }
    }
  }

  draw(){
    const ctx = this.ctx, w = this.w, h = this.h;
    drawBackground(ctx, w, h);

    // pipes
    ctx.fillStyle = '#2ecc71';
    for (const p of this.pipes){
      const pipeW = 80;
      ctx.fillRect(p.x, 0, pipeW, p.topH);
      ctx.fillRect(p.x, p.topH + this.pipeGap, pipeW, h*0.85 - (p.topH + this.pipeGap));
    }

    // bird
    this.bird.draw(ctx);
  }

  loop(now){
    const dt = Math.min(0.033, (now - this.last)/1000);
    this.last = now;
    this.time += dt;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }
}

export function initGame(){
  const g = new Game();
  g.toReady();
  return g;
}
