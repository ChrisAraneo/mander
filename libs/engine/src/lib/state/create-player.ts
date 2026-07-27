import type { Level } from '../world';

import type { Player } from './player';

export const createPlayer = (level: Level, hearts: number): Player => ({
  x: level.spawn.x,
  y: level.spawn.y,
  vx: 0,
  vy: 0,
  isGrounded: false,
  facing: 1,
  isJumpQueued: false,
  dyingFor: null,
  hearts,
  invincibleFor: 0,
});
