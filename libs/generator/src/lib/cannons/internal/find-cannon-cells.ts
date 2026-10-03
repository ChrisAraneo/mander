import { TILE_CANNON } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import { match } from 'ts-pattern';
import type { markCannonsArmed } from './mark-cannons-armed';

export const findCannonCells = ({
  tiles,
  armed,
}: ReturnType<typeof markCannonsArmed>) => ({
  tiles,
  cells: match(armed)
    .with(true, () => [])
    .otherwise(() =>
      flatMap(tiles, (cells, row) =>
        map(
          filter(range(size(cells)), (column) => cells[column] === TILE_CANNON),
          (column) => ({ row, column }),
        ),
      ),
    ),
});
