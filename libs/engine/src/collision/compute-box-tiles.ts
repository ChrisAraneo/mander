import type { Point, Rectangle } from '@mander/model';
import { flatMap, map } from 'lodash-es';
import { computeTileRange } from './compute-tile-range';

export const computeBoxTiles = (box: Rectangle): Point[] =>
  flatMap(computeTileRange(box.y, box.height), (row) =>
    map(computeTileRange(box.x, box.width), (column): Point => ({
      x: column,
      y: row,
    })),
  );
