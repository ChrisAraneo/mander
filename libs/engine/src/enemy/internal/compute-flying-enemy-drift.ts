import { computeVerticalMove } from '../../collision/compute-vertical-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import type { FlyingEnemyDrift } from './types/flying-enemy-drift';
import type { FlyingEnemyTarget } from './types/flying-enemy-target';

export const computeFlyingEnemyDrift = ({
  level,
  enemy,
  speed,
  facing,
  rawNextY,
  clampedNextY,
}: FlyingEnemyTarget): FlyingEnemyDrift => ({
  enemy,
  speed,
  facing,
  isClamped: clampedNextY !== rawNextY,
  vertical: computeVerticalMove(
    level,
    enemy.position.x,
    enemy.position.y,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    clampedNextY - enemy.position.y,
  ),
});
