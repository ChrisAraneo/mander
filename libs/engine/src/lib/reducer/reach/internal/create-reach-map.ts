import type { Level } from '@mander/model';
import { map, range } from 'lodash-es';
import type { ReachMap } from '../types/reach-map';
import { computeCellIndex } from './compute-cell-index';

export const createReachMap = (
  level: Level,
  cells: ReadonlySet<number>,
): ReachMap =>
  map(range(level.height), (row) =>
    map(range(level.width), (column) =>
      cells.has(computeCellIndex(level, row, column)),
    ),
  );
