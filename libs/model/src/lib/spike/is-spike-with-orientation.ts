import type { Level } from '../level/level';
import { getSpikeOrientation } from './get-spike-orientation';
import { isSpike } from './is-spike';
import type { SpikeOrientation } from './spike-orientation';

export const isSpikeWithOrientation = (
  level: Level,
  tileX: number,
  tileY: number,
  orientation: SpikeOrientation,
): boolean =>
  isSpike(level, tileX, tileY) &&
  getSpikeOrientation(level, tileX, tileY) === orientation;
