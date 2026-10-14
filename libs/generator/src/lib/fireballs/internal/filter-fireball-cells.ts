import { TILE_FIREBALL } from '@mander/model';
import { match } from 'ts-pattern';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { FireballCells } from './types/fireball-cells';
import type { FireballLighting } from './types/fireball-lighting';

export const filterFireballCells = ({
  tiles,
  lit,
}: FireballLighting): FireballCells => ({
  tiles,
  cells: match(lit)
    .with(true, () => [])
    .otherwise(() => filterTileCells(tiles, TILE_FIREBALL)),
});
