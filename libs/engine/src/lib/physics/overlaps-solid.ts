import { isSolid, type Level } from '@mander/generator';
import { some } from 'lodash-es';

import { tileRange } from './tile-range';

export const overlapsSolid = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  some(tileRange(boxTop, boxHeight), (tileY) =>
    some(tileRange(boxLeft, boxWidth), (tileX) => isSolid(level, tileX, tileY)),
  );
