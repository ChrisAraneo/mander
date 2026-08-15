import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import {
  drop,
  every,
  flatMap,
  flow,
  forEach,
  includes,
  initial,
  join,
  last,
  map,
  range,
  reduce,
  round,
  size,
  sortBy,
} from 'lodash-es';
import { match } from 'ts-pattern';

const BARE_LEVEL = 1;

const FULL_DENSITY = 1;

const SPIKE_DENSITY: readonly number[] = Object.freeze([0, 0.4, 0.6, 0.7, 0.8]);

const HEADROOM = 3;
const LEAP_HEADROOM = HEADROOM + 1;

const SHOULDERS = [-1, 0, 1];

const MAX_RUN = 2;
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

const densityFor = (levelNumber: number): number =>
  SPIKE_DENSITY[levelNumber - 1] ?? FULL_DENSITY;

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

const floorSpikeCells = (tiles: Tile[][]): Cell[] => {
  const found: Cell[] = [];
  forEachCell(tiles, (tile, row, column) => {
    if (tile === TILE_SPIKE) found.push({ row, column });
  });

  return found;
};

const withoutFloorSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) =>
    map(row, (tile) => (tile === TILE_SPIKE ? TILE_AIR : tile)),
  );

const stampSpikes = (tiles: Tile[][], cells: Cell[]): Tile[][] => {
  const next = clone(tiles);

  forEach(cells, ({ row, column }) => {
    next[row][column] = TILE_SPIKE;
  });

  return next;
};

const seedOf = (tiles: Tile[][], levelNumber: number): string =>
  `${levelNumber}#${join(
    map(tiles, (row) => join(row, ',')),
    '|',
  )}`;

const withoutSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) => map(row, (tile) => (isSpike(tile) ? TILE_AIR : tile)));

const thinToDensity = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
  density: number,
): Tile[][] => {
  const next = clone(tiles);
  const spikes = floorSpikeCells(tiles);
  const doomed = drop(
    sortBy(spikes, () => random.next()),
    round(size(spikes) * density),
  );

  forEach(doomed, ({ row, column }) => {
    next[row][column] = TILE_AIR;
  });

  return next;
};

const hasAirAbove = (
  tiles: Tile[][],
  row: number,
  column: number,
  height: number,
): boolean =>
  every(range(1, height + 1), (up) => at(tiles, row - up, column) === TILE_AIR);

const hasHeadroom = (tiles: Tile[][], row: number, column: number): boolean =>
  hasAirAbove(tiles, row, column, HEADROOM);

const isLeapable = (tiles: Tile[][], row: number, column: number): boolean =>
  hasAirAbove(tiles, row, column, LEAP_HEADROOM) &&
  hasAirAbove(tiles, row, column - 1, LEAP_HEADROOM);

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
    if (!isSolidTile(tile) || tile === TILE_CANNON || tile === TILE_FIREBALL)
      return;
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
      if (tile !== TILE_SPIKE) return runs;

      const open = last(runs);
      const joins = open !== undefined && open.end === column - 1;

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

const keyOf = ({ row, column }: Cell): string => `${row},${column}`;

const doomedOfPair = (
  left: Cell,
  right: Cell,
  spared: Set<string>,
): Cell | null =>
  match({ left: spared.has(keyOf(left)), right: spared.has(keyOf(right)) })
    .with({ right: false }, () => right)
    .with({ left: false }, () => left)
    .otherwise(() => null);

const partCappedPairs = (tiles: Tile[][], spared: Cell[]): Tile[][] => {
  const next = clone(tiles);
  const kept = new Set(map(spared, keyOf));

  forEach(flatMap(tiles, runsIn), (run) =>
    forEach(range(run.start + 1, run.end + 1), (column) => {
      const left: Cell = { row: run.row, column: column - 1 };
      const right: Cell = { row: run.row, column };

      if (next[left.row][left.column] !== TILE_SPIKE) return;
      if (next[right.row][right.column] !== TILE_SPIKE) return;
      if (isLeapable(tiles, run.row, column)) return;

      const doomed = doomedOfPair(left, right, kept);
      if (doomed === null) return;

      next[doomed.row][doomed.column] = TILE_AIR;
    }),
  );

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

  const original = floorSpikeCells(tiles);
  const sown = flow(
    sowSpikes,
    dropCrampedSpikes,
    dropEdgeSpikes,
    thinRuns,
    (laid: Tile[][]) => clearAround(laid, [TILE_ENEMY], ENEMY_CLEARANCE),
    (laid: Tile[][]) =>
      clearAround(laid, [TILE_SPAWN, TILE_PORTAL], MARKER_CLEARANCE),
    (laid: Tile[][]) => thinToDensity(laid, random, densityFor(levelNumber)),
  )(withoutFloorSpikes(tiles));

  return partCappedPairs(stampSpikes(sown, original), original);
};
