import {
  getSpikeOrientation,
  type Level,
  PRONG_HEIGHT,
  TILE_SIZE,
} from '@mander/model';
import type { Point, Rectangle } from '@mander/utils';
import { match } from 'ts-pattern';

export const computeProngBand = (level: Level, tile: Point): Rectangle => ({
  x: tile.x * TILE_SIZE,
  y: match(getSpikeOrientation(level, tile.x, tile.y))
    .with('FLOOR', () => (tile.y + 1) * TILE_SIZE - PRONG_HEIGHT)
    .with('CEILING', () => tile.y * TILE_SIZE)
    .exhaustive(() => (tile.y + 1) * TILE_SIZE - PRONG_HEIGHT),
  width: TILE_SIZE,
  height: PRONG_HEIGHT,
});
