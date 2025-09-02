
import { CANVAS_W, CANVAS_H, GameState, store } from "./game.js";
import { Bird } from "./bird.js";
import { Pipes } from "./pipes.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const bird = new Bird();
const pipes = new Pipes(CANVAS_W, CANVAS_H);

let lastTime = 0;

function startGame() {
  store.state = GameState.PLAYING;
  store.frame = 0;
  store.score = 0; // nollaa pisteet
  bird.reset();
  pipes.reset();
}

function gameOver() {
  store.state = GameState.GAMEOVER;
  if (store.score > store.best) {
    store.best = store.score;
    localStorage.setItem("flappyBest", store.best);
  }
}

function drawUI(ctx) {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${store.score}`, 20, 40);
  ctx.fillText(`Best: ${store.best}`, 20, 70);
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (store.state === GameState.START) startGame();
    else if (store.state === GameState.PLAYING) bird.flap();
  }
});

canvas.addEventListener("mousedown", () => {
  if (store.state === GameState.START) startGame();
  else if (store.state === GameState.PLAYING) bird.flap();
  else if (store.state === GameState.GAMEOVER) store.state = GameState.START;
});

function loop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 16.67;
  lastTime = timestamp;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (store.state === GameState.PLAYING) {
    bird.update(deltaTime);

    pipes.spawnTimer++;
    if (pipes.spawnTimer >= pipes.spawnInterval) {
      pipes.spawn();
      pipes.spawnTimer = 0;
    }

    pipes.updateAndCull(bird, store);
    
    if (pipes.checkCollision(bird, CANVAS_H)) {
      gameOver();
    }

    pipes.draw(ctx);
    bird.draw(ctx);
    drawUI(ctx);
    store.frame++;
  } else {
    bird.draw(ctx);
    drawUI(ctx);
  }

  requestAnimationFrame(loop);
}

// lataa high score tallennuksesta
store.best = Number(localStorage.getItem("flappyBest")) || 0;

loop();
