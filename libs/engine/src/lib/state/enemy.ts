export interface Enemy {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  grounded: boolean;
  homeX: number;
  homeY: number;
}
