import type { Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { indexOf, size, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import { getMiddleColumn } from '../../get-middle-column';
import type { Spot } from '../../types/spot';
import type { findPortalCandidates } from './find-portal-candidates';

const PREFERRED_PORTAL_OFFSETS = [1, 2, 3, 0];

const NOT_FOUND = -1;

const getOffsetPriority = (tiles: Tile[][], { column }: Spot): number =>
  chain(size(tiles[0]) - 1 - column)
    .thru((offset) =>
      match(indexOf(PREFERRED_PORTAL_OFFSETS, offset))
        .with(NOT_FOUND, () => offset)
        .otherwise((priority) => priority),
    )
    .value();

export const sortPortalCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof findPortalCandidates>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      sortBy(candidates, (candidate) => getOffsetPriority(tiles, candidate)),
    )
    .with('VERTICAL', () =>
      sortBy(candidates, [
        (candidate) => candidate.row,
        (candidate) => Math.abs(candidate.column - getMiddleColumn(tiles)),
      ]),
    )
    .exhaustive(),
});
