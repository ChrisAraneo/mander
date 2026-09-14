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

import { getTileRange } from '../collision/get-tile-range';
import { getBulletBox } from './get-bullet-box';
import { isOverlappingBox } from './is-overlapping-box';

// the whole band the prongs rise through, not the prongs themselves: a shot
// grazing the tips still shatters the row, where it would slip between them
const getProngBand = (level: Level, tile: Point): Rectangle => ({
  x: tile.x * TILE_SIZE,
  y: match(getSpikeOrientation(level, tile.x, tile.y))
    .with('CEILING', () => tile.y * TILE_SIZE)
    .otherwise(() => (tile.y + 1) * TILE_SIZE - PRONG_HEIGHT),
  width: TILE_SIZE,
  height: PRONG_HEIGHT,
});

export const findStruckSpikeTile = (
  level: Level,
  bullet: Bullet,
): Point | undefined => {
  const box = getBulletBox(bullet);

  return find(
    flatMap(getTileRange(box.y, box.height), (y) =>
      map(getTileRange(box.x, box.width), (x): Point => ({ x, y })),
    ),
    (tile) =>
      isSpike(level, tile.x, tile.y) &&
      isOverlappingBox(box, getProngBand(level, tile)),
  );
};
