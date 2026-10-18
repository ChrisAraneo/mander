import { TILE_SIZE } from '@mander/model';
import type { Point } from '@mander/utils';
import { match } from 'ts-pattern';
import { computeInterpolatedValue } from './compute-interpolated-value';

const SNAP_DISTANCE = TILE_SIZE * 2;

export const computeInterpolatedPoint = (
  from: Point,
  to: Point,
  alpha: number,
): Point =>
  match(Math.hypot(to.x - from.x, to.y - from.y) > SNAP_DISTANCE)
    .with(true, () => to)
    .otherwise((): Point => ({
      x: computeInterpolatedValue(from.x, to.x, alpha),
      y: computeInterpolatedValue(from.y, to.y, alpha),
    }));
