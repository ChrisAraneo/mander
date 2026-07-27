import { match } from 'ts-pattern';

import {
  type SpikeOrientation,
  TILE_SPIKE_CEILING,
  type TileMap,
} from '../world';

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
