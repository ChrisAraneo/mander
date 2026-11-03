import type { Enemy, Level } from '@mander/model';
import { computeWalkSpeed } from '../../sand/compute-walk-speed';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';

export const computeEnemyWalkSpeed = (level: Level, enemy: Enemy): number =>
  computeWalkSpeed(
    level,
    enemy,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    enemy.velocity.x.max,
  );
