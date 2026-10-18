import type { Enemy, Level } from '@mander/model';

export interface BeartrapStepVerticalMove {
  level: Level;
  trap: Enemy;
  velocityY: number;
  isGrounded: boolean;
  nextY: number;
}
