
export const CANVAS_W = 360;
export const CANVAS_H = 640;

export const GameState = {
  START: "start",
  PLAYING: "playing",
  GAMEOVER: "gameover",
};

export const store = {
  state: GameState.START,
  frame: 0,
  score: 0,
  best: 0,
};