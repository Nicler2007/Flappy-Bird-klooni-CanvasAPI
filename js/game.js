
// game.js — game loop, states, and pipes
import { UI } from './ui.js';
import { Bird } from './bird.js';
import { drawBackground } from './background.js';
import { getHighScore, setHighScore } from './storage.js';
import { play, playMusic, stopMusic } from './audio.js';

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

    this.bird = new Bird(this.w * 0.3, this.h * 0.5);
    this.last = performance.now();

    // Pacing
    this.pipeGap = 160;
    this.pipeSpeed = 220;   // px/s
    this.pipes = [];        // {x, topH, scored}
    this.spawnEvery = 1.4;  // s
    this.spawnTimer = 0;

    // UI events
    window.addEventListener('ui:resize', (e) => {
      this.w = e.detail.width;
      this.h = e.detail.height;
    });
    window.addEventListener('ui:menuStart', () => { this.toReady(); });
    window.addEventListener('ui:readyConfirm', () => { this.start(); });
    window.addEventListener('ui:restart', () => { this.toReady(); });
    window.addEventListener('ui:flap', () => {
      if (this.state === 'playing') { this.bird.flap(); play('flap'); }
    });

    // Mouse/keyboard
    window.addEventListener('pointerdown', () => {
      if (this.state === 'playing') { this.bird.flap(); play('flap'); }
    });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        if (this.state === 'playing') { this.bird.flap(); play('flap'); }
        e.preventDefault();
      }
    });

    requestAnimationFrame(this.loop.bind(this));
  }

  toReady(){
    this.state = 'ready';
    this.score = 0;
    this.bird = new Bird(this.w * 0.3, this.h * 0.5);
    this.pipes = [];
    this.spawnTimer = 0;
    UI.setScore(0);
    UI.showReady();
    stopMusic();
  }

  start(){
    this.state = 'playing';
    UI.hideOverlays();
    playMusic();
  }

  gameOver(){
    this.state = 'over';
    stopMusic();
    this.highScore = setHighScore(this.score);
    UI.showGameOver({ score: this.score, highScore: this.highScore });
    play('hit');
  }

  spawnPipe(){
    const minTop = 60;
    const maxTop = this.h - this.pipeGap - 160;
    const topH = Math.max(minTop, Math.min(maxTop, Math.random() * maxTop));
    this.pipes.push({ x: this.w + 40, topH, scored: false });
  }

  update(dt){
    if (this.state !== 'playing') return;

    // Spawn pipes
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnEvery){
      this.spawnTimer = 0;
      this.spawnPipe();
    }

    // Move pipes and cull off-screen
    for (const p of this.pipes) p.x -= this.pipeSpeed * dt;
    this.pipes = this.pipes.filter(p => p.x > -120);

    // Bird physics
    this.bird.update(dt);

    // Ground/ceiling
    const b = this.bird.getBounds();
    if (b.y + b.r > this.h * 0.85 || b.y - b.r < 0) return this.gameOver();

    // Pipes: collisions + points
    for (const p of this.pipes){
      const pipeW = 80;
      const gapY1 = p.topH;
      const gapY2 = p.topH + this.pipeGap;

      const withinX = (b.x + b.r > p.x) && (b.x - b.r < p.x + pipeW);
      const hitTop = withinX && (b.y - b.r < gapY1);
      const hitBot = withinX && (b.y + b.r > gapY2);
      if (hitTop || hitBot) return this.gameOver();

      // Scoring when the bird has fully passed the pipe
      if (!p.scored && p.x + pipeW < b.x - b.r){
        p.scored = true;
        this.score++;
        UI.setScore(this.score);
        play('point');
      }
    }
  }

  draw(){
    const ctx = this.ctx, w = this.w, h = this.h;
    drawBackground(ctx, w, h);

    // Pipes
    ctx.fillStyle = '#2ecc71';
    for (const p of this.pipes){
      const pipeW = 80;
      ctx.fillRect(p.x, 0, pipeW, p.topH);
      ctx.fillRect(p.x, p.topH + this.pipeGap, pipeW, h * 0.85 - (p.topH + this.pipeGap));
    }

    // Bird
    this.bird.draw(ctx);
  }

  loop(now){
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }
}

// ---------- Singleton guard ----------
let _gameInstance = null;

export function initGame(){
  if (_gameInstance) return _gameInstance;
  _gameInstance = new Game();
  _gameInstance.toReady();
  return _gameInstance;
}
