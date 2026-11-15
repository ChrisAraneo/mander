import type { Enemy, Level } from '@mander/model';
import type { Facing } from '../../facing/types/facing';
import { computeEnemyHorizontalMove } from './compute-enemy-horizontal-move';
import { createEnemyWalk } from './create-enemy-walk';
import type { EnemyWalk } from './types/enemy-walk';

export const computeEnemyWalk = (
  level: Level,
  enemy: Enemy,
  facing: Facing,
  deltaSeconds: number,
): EnemyWalk =>
  createEnemyWalk(
    facing,
    computeEnemyHorizontalMove(level, enemy, facing, deltaSeconds),
  );
