import type { Enemy } from '@mander/model';
import type { AxisMove } from '../../../collision/types/axis-move';

export interface DyingEnemyDrop {
  enemy: Enemy;
  velocityY: number;
  vertical: AxisMove;
}
