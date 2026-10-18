import type { Tile } from '@mander/model';
import { sortBy } from 'lodash-es';
import { computeMiddleColumn } from '../../structures/compute-middle-column';
import type { Spot } from '../../types/spot';

export const sortVerticalPlayerSpawnCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] =>
  sortBy(candidates, [
    (candidate) => -candidate.row,
    (candidate) => Math.abs(candidate.column - computeMiddleColumn(tiles)),
  ]);
