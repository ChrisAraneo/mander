import type { FallingSpike, Level } from '@mander/model';
import type { AxisMove } from '../../../collision/types/axis-move';

export interface FallingSpikeDrop {
  level: Level;
  spike: FallingSpike;
  velocityY: number;
  vertical: AxisMove;
}
