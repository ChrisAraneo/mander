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
import { chain, createRandom } from '@mander/utils';
import {
  drop,
  every,
  filter,
  flatMap,
  flow,
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
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const { nullish, number } = P;

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

interface Pair extends Cell {
  left: Cell;
  right: Cell;
}

/** Cells removed so far, with a key set so membership stays a lookup. */
interface Parting {
  keys: Set<string>;
  cells: Cell[];
}

const isSpike = (tile: Tile): boolean =>
  tile === TILE_SPIKE || tile === TILE_SPIKE_CEILING;

const densityFor = (levelNumber: number): number =>
  SPIKE_DENSITY[levelNumber - 1] ?? FULL_DENSITY;

const at = (tiles: Tile[][], row: number, column: number): Tile =>
  tiles[row]?.[column] ?? TILE_AIR;

const isInside = (tiles: Tile[][], row: number, column: number): boolean =>
  row >= 0 && row < size(tiles) && column >= 0 && column < size(tiles[row]);

/**
 * Cells matching `keep`, in row-major order. Sifting columns before building
 * any object keeps a whole-grid scan to one number array per row rather than
 * one object per cell — this runs seven times per level.
 */
const cellsWhere = (tiles: Tile[][], keep: (tile: Tile) => boolean): Cell[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => keep(cells[column])),
      (column): Cell => ({ row, column }),
    ),
  );

const toAir = ({ row, column }: Cell): TilePatch => ({
  row,
  column,
  tile: TILE_AIR,
});

const floorSpikeCells = (tiles: Tile[][]): Cell[] =>
  cellsWhere(tiles, (tile) => tile === TILE_SPIKE);

const withoutFloorSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) =>
    map(row, (tile) =>
      match(tile)
        .with(TILE_SPIKE, () => TILE_AIR)
        .otherwise(() => tile),
    ),
  );

const stampSpikes = (tiles: Tile[][], cells: Cell[]): Tile[][] =>
  patchTiles(
    tiles,
    map(cells, ({ row, column }): TilePatch => ({
      row,
      column,
      tile: TILE_SPIKE,
    })),
  );

const seedOf = (tiles: Tile[][], levelNumber: number): string =>
  `${levelNumber}#${join(
    map(tiles, (row) => join(row, ',')),
    '|',
  )}`;

const withoutSpikes = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) =>
    map(row, (tile) =>
      match(isSpike(tile))
        .with(true, () => TILE_AIR)
        .otherwise(() => tile),
    ),
  );

const thinToDensity = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
  density: number,
): Tile[][] =>
  chain(floorSpikeCells(tiles))
    .thru((spikes) =>
      drop(
        sortBy(spikes, () => random.next()),
        round(size(spikes) * density),
      ),
    )
    .map(toAir)
    .thru((patches) => patchTiles(tiles, patches))
    .value();

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

const canCarrySpike = (tile: Tile): boolean =>
  isSolidTile(tile) && tile !== TILE_CANNON && tile !== TILE_FIREBALL;

const sowSpikes = (tiles: Tile[][]): Tile[][] =>
  chain(cellsWhere(tiles, canCarrySpike))
    .filter(({ row, column }) => hasRoomToSow(tiles, row - 1, column))
    .map(({ row, column }): TilePatch => ({
      row: row - 1,
      column,
      tile: TILE_SPIKE,
    }))
    .thru((patches) => patchTiles(tiles, patches))
    .value();

const dropCrampedSpikes = (tiles: Tile[][]): Tile[][] =>
  chain(floorSpikeCells(tiles))
    .filter(({ row, column }) => !hasHeadroom(tiles, row, column))
    .map(toAir)
    .thru((patches) => patchTiles(tiles, patches))
    .value();

const isOnEdge = (tiles: Tile[][], row: number, column: number): boolean =>
  !isSolidTile(at(tiles, row + 1, column - 1)) ||
  !isSolidTile(at(tiles, row + 1, column + 1));

const dropEdgeSpikes = (tiles: Tile[][]): Tile[][] =>
  chain(floorSpikeCells(tiles))
    .filter(({ row, column }) => isOnEdge(tiles, row, column))
    .map(toAir)
    .thru((patches) => patchTiles(tiles, patches))
    .value();

