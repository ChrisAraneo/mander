import type { Enemy } from '@mander/model';
import type { AxisMove } from '../../../collision/types/axis-move';
import type { Facing } from '../../../facing/types/facing';

export interface FlyingEnemyDrift {
  enemy: Enemy;
  speed: number;
  facing: Facing;
  isClamped: boolean;
  vertical: AxisMove;
}
