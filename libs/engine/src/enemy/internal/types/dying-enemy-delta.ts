import type { Enemy, Level } from '@mander/model';

export interface DyingEnemyDelta {
  level: Level;
  enemy: Enemy;
  deltaSeconds: number;
}