const runsIn = (cells: Tile[], row: number): Run[] =>
  reduce(
    cells,
    (runs: Run[], tile, column): Run[] =>
      match({ spike: tile === TILE_SPIKE, open: last(runs) })
        .with({ spike: false }, () => runs)
        .with({ open: { end: column - 1 } }, ({ open }) => [
          ...initial(runs),
          { ...open, end: column },
        ])
        .otherwise(() => [...runs, { row, start: column, end: column }]),
    [],
  );

const thinRuns = (tiles: Tile[][]): Tile[][] =>
  chain(flatMap(tiles, runsIn))
    .filter((run) => run.end - run.start + 1 > MAX_RUN)
    .flatMap((run) =>
      chain(range(run.start, run.end + 1))
        .filter((column) => (column - run.start) % RUN_SPACING !== 0)
        .map((column): TilePatch => toAir({ row: run.row, column }))
        .value(),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();

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

/** Every adjacent spike pair inside a run, left to right, run by run. */
const cappedPairs = (tiles: Tile[][]): Pair[] =>
  flatMap(flatMap(tiles, runsIn), (run) =>
    map(range(run.start + 1, run.end + 1), (column): Pair => ({
      row: run.row,
      column,
      left: { row: run.row, column: column - 1 },
      right: { row: run.row, column },
    })),
  );

const isStandingSpike = (
  tiles: Tile[][],
  parted: Parting,
  cell: Cell,
): boolean =>
  at(tiles, cell.row, cell.column) === TILE_SPIKE &&
  !parted.keys.has(keyOf(cell));

const doomedOf = (
  tiles: Tile[][],
  kept: Set<string>,
  parted: Parting,
  pair: Pair,
): Cell | null =>
  match({
    left: isStandingSpike(tiles, parted, pair.left),
    right: isStandingSpike(tiles, parted, pair.right),
    leapable: isLeapable(tiles, pair.row, pair.column),
  })
    .with({ left: false }, () => null)
    .with({ right: false }, () => null)
    .with({ leapable: true }, () => null)
    .otherwise(() => doomedOfPair(pair.left, pair.right, kept));

const partCappedPairs = (tiles: Tile[][], spared: Cell[]): Tile[][] =>
  chain(new Set(map(spared, keyOf)))
    .thru((kept) =>
      reduce(
        cappedPairs(tiles),
        (parted: Parting, pair): Parting =>
          match(doomedOf(tiles, kept, parted, pair))
            .with(nullish, () => parted)
            .otherwise((doomed) => ({
              keys: new Set([...parted.keys, keyOf(doomed)]),
              cells: [...parted.cells, doomed],
            })),
        { keys: new Set<string>(), cells: [] },
      ),
    )
    .thru(({ cells }) => patchTiles(tiles, map(cells, toAir)))
    .value();

const clearAround = (
  tiles: Tile[][],
  keepClearOf: Tile[],
  clearance: number,
): Tile[][] =>
  chain(cellsWhere(tiles, (tile) => includes(keepClearOf, tile)))
    .flatMap(({ row, column }) =>
      flatMap(range(row - clearance, row + clearance + 1), (near) =>
        map(
          range(column - clearance, column + clearance + 1),
          (beside): Cell => ({ row: near, column: beside }),
        ),
      ),
    )
    .filter(
      ({ row, column }) =>
        isInside(tiles, row, column) && isSpike(tiles[row][column]),
    )
    .map(toAir)
    .thru((patches) => patchTiles(tiles, patches))
    .value();

const laySpikes = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
  levelNumber: number,
): Tile[][] =>
  flow(
    sowSpikes,
    dropCrampedSpikes,
    dropEdgeSpikes,
    thinRuns,
    (laid: Tile[][]) => clearAround(laid, [TILE_ENEMY], ENEMY_CLEARANCE),
    (laid: Tile[][]) =>
      clearAround(laid, [TILE_SPAWN, TILE_PORTAL], MARKER_CLEARANCE),
    (laid: Tile[][]) => thinToDensity(laid, random, densityFor(levelNumber)),
  )(withoutFloorSpikes(tiles));

export const addSpikes = (tiles: Tile[][], levelNumber: number): Tile[][] =>
  match(levelNumber)
    .with(number.lte(BARE_LEVEL), () => withoutSpikes(tiles))
    .otherwise(() =>
      chain(createRandom(seedOf(tiles, levelNumber)))
        .thru((random) => ({
          original: floorSpikeCells(tiles),
          sown: laySpikes(tiles, random, levelNumber),
        }))
        .thru(({ original, sown }) =>
          partCappedPairs(stampSpikes(sown, original), original),
        )
        .value(),
    );
