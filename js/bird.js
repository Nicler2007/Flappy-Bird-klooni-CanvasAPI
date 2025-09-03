
// bird.js — bird model + physics
export class Bird {
  constructor(x, y){
    this.x = x; this.y = y;
    this.vy = 0;
    this.r = 14;
    this.gravity = 1200;   // was 1800
this.flapVel = -360;   // was -420
  }
  flap(){ this.vy = this.flapVel; }
  update(dt){
    this.vy += this.gravity * dt;
    this.y  += this.vy * dt;
  }
  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, 400));
    ctx.fillStyle = '#ffde59';
    ctx.beginPath(); ctx.arc(0,0,this.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath(); ctx.ellipse(this.r*0.7, 0, this.r*0.5, this.r*0.35, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(-this.r*0.2, -this.r*0.2, this.r*0.12, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
  getBounds(){ return {x:this.x, y:this.y, r:this.r}; }
}

