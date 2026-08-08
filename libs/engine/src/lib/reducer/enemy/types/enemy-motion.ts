export interface EnemyMotion {
  deltaSeconds: number;
  x: number;
  y: number;
  vy: number;
  facing: 1 | -1;
  isGrounded: boolean;
}
