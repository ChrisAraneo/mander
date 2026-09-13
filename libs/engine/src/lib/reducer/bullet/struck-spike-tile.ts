import {
  type Bullet,
  getSpikeOrientation,
  isSpike,
  type Level,
  PRONG_HEIGHT,
  TILE_SIZE,
} from '@mander/model';
import type { Point, Rectangle } from '@mander/utils';
import { find, flatMap, map } from 'lodash-es';
import { match } from 'ts-pattern';

import { tileRange } from '../collision/tile-range';
import { bulletBox } from './bullet-box';
import { overlapsBox } from './overlaps-box';

// the whole band the prongs rise through, not the prongs themselves: a shot
// grazing the tips still shatters the row, where it would slip between them
const prongBand = (level: Level, tile: Point): Rectangle => ({
  x: tile.x * TILE_SIZE,
  y: match(getSpikeOrientation(level, tile.x, tile.y))
    .with('CEILING', () => tile.y * TILE_SIZE)
    .otherwise(() => (tile.y + 1) * TILE_SIZE - PRONG_HEIGHT),
  width: TILE_SIZE,
  height: PRONG_HEIGHT,
});

export const struckSpikeTile = (
  level: Level,
  bullet: Bullet,
): Point | undefined => {
  const box = bulletBox(bullet);

  return find(
    flatMap(tileRange(box.y, box.height), (y) =>
      map(tileRange(box.x, box.width), (x): Point => ({ x, y })),
    ),
    (tile) =>
      isSpike(level, tile.x, tile.y) &&
      overlapsBox(box, prongBand(level, tile)),
  );
};
