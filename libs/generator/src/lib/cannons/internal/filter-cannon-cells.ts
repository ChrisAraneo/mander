import { TILE_CANNON } from '@mander/model';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { CannonCells } from './types/cannon-cells';
import type { CannonRemovalRate } from './types/cannon-removal-rate';

export const filterCannonCells = ({
  tiles,
  rate,
}: CannonRemovalRate): CannonCells => ({
  tiles,
  rate,
  cells: filterTileCells(tiles, TILE_CANNON),
});
