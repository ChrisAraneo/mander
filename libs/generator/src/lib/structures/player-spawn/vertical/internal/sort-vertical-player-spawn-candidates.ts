import type { Tile } from '@mander/model';
import { floor, size, sortBy } from 'lodash-es';
import type { findVerticalPlayerSpawnCandidates } from './find-vertical-player-spawn-candidates';

const getMiddleColumn = (tiles: Tile[][]) => floor(size(tiles[0] ?? []) / 2);

export const sortVerticalPlayerSpawnCandidates = ({
  tiles,
  candidates,
}: ReturnType<typeof findVerticalPlayerSpawnCandidates>) => ({
  tiles,
  candidates: sortBy(candidates, [
    (candidate) => -candidate.row,
    (candidate) => Math.abs(candidate.column - getMiddleColumn(tiles)),
  ]),
});
