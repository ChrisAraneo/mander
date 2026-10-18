import { TILE_BEARTRAP } from '@mander/model';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { BeartrapCells } from './types/beartrap-cells';
import type { BeartrapRemovalRate } from './types/beartrap-removal-rate';

export const filterBeartrapCells = ({
  tiles,
  rate,
  random,
}: BeartrapRemovalRate): BeartrapCells => ({
  tiles,
  rate,
  cells: filterTileCells(tiles, TILE_BEARTRAP),
  random,
});
