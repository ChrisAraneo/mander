import { TILE_FIREBALL } from '@mander/model';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { FireballCells } from './types/fireball-cells';
import type { FireballRemovalRate } from './types/fireball-removal-rate';

export const filterFireballCells = ({
  tiles,
  rate,
}: FireballRemovalRate): FireballCells => ({
  tiles,
  rate,
  cells: filterTileCells(tiles, TILE_FIREBALL),
});
