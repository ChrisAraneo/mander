import type { Enemy, Level } from '@mander/model';
import type { Facing } from '../../../facing/types/facing';

export interface FlyingEnemyTarget {
  level: Level;
  enemy: Enemy;
  speed: number;
  facing: Facing;
  rawNextY: number;
  clampedNextY: number;
}
