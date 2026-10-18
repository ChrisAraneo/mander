import { TILE_CANNON } from '@mander/model';
import { match } from 'ts-pattern';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { CannonArming } from './types/cannon-arming';
import type { CannonCells } from './types/cannon-cells';

export const filterCannonCells = ({
  tiles,
  armed,
}: CannonArming): CannonCells => ({
  tiles,
  cells: match(armed)
    .with(true, () => [])
    .otherwise(() => filterTileCells(tiles, TILE_CANNON)),
});
