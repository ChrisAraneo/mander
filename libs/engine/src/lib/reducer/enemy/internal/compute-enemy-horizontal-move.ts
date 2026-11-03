import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import type { AxisMove } from '../../collision/types/axis-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { computeEnemyWalkSpeed } from './compute-enemy-walk-speed';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyHorizontalMove = ({
  level,
  enemy,
  deltaSeconds,
  facing,
}: EnemyStepIntent): AxisMove =>
  computeHorizontalMove(
    level,
    enemy.position.x,
    enemy.position.y,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    facing * computeEnemyWalkSpeed(level, enemy) * deltaSeconds,
  );
