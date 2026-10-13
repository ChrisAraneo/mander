import { TILE_STONE } from '@mander/model';
import { flatMap } from 'lodash-es';
import { match } from 'ts-pattern';
import type { removeLoneStones } from './remove-lone-stones';

const STONE_FLAG = 1;

export const createStonePatches = ({
  tiles,
  cells,
}: ReturnType<typeof removeLoneStones>) => ({
  tiles,
  patches: flatMap(cells, (flags, row) =>
    flatMap(flags, (stone, column) =>
      match(stone)
        .with(STONE_FLAG, () => [{ row, column, tile: TILE_STONE }])
        .otherwise(() => []),
    ),
  ),
});
