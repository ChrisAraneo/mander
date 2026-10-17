import { isSolid, type Level } from '@mander/model';
import { some } from 'lodash-es';
import { computeTileRange } from '../compute-tile-range';

export const isOverlappingSolid = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  some(computeTileRange(boxTop, boxHeight), (tileY) =>
    some(computeTileRange(boxLeft, boxWidth), (tileX) =>
      isSolid(level, tileX, tileY),
    ),
  );
