import { isSolid, type TileMap } from '../world';
import { some } from 'lodash-es';

import { tileRange } from './tile-range';

export const overlapsSolid = (
  level: TileMap,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  some(tileRange(boxTop, boxHeight), (tileY) =>
    some(tileRange(boxLeft, boxWidth), (tileX) => isSolid(level, tileX, tileY)),
  );
