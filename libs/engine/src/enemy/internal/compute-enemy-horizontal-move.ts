import type { Enemy, Level } from '@mander/model';
import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import type { AxisMove } from '../../collision/types/axis-move';
import { computeFacingStep } from '../../facing/compute-facing-step';
import type { Facing } from '../../facing/types/facing';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { computeEnemyWalkSpeed } from './compute-enemy-walk-speed';

export const computeEnemyHorizontalMove = (
  level: Level,
  enemy: Enemy,
  facing: Facing,
  deltaSeconds: number,
): AxisMove =>
  computeHorizontalMove(
    level,
    enemy.position.x,
    enemy.position.y,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    computeFacingStep(facing) *
      computeEnemyWalkSpeed(level, enemy) *
      deltaSeconds,
  );
