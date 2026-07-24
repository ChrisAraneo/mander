export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: 1 | -1;
  isJumpQueued: boolean;
  dyingFor: number | null;
}
