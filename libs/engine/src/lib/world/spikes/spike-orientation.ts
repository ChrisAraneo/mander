import { match } from 'ts-pattern';

import type { TileMap } from '@mander/model';
import { TILE_SPIKE_CEILING } from './constants';

export type SpikeOrientation = 'FLOOR' | 'CEILING';

export const spikeOrientation = (
  level: TileMap,
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
