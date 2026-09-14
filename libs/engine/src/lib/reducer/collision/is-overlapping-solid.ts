import { isSolid, type Level } from '@mander/model';
import { some } from 'lodash-es';

import { getTileRange } from './get-tile-range';

export const isOverlappingSolid = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  some(getTileRange(boxTop, boxHeight), (tileY) =>
    some(getTileRange(boxLeft, boxWidth), (tileX) =>
      isSolid(level, tileX, tileY),
    ),
  );
