import type { Enemy, Level } from '@mander/model';
import type { Facing } from '../../../facing/types/facing';

export interface FlyingEnemyFlight {
  level: Level;
  enemy: Enemy;
  deltaSeconds: number;
  speed: number;
  facing: Facing;
}
