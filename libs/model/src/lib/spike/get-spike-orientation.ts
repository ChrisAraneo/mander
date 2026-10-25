import { match } from 'ts-pattern';
import type { Level } from '../types/level';
import { TILE_SPIKE_CEILING } from './tile-spike-ceiling';
import type { SpikeOrientation } from './types/spike-orientation';

export const getSpikeOrientation = (
  level: Level,
  tileX: number,
  tileY: number,
): SpikeOrientation =>
  match(
    tileX >= 0 &&
      tileX < level.width &&
      tileY >= 0 &&
      tileY < level.height &&
      level.tiles[tileY][tileX] === TILE_SPIKE_CEILING,
  )
    .with(true, (): SpikeOrientation => 'CEILING')
    .otherwise((): SpikeOrientation => 'FLOOR');
