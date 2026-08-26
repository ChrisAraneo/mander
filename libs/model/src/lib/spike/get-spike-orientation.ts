import { match } from 'ts-pattern';

import type { Level } from '../level/level';
import { TILE_SPIKE_CEILING } from './spike';

export type SpikeOrientation = 'FLOOR' | 'CEILING';

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
