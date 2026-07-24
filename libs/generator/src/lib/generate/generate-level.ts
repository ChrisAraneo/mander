import {
  chain,
  clamp,
  filter,
  flatMap,
  floor,
  groupBy,
  map,
  range,
  reduce,
  some,
  times,
} from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  BASE_GROUND,
  HARD_SPIKE_CHANCE_MULTIPLIER,
  INTRO_WIDTH,
  LEVEL_HEIGHT,
  LEVEL_WIDTH,
  LEVELS_PER_SEED,
  OUTRO_WIDTH,
  PLAYER_HEIGHT_TILES,
  SECTOR_COUNT,
  SECTOR_WIDTH,
  SPIKE_CLEARANCE,
  SPIKE_MIN_ENEMY_DISTANCE,
  SPIKE_MIN_GAP,
  SPIKE_SPAWN_CHANCE,
} from '../consts';
import { rollChestItems } from '../items';
import { rollPalette } from '../palette';
import { createRng, type Rng } from '../rng';
import { groundHeight } from '../structures/grid';
import { rollStructure } from '../structures/structures';
import { BLOCK, ENEMY, type Structure, type StructureDifficulty } from '../structures/types';
import {
  type Level,
  type Point,
  type Tile,
  TILE_EMPTY,
  TILE_SIZE,
  TILE_SOLID,
  TILE_SPIKE,
} from '../types';
import type { Platform } from './platform';

const { nullish } = P;

interface Terrain {
  ground: number[];
  platforms: Platform[];
  enemies: Point[];
}

interface KeyPlacement {
  keyColumn: number;
  keySupportTop: number;
}

interface Spike {
  row: number;
  column: number;
}

type PlacedCell =
  | { kind: 'PLATFORM'; platform: Platform }
  | { kind: 'ENEMY'; enemy: Point }
  | { kind: 'NONE' };

const placedCell = (
  cell: number,
  column: number,
  absoluteRow: number,
  groundSurfaceRow: number,
  columnGround: number,
): PlacedCell =>
  match(cell)
    .with(
      BLOCK,
      (): PlacedCell =>
        match(absoluteRow < groundSurfaceRow)
          .with(
            true,
            (): PlacedCell => ({
              kind: 'PLATFORM',
              platform: {
                column,
                row: absoluteRow,
                isOverHole: columnGround === 0,
              },
            }),
          )
          .otherwise((): PlacedCell => ({ kind: 'NONE' })),
    )
    .with(
      ENEMY,
      (): PlacedCell => ({
        kind: 'ENEMY',
        enemy: { x: column * TILE_SIZE, y: absoluteRow * TILE_SIZE },
      }),
    )
    .otherwise((): PlacedCell => ({ kind: 'NONE' }));

interface ColumnResult {
  ground: number;
  platforms: Platform[];
  enemies: Point[];
}

const columnGround = (grid: Structure, column: number, baseline: number): number =>
  match(groundHeight(grid, column))
    .with(0, () => 0)
    .otherwise((stacked) => baseline + stacked - 1);

const columnCells = (
  grid: Structure,
  column: number,
  cursorColumn: number,
  baseline: number,
  ground: number,
): PlacedCell[] => {
  const groundSurfaceRow = LEVEL_HEIGHT - ground;
  const baselineRow = LEVEL_HEIGHT - baseline;
  const rowCount = grid.length;
  return map(range(rowCount), (row) =>
    placedCell(
      grid[row][column],
      cursorColumn,
      baselineRow - (rowCount - 1 - row),
      groundSurfaceRow,
      ground,
    ),
  );
};

const sectorColumn = (
  grid: Structure,
  column: number,
  cursorColumn: number,
  baseline: number,
): ColumnResult => {
  const ground = columnGround(grid, column, baseline);
  const cells = columnCells(grid, column, cursorColumn, baseline, ground);
  return {
    ground,
    platforms: chain(cells)
      .filter(
        (cell): cell is Extract<PlacedCell, { kind: 'PLATFORM' }> =>
          cell.kind === 'PLATFORM',
      )
      .map((cell) => cell.platform)
      .value(),
    enemies: chain(cells)
      .filter(
        (cell): cell is Extract<PlacedCell, { kind: 'ENEMY' }> =>
          cell.kind === 'ENEMY',
      )
      .map((cell) => cell.enemy)
      .value(),
  };
};

interface SectorResult {
  ground: number[];
  platforms: Platform[];
  enemies: Point[];
}

const sectorResult = (
  grid: Structure,
  cursor: number,
  baseline: number,
): SectorResult => {
  const columns = map(range(SECTOR_WIDTH), (column) =>
    sectorColumn(grid, column, cursor + column, baseline),
  );
  return {
    ground: map(columns, (column) => column.ground),
    platforms: flatMap(columns, (column) => column.platforms),
    enemies: flatMap(columns, (column) => column.enemies),
  };
};

