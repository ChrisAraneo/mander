import { TILE_STONE } from '@mander/model';
import { flatMap } from 'lodash-es';
import { match } from 'ts-pattern';
import type { clearLoneStones } from './clear-lone-stones';

export const createStonePatches = ({
  tiles,
  cells,
}: ReturnType<typeof clearLoneStones>) => ({
  tiles,
  patches: flatMap(cells, (flags, row) =>
    flatMap(flags, (stone, column) =>
      match(stone)
        .with(1, () => [{ row, column, tile: TILE_STONE }])
        .otherwise(() => []),
    ),
  ),
});
