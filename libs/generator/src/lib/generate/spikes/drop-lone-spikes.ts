import { type Tile, TILE_AIR } from '@mander/engine';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import { isSpikeAt } from './tile-at';

const standsAlone = (tiles: Tile[][], row: number, column: number): boolean =>
  isSpikeAt(tiles, row, column) &&
  !isSpikeAt(tiles, row, column - 1) &&
  !isSpikeAt(tiles, row, column + 1);

/** Rule 3: a spike with nothing beside it is not a hazard, it is a nuisance. */
export const dropLoneSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (rowTiles, row) =>
    map(rowTiles, (tile, column) =>
      match(standsAlone(tiles, row, column))
        .with(true, (): Tile => TILE_AIR)
        .otherwise((): Tile => tile),
    ),
  );
