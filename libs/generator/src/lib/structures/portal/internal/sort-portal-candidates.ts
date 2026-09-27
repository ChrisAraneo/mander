import type { Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { indexOf, size, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Spot } from '../../find-standing-spots';
import { getMiddleColumn } from '../../get-middle-column';
import type { findPortalCandidates } from './find-portal-candidates';

const PREFERRED_PORTAL_OFFSETS = [1, 2, 3, 0];

const getOffsetPriority = (tiles: Tile[][], { column }: Spot) =>
  chain(size(tiles[0]) - 1 - column)
    .thru((offset) =>
      match(indexOf(PREFERRED_PORTAL_OFFSETS, offset))
        .when(
          (priority) => priority === -1,
          () => offset,
        )
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
