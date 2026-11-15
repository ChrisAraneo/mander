import type { Enemy, Level } from '@mander/model';
import { clamp } from 'lodash-es';
import type { Facing } from '../../facing/types/facing';
import { FLYING_ENEMY_RANGE } from '../consts';
import type { FlyingEnemyTarget } from './types/flying-enemy-target';

export const createFlyingEnemyTarget = (
  {
    level,
    enemy,
    speed,
    facing,
  }: { level: Level; enemy: Enemy; speed: number; facing: Facing },
  rawNextY: number,
): FlyingEnemyTarget => ({
  level,
  enemy,
  speed,
  facing,
  rawNextY,
  clampedNextY: clamp(
    rawNextY,
    enemy.spawn.y - FLYING_ENEMY_RANGE,
    enemy.spawn.y + FLYING_ENEMY_RANGE,
  ),
});
