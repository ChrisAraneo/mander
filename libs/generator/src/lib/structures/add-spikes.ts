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

/** The level walked bare, to teach the controls before anything can kill. */
const BARE_LEVEL = 1;
/** Up to here the hazards a structure carries are thinned out by half. */
const HALVED_LEVEL = 2;
const HALVED_UNTIL_LEVEL = 5;

/** Air a block needs above it before a spike is worth standing there. */
const HEADROOM = 3;

/** A run longer than this is broken up; the survivors keep this far apart. */
const MAX_RUN = 3;
const RUN_SPACING = 3;

/** Room left around an enemy, and around the way in and the way out. */
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

/** Off the edge of the level reads as air, so a border counts as open. */
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

/**
 * The level is dealt from a daily seed, so thinning cannot reach for
 * `Math.random` — the same level has to come out the same way every time it is
 * generated. There is no seed in hand here, so one is taken from the level
 * itself: the tiles are the level, and the same tiles deal the same hand.
 */
const seedOf = (tiles: Tile[][], levelNumber: number): string =>
  `${levelNumber}#${join(
    map(tiles, (row) => join(row, ',')),
    '|',
  )}`;

const withoutSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) => map(row, (tile) => (isSpike(tile) ? TILE_AIR : tile)));

/**
 * Half the spikes, chosen by the seed rather than by position, so the ones
 * that go are scattered instead of falling in a stripe. Odd counts round down,
 * leaving the extra spike in.
 */
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

/**
 * Step 1. A block with a clear 3×3 of air over it has room for a spike, and
 * gets one on its head. Every candidate is judged against the level as it came
 * in, so a spike just laid never talks the next one out of its own square.
 */
const hasHeadroom = (tiles: Tile[][], row: number, column: number): boolean =>
  every(range(1, HEADROOM + 1), (up) =>
    every(
      range(-1, 2),
      (side) => at(tiles, row - up, column + side) === TILE_AIR,
    ),
  );

const sowSpikes = (tiles: Tile[][]): Tile[][] => {
  const next = clone(tiles);

  forEachCell(tiles, (tile, row, column) => {
    if (!isSolidTile(tile)) return;
    if (!hasHeadroom(tiles, row, column)) return;
    next[row - 1][column] = TILE_SPIKE;
  });

  return next;
};

/**
 * Step 2. A spike whose ground gives out to either side is standing on a lip,
 * and a lip is where the player lands. Reading the two cells diagonally below
 * catches a stair as well: each step is a lip of its own.
 */
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

/**
 * Step 3. Runs of the same spike lying side by side in one row, gathered so a
 * long band can be broken into something the player can land between.
 */
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

/**
 * Every third spike of a long run is kept, which leaves the two blocks of
 * standing room the rule asks for between the ones that stay — four in a row
 * come out as a spike, a gap of two, and a spike.
 */
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

/**
 * Steps 4 and 5. Spikes are cleared out of a square around whatever must not
 * be walled in — an enemy needs room to walk, and the way in and the way out
 * need room to stand.
 */
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

/**
 * Lays the hazards over a joined level, harder the further into the run it
 * sits. The opening level is walked bare and the second keeps half of what its
 * structures brought; from the third the level grows its own spikes, which are
 * then pulled back off the ledges, broken out of long bands, and cleared away
 * from the enemies and from both ends of the level.
 */
export const addSpikes = (tiles: Tile[][], levelNumber: number): Tile[][] => {
  const random = createRandom(seedOf(tiles, levelNumber));

  if (levelNumber <= BARE_LEVEL) {
    return withoutSpikes(tiles);
  }

  if (levelNumber === HALVED_LEVEL) {
    return halveSpikes(tiles, random);
  }

  const grown = flow(
    sowSpikes,
    dropEdgeSpikes,
    thinRuns,
    (laid: Tile[][]) => clearAround(laid, [TILE_ENEMY], ENEMY_CLEARANCE),
    (laid: Tile[][]) =>
      clearAround(laid, [TILE_SPAWN, TILE_PORTAL], MARKER_CLEARANCE),
  )(tiles);

  return levelNumber <= HALVED_UNTIL_LEVEL ? halveSpikes(grown, random) : grown;
};