interface SectorAccumulator {
  ground: number[];
  platforms: Platform[];
  enemies: Point[];
  baseline: number;
  cursor: number;
}

const buildSectors = (
  rng: Rng,
  structureDifficulty: StructureDifficulty,
): SectorAccumulator =>
  reduce(
    range(SECTOR_COUNT),
    (acc: SectorAccumulator): SectorAccumulator => {
      const grid = rollStructure(rng, structureDifficulty);
      const sector = sectorResult(grid, acc.cursor, acc.baseline);
      return {
        ground: [...acc.ground, ...sector.ground],
        platforms: [...acc.platforms, ...sector.platforms],
        enemies: [...acc.enemies, ...sector.enemies],
        baseline: sector.ground.at(-1) || acc.baseline,
        cursor: acc.cursor + SECTOR_WIDTH,
      };
    },
    {
      ground: [],
      platforms: [],
      enemies: [],
      baseline: BASE_GROUND,
      cursor: INTRO_WIDTH,
    },
  );

const buildTerrain = (
  rng: Rng,
  structureDifficulty: StructureDifficulty,
  width: number,
): Terrain => {
  const sectors = buildSectors(rng, structureDifficulty);
  return {
    ground: [
      ...times(INTRO_WIDTH, () => BASE_GROUND),
      ...sectors.ground,
      ...times(width - sectors.cursor, () => sectors.baseline),
    ],
    platforms: sectors.platforms,
    enemies: sectors.enemies,
  };
};

const isWallColumn = (column: number, width: number): boolean =>
  column === 0 || column === width - 1;

const tileAt = (
  row: number,
  column: number,
  ground: number[],
  platformCells: ReadonlySet<string>,
  width: number,
): Tile =>
  match(true)
    .with(P.when(() => isWallColumn(column, width)), (): Tile => TILE_SOLID)
    .with(P.when(() => row >= LEVEL_HEIGHT - ground[column]), (): Tile => TILE_SOLID)
    .with(P.when(() => platformCells.has(`${row}:${column}`)), (): Tile => TILE_SOLID)
    .otherwise((): Tile => TILE_EMPTY);

const paintTiles = (
  ground: number[],
  platforms: Platform[],
  width: number,
): Tile[][] => {
  const platformCells = new Set(
    chain(platforms)
      .filter(
        (platform) =>
          platform.row >= 1 &&
          platform.column > 0 &&
          platform.column < width - 1,
      )
      .map((platform) => `${platform.row}:${platform.column}`)
      .value(),
  );
  return map(range(LEVEL_HEIGHT), (row) =>
    map(range(width), (column) => tileAt(row, column, ground, platformCells, width)),
  );
};

const keyZoneStart = (width: number): number =>
  Math.max(INTRO_WIDTH, floor(width * 0.25));

const keyZoneEnd = (width: number): number => width - OUTRO_WIDTH;

const keyPerches = (platforms: Platform[], start: number, end: number): Platform[] =>
  filter(
    platforms,
    (platform) =>
      !platform.isOverHole && platform.column >= start && platform.column < end,
  );

const keyGroundColumns = (ground: number[], start: number, end: number): number[] =>
  filter(range(start, end), (column) => ground[column] !== 0);

const placeKey = (
  rng: Rng,
  platforms: Platform[],
  ground: number[],
  width: number,
  groundTop: (column: number) => number,
): KeyPlacement => {
  const start = keyZoneStart(width);
  const end = keyZoneEnd(width);
  const perches = keyPerches(platforms, start, end);
  return match(perches.length > 0 && rng.chance(0.65))
    .with(true, (): KeyPlacement => {
      const perch = rng.pick(perches);
      return { keyColumn: perch.column, keySupportTop: perch.row * TILE_SIZE };
    })
    .otherwise((): KeyPlacement => {
      const groundColumns = keyGroundColumns(ground, start, end);
      const keyColumn = match(groundColumns.length > 0)
        .with(true, () => rng.pick(groundColumns))
        .otherwise(() => INTRO_WIDTH);
      return { keyColumn, keySupportTop: groundTop(keyColumn) };
    });
};

const hasSpikeClearance = (
  tiles: Tile[][],
  column: number,
  spikeRow: number,
): boolean =>
  filter(
    range(spikeRow - SPIKE_CLEARANCE, spikeRow + 1),
    (row) => !(row >= 0 && tiles[row][column] === TILE_EMPTY),
  ).length === 0;

const canPlaceSpike = (
  ground: number[],
  enemyColumns: number[],
  keyColumn: number,
  lastSpikeColumn: number,
  column: number,
): boolean => {
  const columnHeight = ground[column];
  return (
    columnHeight > 0 &&
    ground[column - 1] >= columnHeight &&
    ground[column + 1] >= columnHeight &&
    column - lastSpikeColumn > SPIKE_MIN_GAP &&
    Math.abs(column - keyColumn) >= 2 &&
    !some(
      enemyColumns,
      (enemyColumn) => Math.abs(enemyColumn - column) < SPIKE_MIN_ENEMY_DISTANCE,
    )
  );
};

