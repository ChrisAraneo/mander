import { TILE_STONE } from '@mander/model';
import { flatMap } from 'lodash-es';
import { match } from 'ts-pattern';
import { STONE_FLAG } from '../../consts';
import type { StoneKeptCells } from './types/stone-kept-cells';
import type { StonePatch } from './types/stone-patch';

export const createStonePatches = ({
  tiles,
  cells,
}: StoneKeptCells): StonePatch => ({
  tiles,
  patches: flatMap(cells, (flags, row) =>
    flatMap(flags, (stone, column) =>
      match(stone)
        .with(STONE_FLAG, () => [{ row, column, tile: TILE_STONE }])
        .otherwise(() => []),
    ),
  ),
});
