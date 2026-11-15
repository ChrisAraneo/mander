import type { Enemy, Level } from '@mander/model';
import type { Facing } from '../../../facing/types/facing';

export interface EnemyStepVerticalMove {
  level: Level;
  enemy: Enemy;
  facing: Facing;
  velocityY: number;
  isGrounded: boolean;
  nextX: number;
  nextY: number;
}
