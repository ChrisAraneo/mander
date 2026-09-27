import type { Tile } from '@mander/model';
import { floor, size, sortBy } from 'lodash-es';
import type { findVerticalPortalCandidates } from './find-vertical-portal-candidates';

const getMiddleColumn = (tiles: Tile[][]) => floor(size(tiles[0] ?? []) / 2);

export const sortVerticalPortalCandidates = ({
  tiles,
  candidates,
}: ReturnType<typeof findVerticalPortalCandidates>) => ({
  tiles,
  candidates: sortBy(candidates, [
    (candidate) => candidate.row,
    (candidate) => Math.abs(candidate.column - getMiddleColumn(tiles)),
  ]),
});
