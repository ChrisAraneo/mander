import type { Tile } from '@mander/model';
import { sortBy } from 'lodash-es';
import type { Spot } from '../../types/spot';
import { computeMiddleSeam } from './compute-middle-seam';

export const sortHorizontalKeyCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] =>
  sortBy(candidates, [
    (candidate) => Math.abs(candidate.column - computeMiddleSeam(tiles)),
    (candidate) => candidate.column,
  ]);
