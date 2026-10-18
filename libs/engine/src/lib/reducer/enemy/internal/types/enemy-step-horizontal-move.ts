import type { Enemy, Level } from '@mander/model';
import type { Facing } from '../../../types/facing';

export interface EnemyStepHorizontalMove {
  level: Level;
  enemy: Enemy;
  deltaSeconds: number;
  facing: Facing;
  velocityY: number;
  isGrounded: boolean;
  nextX: number;
}
