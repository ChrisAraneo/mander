import type { Enemy, Level, Player } from '@mander/model';

export interface BeartrapStepDelta {
  level: Level;
  trap: Enemy;
  player: Player;
  deltaSeconds: number;
}
