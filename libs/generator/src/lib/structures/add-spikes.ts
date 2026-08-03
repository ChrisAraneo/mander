import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_ENEMY,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import {
  every,
  flatMap,
  floor,
  flow,
  forEach,
  includes,
  initial,
  join,
  last,
  map,
  range,
  reduce,
  size,
  sortBy,
  take,
} from 'lodash-es';

const BARE_LEVEL = 1;
const HALVED_LEVEL = 2;
const HALVED_UNTIL_LEVEL = 5;

const HEADROOM = 3;

const SHOULDERS = [-1, 0, 1];

const MAX_RUN = 3;
const RUN_SPACING = 3;

const ENEMY_CLEARANCE = 2;
const MARKER_CLEARANCE = 3;

interface Cell {
  row: number;
  column: number;
}

interface Run {
  row: number;
  start: number;
  end: number;
}

const isSpike = (tile: Tile): boolean =>
  tile === TILE_SPIKE || tile === TILE_SPIKE_CEILING;

const clone = (tiles: Tile[][]): Tile[][] => map(tiles, (row) => [...row]);

const at = (tiles: Tile[][], row: number, column: number): Tile =>
  tiles[row]?.[column] ?? TILE_AIR;

const isInside = (tiles: Tile[][], row: number, column: number): boolean =>
  row >= 0 && row < size(tiles) && column >= 0 && column < size(tiles[row]);

const forEachCell = (
  tiles: Tile[][],
  visit: (tile: Tile, row: number, column: number) => void,
): void => {
  forEach(tiles, (cells, row) =>
    forEach(cells, (tile, column) => visit(tile, row, column)),
  );
};

const spikeCells = (tiles: Tile[][]): Cell[] => {
  const found: Cell[] = [];
  forEachCell(tiles, (tile, row, column) => {
    if (isSpike(tile)) found.push({ row, column });
  });

  return found;
};

const seedOf = (tiles: Tile[][], levelNumber: number): string =>
  `${levelNumber}#${join(
    map(tiles, (row) => join(row, ',')),
    '|',
  )}`;

const withoutSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) => map(row, (tile) => (isSpike(tile) ? TILE_AIR : tile)));

const halveSpikes = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
): Tile[][] => {
  const next = clone(tiles);
  const spikes = spikeCells(tiles);
  const doomed = take(
    sortBy(spikes, () => random.next()),
    floor(size(spikes) / 2),
  );

  forEach(doomed, ({ row, column }) => {
    next[row][column] = TILE_AIR;
  });

  return next;
};

const hasHeadroom = (tiles: Tile[][], row: number, column: number): boolean =>
  every(
    range(1, HEADROOM + 1),
    (up) => at(tiles, row - up, column) === TILE_AIR,
  );

const hasRoomToSow = (tiles: Tile[][], row: number, column: number): boolean =>
  every(
    SHOULDERS,
    (side) =>
      at(tiles, row, column + side) === TILE_AIR &&
      hasHeadroom(tiles, row, column + side),
  );

const sowSpikes = (tiles: Tile[][]): Tile[][] => {
  const next = clone(tiles);

  forEachCell(tiles, (tile, row, column) => {
    if (!isSolidTile(tile)) return;
    if (!hasRoomToSow(tiles, row - 1, column)) return;
    next[row - 1][column] = TILE_SPIKE;
  });

  return next;
};

const dropCrampedSpikes = (tiles: Tile[][]): Tile[][] => {
  const next = clone(tiles);

  forEachCell(tiles, (tile, row, column) => {
    if (tile !== TILE_SPIKE) return;
    if (hasHeadroom(tiles, row, column)) return;
    next[row][column] = TILE_AIR;
  });

  return next;
};

const isOnEdge = (tiles: Tile[][], row: number, column: number): boolean =>
  !isSolidTile(at(tiles, row + 1, column - 1)) ||
  !isSolidTile(at(tiles, row + 1, column + 1));

const dropEdgeSpikes = (tiles: Tile[][]): Tile[][] => {
  const next = clone(tiles);

  forEachCell(tiles, (tile, row, column) => {
    if (tile !== TILE_SPIKE) return;
    if (!isOnEdge(tiles, row, column)) return;
    next[row][column] = TILE_AIR;
  });

  return next;
};

const runsIn = (cells: Tile[], row: number): Run[] =>
  reduce(
    cells,
    (runs: Run[], tile, column): Run[] => {
      if (!isSpike(tile)) return runs;

      const open = last(runs);
      const joins =
        open !== undefined &&
        open.end === column - 1 &&
        cells[open.start] === tile;

      return joins
        ? [...initial(runs), { ...open, end: column }]
        : [...runs, { row, start: column, end: column }];
    },
    [],
  );

const thinRuns = (tiles: Tile[][]): Tile[][] => {
  const next = clone(tiles);

  forEach(flatMap(tiles, runsIn), (run) => {
    if (run.end - run.start + 1 <= MAX_RUN) return;

    forEach(range(run.start, run.end + 1), (column) => {
      if ((column - run.start) % RUN_SPACING === 0) return;
      next[run.row][column] = TILE_AIR;
    });
  });

  return next;
};

const clearAround = (
  tiles: Tile[][],
  keepClearOf: Tile[],
  clearance: number,
): Tile[][] => {
  const next = clone(tiles);

  forEachCell(tiles, (tile, row, column) => {
    if (!includes(keepClearOf, tile)) return;

    forEach(range(row - clearance, row + clearance + 1), (near) =>
      forEach(range(column - clearance, column + clearance + 1), (beside) => {
        if (!isInside(next, near, beside)) return;
        if (!isSpike(next[near][beside])) return;
        next[near][beside] = TILE_AIR;
      }),
    );
  });

  return next;
};

export const addSpikes = (tiles: Tile[][], levelNumber: number): Tile[][] => {
  const random = createRandom(seedOf(tiles, levelNumber));

  if (levelNumber <= BARE_LEVEL) {
    return withoutSpikes(tiles);
  }

  if (levelNumber === HALVED_LEVEL) {
    return halveSpikes(dropCrampedSpikes(tiles), random);
  }

  const grown = flow(
    sowSpikes,
    dropCrampedSpikes,
    dropEdgeSpikes,
    thinRuns,
    (laid: Tile[][]) => clearAround(laid, [TILE_ENEMY], ENEMY_CLEARANCE),
    (laid: Tile[][]) =>
      clearAround(laid, [TILE_SPAWN, TILE_PORTAL], MARKER_CLEARANCE),
  )(tiles);

  return levelNumber <= HALVED_UNTIL_LEVEL ? halveSpikes(grown, random) : grown;
};
