import type { AxisMove } from '../../collision/types/axis-move';
import type { Facing } from '../../facing/types/facing';
import { computeBlockedFacing } from './compute-blocked-facing';
import type { EnemyWalk } from './types/enemy-walk';

export const createEnemyWalk = (
  facing: Facing,
  { position, isBlocked }: AxisMove,
): EnemyWalk => ({
  facing: computeBlockedFacing(isBlocked, facing),
  nextX: position,
});
