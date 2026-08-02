import { match } from 'ts-pattern';

import type { Level } from '../level/level';
import { isSpike } from './is-spike';
import { spikeOrientation, type SpikeOrientation } from './spike-orientation';

/**
 * How much of its tile a spike fills. `STRIP` is the usual row of prongs that
 * spans the whole tile, so runs of spikes read as one unbroken band. `SINGLE`
 * is a lone prong in the middle of the tile, used when nothing of the same
 * orientation sits beside it and there is no band to join.
 */
export type SpikeShape = 'STRIP' | 'SINGLE';

const isNeighbour = (
  level: Level,
  tileX: number,
  tileY: number,
  orientation: SpikeOrientation,
): boolean =>
  isSpike(level, tileX, tileY) &&
  spikeOrientation(level, tileX, tileY) === orientation;

export const spikeShape = (
  level: Level,
  tileX: number,
  tileY: number,
): SpikeShape => {
  const orientation = spikeOrientation(level, tileX, tileY);

  return match(
    isNeighbour(level, tileX - 1, tileY, orientation) ||
      isNeighbour(level, tileX + 1, tileY, orientation),
  )
    .with(true, (): SpikeShape => 'STRIP')
    .otherwise((): SpikeShape => 'SINGLE');
};
