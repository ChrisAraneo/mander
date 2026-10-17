import type { Enemy, Level } from '@mander/model';

export interface BeartrapStepIntent {
  level: Level;
  trap: Enemy;
  deltaSeconds: number;
  velocityY: number;
  isGrounded: boolean;
}
