import type { Level } from '@mander/model';
import type { SweepAxis } from './sweep-axis';

export interface Sweep {
  axis: SweepAxis;
  level: Level;
  originX: number;
  originY: number;
  width: number;
  height: number;
  delta: number;
}
