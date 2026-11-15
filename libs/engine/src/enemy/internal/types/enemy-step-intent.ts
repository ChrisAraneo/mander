import type { Enemy, Level } from '@mander/model';
import type { Facing } from '../../../facing/types/facing';

export interface EnemyStepIntent {
  level: Level;
  enemy: Enemy;
  deltaSeconds: number;
  facing: Facing;
  velocityY: number;
  isGrounded: boolean;
}
