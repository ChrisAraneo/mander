import { type Tile, TILE_AIR } from '@mander/engine';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import { isSolidAt, isSpikeAt } from './tile-at';

const isWalledIn = (tiles: Tile[][], row: number, column: number): boolean =>
  isSpikeAt(tiles, row, column) &&
  (isSolidAt(tiles, row, column - 1) || isSolidAt(tiles, row, column + 1));

/**
 * Rule 4: a spike pressed against a step or a wall cannot be jumped around,
 * only over, and the wall is what stops that.
 */
export const dropWalledSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (rowTiles, row) =>
    map(rowTiles, (tile, column) =>
      match(isWalledIn(tiles, row, column))
        .with(true, (): Tile => TILE_AIR)
        .otherwise((): Tile => tile),
    ),
  );
