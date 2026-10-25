import { TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

export const removeMarker = (grid: number[][], marker: number): number[][] =>
  map(grid, (row) =>
    map(row, (cell) =>
      match(cell)
        .with(marker, () => TILE_AIR)
        .otherwise(() => cell),
    ),
  );
