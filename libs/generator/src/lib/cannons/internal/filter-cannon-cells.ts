import { TILE_CANNON } from '@mander/model';
import { match } from 'ts-pattern';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { computeCannonsArmed } from './compute-cannons-armed';

export const filterCannonCells = ({
  tiles,
  armed,
}: ReturnType<typeof computeCannonsArmed>) => ({
  tiles,
  cells: match(armed)
    .with(true, () => [])
    .otherwise(() => filterTileCells(tiles, TILE_CANNON)),
});
