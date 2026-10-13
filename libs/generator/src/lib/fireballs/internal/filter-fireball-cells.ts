import { TILE_FIREBALL } from '@mander/model';
import { match } from 'ts-pattern';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { computeFireballsLit } from './compute-fireballs-lit';

export const filterFireballCells = ({
  tiles,
  lit,
}: ReturnType<typeof computeFireballsLit>) => ({
  tiles,
  cells: match(lit)
    .with(true, () => [])
    .otherwise(() => filterTileCells(tiles, TILE_FIREBALL)),
});
