import type { Level } from '../world';
import type { Player } from '../world/player/player';

type PlayerAttributes = Pick<Player, 'hearts' | 'moveSpeed' | 'jumpVelocity'>;

export const createPlayer = (
  level: Level,
  { hearts, moveSpeed, jumpVelocity }: PlayerAttributes,
): Player => ({
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
  moveSpeed,
  jumpVelocity,
});
