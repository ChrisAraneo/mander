import { type Tile, TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

export const patchShatteredSpikeRow = (cells: Tile[], column: number): Tile[] =>
  map(cells, (cell, index) =>
    match(index === column)
      .with(true, () => TILE_AIR)
      .otherwise(() => cell),
  );
