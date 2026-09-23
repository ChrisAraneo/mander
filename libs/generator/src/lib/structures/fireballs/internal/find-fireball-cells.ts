import { TILE_FIREBALL } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import { match } from 'ts-pattern';
import type { checkFireballsLit } from './check-fireballs-lit';

export const findFireballCells = ({
  tiles,
  lit,
}: ReturnType<typeof checkFireballsLit>) => ({
  tiles,
  cells: match(lit)
    .with(true, () => [])
    .otherwise(() =>
      flatMap(tiles, (cells, row) =>
        map(
          filter(
            range(size(cells)),
            (column) => cells[column] === TILE_FIREBALL,
          ),
          (column) => ({ row, column }),
        ),
      ),
    ),
});
