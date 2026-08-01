import { type Tile, TILE_AIR, TILE_SPIKE } from '@mander/engine';
import { filter, flatMap, floor, map, reduce, times } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { SPIKE_BREAK_RUN, SPIKE_BREAK_WIDTH } from '../../consts';

interface Run {
  start: number;
  length: number;
}

/** Every stretch of spikes standing shoulder to shoulder in one row. */
const runsIn = (rowTiles: Tile[]): Run[] =>
  reduce(
    map(rowTiles, (tile) => tile === TILE_SPIKE),
    (runs: Run[], isSpike, column): Run[] =>
      match({ isSpike, last: runs.at(-1) })
        .with({ isSpike: false }, () => runs)
        .with(
          {
            last: P.when(
              (last): last is Run =>
                last !== undefined && last.start + last.length === column,
            ),
          },
          ({ last }): Run[] => [
            ...runs.slice(0, -1),
            { start: last.start, length: last.length + 1 },
          ],
        )
        .otherwise((): Run[] => [...runs, { start: column, length: 1 }]),
    [],
  );

/** The columns of the SPIKE_BREAK_WIDTH spikes at the centre of a run. */
const middleColumns = (run: Run): number[] =>
  times(
    SPIKE_BREAK_WIDTH,
    (index) => run.start + floor((run.length - SPIKE_BREAK_WIDTH) / 2) + index,
  );

const breakRow = (rowTiles: Tile[]): Tile[] => {
  const broken = new Set(
    flatMap(
      filter(runsIn(rowTiles), (run) => run.length >= SPIKE_BREAK_RUN),
      middleColumns,
    ),
  );
  return match(broken.size)
    .with(0, () => rowTiles)
    .otherwise(() =>
      breakRow(
        map(rowTiles, (tile, column): Tile =>
          match(broken.has(column))
            .with(true, (): Tile => TILE_AIR)
            .otherwise((): Tile => tile),
        ),
      ),
    );
};

/**
 * Rule 2: knock the middle out of any run of SPIKE_BREAK_RUN or more, and keep
 * going until nothing is that long. A single sweep would leave a twenty-wide
 * field as two nine-wide walls, no more crossable than what it started as.
 */
export const breakLongRuns = (tiles: Tile[][]): Tile[][] =>
  map(tiles, breakRow);
