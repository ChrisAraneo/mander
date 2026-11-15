import type { Level } from '@mander/model';
import { computeAxisMove } from './internal/compute-axis-move';
import type { AxisMove } from './types/axis-move';

export const computeHorizontalMove = (
  level: Level,
  originX: number,
  originY: number,
  width: number,
  height: number,
  delta: number,
): AxisMove =>
  computeAxisMove({
    axis: 'HORIZONTAL',
    level,
    originX,
    originY,
    width,
    height,
    delta,
  });
