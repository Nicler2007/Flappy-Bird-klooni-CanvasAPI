export class Pipes {
  constructor(canvasW, canvasH) {
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.list = [];
    this.gap = 160;
    this.width = 60;
    this.spawnTimer = 0;
    this.spawnInterval = 260;
  }

  spawn() {
    const top = Math.random() * (this.canvasH - this.gap - 50) + 20;
    this.list.push({ 
      x: this.canvasW, 
      top, 
      bottom: top + this.gap,
      passed: false
    });
  }

  updateAndCull(bird, store) {
    for (let pipe of this.list) {
      pipe.x -= 1;

      if (!pipe.passed && pipe.x + this.width < bird.x) {
        pipe.passed = true;
        store.score += 1;

        if (store.score > store.best) {
          store.best = store.score;
        }
      }
    }
    this.list = this.list.filter(p => p.x + this.width > 0);
  }

  draw(ctx) {
    ctx.fillStyle = "green";
    for (let pipe of this.list) {
      ctx.fillRect(pipe.x, 0, this.width, pipe.top);
      ctx.fillRect(pipe.x, pipe.bottom, this.width, this.canvasH - pipe.bottom);
    }
  }

  checkCollision(bird, canvasH) {
    for (let pipe of this.list) {
      if (bird.x + 10 > pipe.x && bird.x - 10 < pipe.x + this.width) {
        if (bird.y - 10 < pipe.top || bird.y + 10 > pipe.bottom) return true;
      }
    }
    if (bird.y + 10 > canvasH || bird.y - 10 < 0) return true;
    return false;
  }

  reset() {
    this.list = [];
    this.spawnTimer = 0;
  }
}