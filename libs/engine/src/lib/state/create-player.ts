import type { Level } from '@mander/generator';

import type { Player } from './player';

export const createPlayer = (level: Level): Player => ({
  x: level.spawn.x,
  y: level.spawn.y,
  vx: 0,
  vy: 0,
  isGrounded: false,
  facing: 1,
  isJumpQueued: false,
});
