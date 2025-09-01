
export class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.radius = 12;
    this.gravity = 900;      // px/s²
    this.flapImpulse = 300;  // ylöspäin nopeus
    this.rotation = 0;
  }

  update(dt) {
    this.vy += this.gravity * dt;
    this.y += this.vy * dt;

    // rotaatio visuaalisuutta varten
    this.rotation = Math.atan2(this.vy, 200);
  }

  flap() {
    this.vy = -this.flapImpulse;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}