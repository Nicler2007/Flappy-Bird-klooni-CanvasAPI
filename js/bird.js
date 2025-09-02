
export class Bird {
  constructor() {
    this.x = 100;
    this.y = 300;
    this.vy = 0;
    this.gravity = 0.8;
    this.flapStrength = 10;
    this.maxVy = 10;
  }

  reset() {
    this.y = 300;
    this.vy = 0;
  }

  flap() {
    this.vy = -this.flapStrength;
  }

  update(deltaTime) {
    this.vy += this.gravity * deltaTime;
    if (this.vy > this.maxVy) this.vy = this.maxVy;
    this.y += this.vy * deltaTime;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
  }
