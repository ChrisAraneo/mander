import type { Tile } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { floor, size, sortBy } from 'lodash-es';
import type { Spot } from '../../types/spot';

const computeMiddleSeam = (tiles: Tile[][]): number =>
  floor(size(tiles[0]) / 2 / STRUCTURE_WIDTH) * STRUCTURE_WIDTH;

export const sortHorizontalKeyCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] =>
  sortBy(candidates, [
    (candidate) => Math.abs(candidate.column - computeMiddleSeam(tiles)),
    (candidate) => candidate.column,
  ]);
