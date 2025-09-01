
// background

// Simple background drawing; expand to parallax/sprites later.
export function drawBackground(ctx, w, h, t){
  // Sky
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0,0,w,h);
  // horizon
  ctx.fillStyle = '#7ec850';
  ctx.fillRect(0, h*0.85, w, h*0.15);
  // you can add clouds etc. based on time 't'
}