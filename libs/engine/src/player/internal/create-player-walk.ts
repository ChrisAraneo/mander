import type { AxisMove } from '../../collision/types/axis-move';
import { computeBlockedVelocityX } from './compute-blocked-velocity-x';
import type { PlayerWalk } from './types/player-walk';

export const createPlayerWalk = (
  { position, isBlocked }: AxisMove,
  velocityX: number,
): PlayerWalk => ({
  nextX: position,
  blockedVelocityX: computeBlockedVelocityX(isBlocked, velocityX),
});
