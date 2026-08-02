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

/**
 * Air a spike needs over its own head, counted from the row above the spike
 * rather than from the block it stands on — the spike itself eats the first
 * row of air over that block, so it is never part of its own headroom. The
 * player is a tile and a half tall and has to pass through this space feet
 * first, so a spike left with less than this cannot be jumped, only walked
 * into.
 */
const HEADROOM = 3;

/** The spike's own column and the two beside it. */
const SHOULDERS = [-1, 0, 1];

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
 * Read from the row a spike stands in: the air over its head, in its own
 * column. This is the one rule every spike answers to, whether the level grew
 * it or a structure brought it along.
 */
const hasHeadroom = (tiles: Tile[][], row: number, column: number): boolean =>
  every(
    range(1, HEADROOM + 1),
    (up) => at(tiles, row - up, column) === TILE_AIR,
  );

/**
 * Step 1. A spike is sown where it can stand free: its own square empty and
 * its headroom clear, read across its shoulders as well so the new spike lands
 * in the open rather than in a nook the player cannot swing through. Every
 * candidate is judged against the level as it came in, so a spike just laid
 * never talks the next one out of its own square.
 */
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

/**
 * Step 2. A spike under a low ceiling is not a hazard, it is a wall: the player
 * cannot get their feet over it and there is no way past but to take the hit.
 * Sown spikes are clear of this by construction, so what this catches are the
 * ones the structures brought with them, which no rule up to here has read.
 */
const dropCrampedSpikes = (tiles: Tile[][]): Tile[][] => {
  const next = clone(tiles);

  forEachCell(tiles, (tile, row, column) => {
    if (tile !== TILE_SPIKE) return;
    if (hasHeadroom(tiles, row, column)) return;
    next[row][column] = TILE_AIR;
  });

  return next;
};

/**
 * Step 3. A spike whose ground gives out to either side is standing on a lip,
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
 * Step 4. Runs of the same spike lying side by side in one row, gathered so a
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
 * Steps 5 and 6. Spikes are cleared out of a square around whatever must not
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
 * then pulled out from under low ceilings, back off the ledges, broken out of
 * long bands, and cleared away from the enemies and from both ends of the
 * level.
 *
 * Whatever a level keeps goes through the headroom rule, structures included —
 * a spike the player cannot jump is no fairer on the second level than on the
 * eighth.
 */
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