interface SpikeAccumulator {
  spikes: Spike[];
  lastSpikeColumn: number;
}

const spikeChanceFor = (structureDifficulty: StructureDifficulty): number =>
  SPIKE_SPAWN_CHANCE *
  match(structureDifficulty)
    .with('HARD', () => HARD_SPIKE_CHANCE_MULTIPLIER)
    .with('NORMAL', () => 1)
    .exhaustive();

const placeSpikes = (
  rng: Rng,
  tiles: Tile[][],
  terrain: Terrain,
  keyColumn: number,
  structureDifficulty: StructureDifficulty,
  width: number,
): Spike[] => {
  const { ground, enemies } = terrain;
  const enemyColumns = map(enemies, (enemy) => floor(enemy.x / TILE_SIZE));
  const spikeChance = spikeChanceFor(structureDifficulty);
  return reduce(
    range(INTRO_WIDTH, width - OUTRO_WIDTH),
    (acc: SpikeAccumulator, column): SpikeAccumulator => {
      const spikeRow = LEVEL_HEIGHT - ground[column] - 1;
      const placed =
        canPlaceSpike(ground, enemyColumns, keyColumn, acc.lastSpikeColumn, column) &&
        hasSpikeClearance(tiles, column, spikeRow) &&
        rng.chance(spikeChance);
      return match(placed)
        .with(
          true,
          (): SpikeAccumulator => ({
            spikes: [...acc.spikes, { row: spikeRow, column }],
            lastSpikeColumn: column,
          }),
        )
        .otherwise((): SpikeAccumulator => acc);
    },
    { spikes: [], lastSpikeColumn: -SPIKE_MIN_GAP },
  ).spikes;
};

const stampSpikes = (tiles: Tile[][], spikes: Spike[]): Tile[][] => {
  const byRow = groupBy(spikes, 'row');
  return map(tiles, (rowTiles, rowIndex) =>
    match(byRow[rowIndex])
      .with(nullish, () => rowTiles)
      .otherwise((rowSpikes) =>
        map(rowTiles, (tile, columnIndex) =>
          match(some(rowSpikes, (spike) => spike.column === columnIndex))
            .with(true, (): Tile => TILE_SPIKE)
            .otherwise((): Tile => tile),
        ),
      ),
  );
};

const levelEntities = (
  groundTop: (column: number) => number,
  placement: KeyPlacement,
  width: number,
): Pick<Level, 'spawn' | 'chest' | 'portal' | 'key'> => {
  const chestColumn = width - 9;
  const portalColumn = width - 4;
  return {
    spawn: {
      x: 2 * TILE_SIZE + 5,
      y: groundTop(2) - (PLAYER_HEIGHT_TILES + 1) * TILE_SIZE,
    },
    chest: {
      x: chestColumn * TILE_SIZE + 3,
      y: groundTop(chestColumn) - 22,
      width: 26,
      height: 22,
    },
    portal: {
      x: portalColumn * TILE_SIZE,
      y: groundTop(portalColumn) - 64,
      width: 40,
      height: 64,
    },
    key: {
      x: placement.keyColumn * TILE_SIZE + 7,
      y: placement.keySupportTop - 34,
      width: 18,
      height: 22,
    },
  };
};

const structureDifficultyFor = (difficulty: number): StructureDifficulty =>
  match(clamp(floor(difficulty), 0, LEVELS_PER_SEED - 1) <= 3)
    .with(true, (): StructureDifficulty => 'NORMAL')
    .otherwise((): StructureDifficulty => 'HARD');

export const generateLevel = (
  seed: string,
  difficulty = 0,
  paletteSeed = seed,
): Level => {
  const rng = createRng(seed);
  const structureDifficulty = structureDifficultyFor(difficulty);
  const width = LEVEL_WIDTH;

  const terrain = buildTerrain(rng, structureDifficulty, width);
  const baseTiles = paintTiles(terrain.ground, terrain.platforms, width);

  const groundTop = (column: number): number =>
    (LEVEL_HEIGHT - terrain.ground[column]) * TILE_SIZE;

  const placement = placeKey(rng, terrain.platforms, terrain.ground, width, groundTop);
  const spikes = placeSpikes(
    rng,
    baseTiles,
    terrain,
    placement.keyColumn,
    structureDifficulty,
    width,
  );

  return {
    seed,
    width,
    height: LEVEL_HEIGHT,
    tiles: stampSpikes(baseTiles, spikes),
    ...levelEntities(groundTop, placement, width),
    chestItems: rollChestItems(rng),
    enemies: terrain.enemies,
    palette: rollPalette(createRng(paletteSeed)),
  };
};
