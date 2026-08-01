import { type Tile, TILE_AIR, TILE_SPIKE_CEILING } from '@mander/engine';
import { every, map, range, some } from 'lodash-es';
import { match } from 'ts-pattern';

import { SPIKE_SQUEEZE_ROWS } from '../../consts';
import { isAirAt, isSpikeAt, tileAt } from './tile-at';

/**
 * The gap the player has to thread: clear air above the ground spike, and clear
 * air below the ceiling spike leaning over the column beside it.
 *
 *     0 4        4 0
 *     0 0   or   0 0
 *     0 0        0 0
 *     3 X        X 3
 */
const isSqueezedFrom = (
  tiles: Tile[][],
  row: number,
  column: number,
  side: number,
): boolean =>
  tileAt(tiles, row - SPIKE_SQUEEZE_ROWS, column + side) ===
    TILE_SPIKE_CEILING &&
  every(range(1, SPIKE_SQUEEZE_ROWS + 1), (offset) =>
    isAirAt(tiles, row - offset, column),
  ) &&
  every(range(1, SPIKE_SQUEEZE_ROWS), (offset) =>
    isAirAt(tiles, row - offset, column + side),
  );

const isSqueezed = (tiles: Tile[][], row: number, column: number): boolean =>
  isSpikeAt(tiles, row, column) &&
  some([-1, 1], (side) => isSqueezedFrom(tiles, row, column, side));

/**
 * Rule 5: a ceiling spike hanging over the next column turns the ground spike
 * below into a gate rather than an obstacle. The one on the floor goes; the one
 * overhead was placed by hand and stays.
 */
export const dropSqueezedSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (rowTiles, row) =>
    map(rowTiles, (tile, column) =>
      match(isSqueezed(tiles, row, column))
        .with(true, (): Tile => TILE_AIR)
        .otherwise((): Tile => tile),
    ),
  );
