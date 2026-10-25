import {
  getSpikeOrientation,
  type Level,
  PRONG_HEIGHT,
  TILE_SIZE,
  type Point,
  type Rectangle,
} from '@mander/model';
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
