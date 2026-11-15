import { isSand, type Level } from '@mander/model';
import { some } from 'lodash-es';
import { computeTileRange } from '../../collision/compute-tile-range';

export const isSandUnderWalker = (
  level: Level,
  positionX: number,
  width: number,
  row: number,
): boolean =>
  some(computeTileRange(positionX, width), (column) =>
    isSand(level, column, row),
  );
