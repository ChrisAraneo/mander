import type { Player } from '@mander/model';
import { computeInterpolatedPoint } from './compute-interpolated-point';

export const patchInterpolatedPlayerPosition = (
  previous: Player,
  current: Player,
  alpha: number,
): Player => ({
  ...current,
  position: computeInterpolatedPoint(
    previous.position,
    current.position,
    alpha,
  ),
});
