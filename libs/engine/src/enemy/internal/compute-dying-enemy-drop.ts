import { computeVerticalMove } from '../../collision/compute-vertical-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import type { DyingEnemyDrop } from './types/dying-enemy-drop';
import type { DyingEnemyFall } from './types/dying-enemy-fall';

export const computeDyingEnemyDrop = ({
  level,
  enemy,
  deltaSeconds,
  velocityY,
}: DyingEnemyFall): DyingEnemyDrop => ({
  enemy,
  velocityY,
  vertical: computeVerticalMove(
    level,
    enemy.position.x,
    enemy.position.y,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    velocityY * deltaSeconds,
  ),
});
