import { match } from 'ts-pattern';

import type { Level } from '../level/level';
import { isSpike } from './is-spike';
import {
  getSpikeOrientation,
  type SpikeOrientation,
} from './get-spike-orientation';

export type SpikeShape = 'STRIP' | 'SINGLE';

const isNeighbour = (
  level: Level,
  tileX: number,
  tileY: number,
  orientation: SpikeOrientation,
): boolean =>
  isSpike(level, tileX, tileY) &&
  getSpikeOrientation(level, tileX, tileY) === orientation;

export const spikeShape = (
  level: Level,
  tileX: number,
  tileY: number,
): SpikeShape => {
  const orientation = getSpikeOrientation(level, tileX, tileY);

  return match(
    isNeighbour(level, tileX - 1, tileY, orientation) ||
      isNeighbour(level, tileX + 1, tileY, orientation),
  )
    .with(true, (): SpikeShape => 'STRIP')
    .otherwise((): SpikeShape => 'SINGLE');
};
