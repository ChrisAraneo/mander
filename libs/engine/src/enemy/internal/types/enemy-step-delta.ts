import type { Enemy, Level, Player } from '@mander/model';

export interface EnemyStepDelta {
  level: Level;
  enemy: Enemy;
  player: Player;
  deltaSeconds: number;
}
