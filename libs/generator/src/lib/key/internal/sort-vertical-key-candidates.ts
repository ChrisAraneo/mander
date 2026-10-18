import type { Tile } from '@mander/model';
import { floor, size, sortBy } from 'lodash-es';
import type { Spot } from '../../types/spot';

const computeMiddleRow = (tiles: Tile[][]): number => floor(size(tiles) / 2);

export const sortVerticalKeyCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] =>
  sortBy(candidates, (candidate) =>
    Math.abs(candidate.row - computeMiddleRow(tiles)),
  );
