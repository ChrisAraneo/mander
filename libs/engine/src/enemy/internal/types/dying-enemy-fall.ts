import type { Enemy, Level } from '@mander/model';

export interface DyingEnemyFall {
  level: Level;
  enemy: Enemy;
  deltaSeconds: number;
  velocityY: number;
}
