import { match } from 'ts-pattern';

import {
  type Level,
  type SpikeOrientation,
  TILE_SPIKE_CEILING,
} from '../types';

export const spikeOrientation = (
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
