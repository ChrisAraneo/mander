import { type Tile, chain } from '@mander/model';
import { indexOf, size, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Spot } from '../../types/spot';

const PREFERRED_PORTAL_OFFSETS = [1, 2, 3, 0];

const NOT_FOUND = -1;

const findOffsetPriority = (tiles: Tile[][], { column }: Spot): number =>
  chain(size(tiles[0]) - 1 - column)
    .thru((offset) =>
      match(indexOf(PREFERRED_PORTAL_OFFSETS, offset))
        .with(NOT_FOUND, () => offset)
        .otherwise((priority) => priority),
    )
    .value();

export const sortHorizontalPortalCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] =>
  sortBy(candidates, (candidate) => findOffsetPriority(tiles, candidate));
