import { type Tile, TILE_SPIKE } from '@mander/engine';
import { every, map, range } from 'lodash-es';
import { match } from 'ts-pattern';

import { SPIKE_HEADROOM } from '../../consts';
import { isAirAt, isSolidAt } from './tile-at';

/**
 * The cell takes a spike when it is the air directly on top of a solid block
 * and the block has SPIKE_HEADROOM air above it — the spike's own cell first,
 * then the rest.
 */
const takesSpike = (tiles: Tile[][], row: number, column: number): boolean =>
  isSolidAt(tiles, row + 1, column) &&
  every(range(SPIKE_HEADROOM), (offset) =>
    isAirAt(tiles, row - offset, column),
  );

/** Rule 1: a spike on every solid block with the headroom to carry one. */
export const sowSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (rowTiles, row) =>
    map(rowTiles, (tile, column) =>
      match(takesSpike(tiles, row, column))
        .with(true, (): Tile => TILE_SPIKE)
        .otherwise((): Tile => tile),
    ),
  );
