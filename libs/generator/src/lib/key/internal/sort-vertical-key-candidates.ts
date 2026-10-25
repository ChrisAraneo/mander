import type { Tile } from '@mander/model';
import { sortBy } from 'lodash-es';
import type { Spot } from '../../types/spot';
import { computeMiddleRow } from './compute-middle-row';

export const sortVerticalKeyCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] =>
  sortBy(candidates, (candidate) =>
    Math.abs(candidate.row - computeMiddleRow(tiles)),
  );
