// game.js — game loop, states, and pipes (uses user's Pipes mechanics)
import { UI } from './ui.js';
import { Bird } from './bird.js';
import { drawBackground } from './background.js';
import { getHighScore, setHighScore } from './storage.js';
import { play } from './audio.js';
import { Pipes } from './pipes.js';

export class Game {
  constructor(){
    this.canvas = UI.getCanvas();
    this.ctx = UI.getContext();
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.state = 'ready';     // ready -> playing -> over
    this.time  = 0;
    this.last  = performance.now();

    // Maa-viiva 85%:ssa kuten aiemmin
    this.groundY = Math.floor(this.h * 0.85);

    // Lintu ja putket
    this.bird  = new Bird(this.w*0.3, this.h*0.5);
    this.pipes = new Pipes(this.w, this.groundY);

    // Pipes tarvitsee skoren "store"-objektiin
    this.store = {
      score: 0,
      best: getHighScore() || 0
    };
    this.prevScore = 0;

    // UI
    UI.setScore(0);
    UI.hideOverlays(); // ei start-paneelia

    // Resizing
    window.addEventListener('ui:resize', (e)=>{
      this.w = e.detail.width; 
      this.h = e.detail.height;
      this.groundY = Math.floor(this.h * 0.85);
      this.pipes.canvasW = this.w;
      this.pipes.canvasH = this.groundY;
    });

    // Syötteet: peli käyntiin ja hyppy
    const flapOrStart = ()=>{
      if (this.state === 'ready') {
        this.start();           // aloita peli
        this.bird.flap();       // tuntuma: ekasta painalluksesta hyppy
        play('flap');
      } else if (this.state === 'playing') {
        this.bird.flap();
        play('flap');
      } else if (this.state === 'over') {
        this.toReady();         // reset
        this.start();           // ja heti käyntiin
        this.bird.flap();
        play('flap');
      }
    };

    // Hiiren oikea sallitaan, estetään contextmenu
    this.canvas.addEventListener('contextmenu', (e)=>e.preventDefault());
    window.addEventListener('pointerdown', (e)=>{
      if (e.button === 2 /* right */) { flapOrStart(); }
      // Jos haluat sallia myös vasemman, poista seuraava kommentti:
      // if (e.button === 0) { flapOrStart(); }
    });

    // Välilyönti
    window.addEventListener('keydown', (e)=>{
      if (e.code === 'Space') {
        flapOrStart();
        e.preventDefault();
      }
    });

    requestAnimationFrame(this.loop.bind(this));
  }

  toReady(){
    this.state = 'ready';
    this.store.score = 0;
    this.store.best  = getHighScore() || 0;
    this.prevScore   = 0;

    this.bird = new Bird(this.w*0.3, this.h*0.5);

    this.pipes.reset();
    this.pipes.canvasW = this.w;
    this.pipes.canvasH = this.groundY;

    UI.setScore(0);
    // ei overlayta
  }

  start(){
    this.state = 'playing';
  }

  gameOver(){
    this.state = 'over';
    // Sync paras tulos storageen
    const best = Math.max(this.store.best, getHighScore()||0);
    setHighScore(best);
    play('hit');
    // Ei overlayta; odotetaan uutta painallusta
  }

  update(dt){
    if (this.state !== 'playing') return;

    // Spawn-logiikka Pipesin omalla ajastimella (frame-pohjainen)
    this.pipes.spawnTimer += dt * 60;
    if (this.pipes.spawnTimer >= this.pipes.spawnInterval){
      this.pipes.spawn();
      this.pipes.spawnTimer = 0;
    }

    // Lintu
    this.bird.update(dt);

    // Putket (sis. pisteytyksen storeen)
    this.pipes.updateAndCull(this.bird, this.store);

    // UI & highscore
    if (this.store.score !== this.prevScore){
      UI.setScore(this.store.score);
      play('point');
      this.prevScore = this.store.score;
    }
    if (this.store.best > (getHighScore() || 0)){
      setHighScore(this.store.best);
    }

    // Törmäys
    if (this.pipes.checkCollision(this.bird, this.groundY)){
      this.gameOver();
      return;
    }
  }

  draw(){
    const ctx = this.ctx, w = this.w, h = this.h;
    drawBackground(ctx, w, h);

    // Pipes
    this.pipes.draw(ctx);

    // Bird
    this.bird.draw(ctx);

    // Maa (jos tausta ei tee)
    ctx.fillStyle = '#7cfc00';
    ctx.fillRect(0, this.groundY, w, h - this.groundY);
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
  g.toReady(); // ei overlayta; odottaa ensimmäistä painallusta
  return g;
}
