import {
  clamp,
  filter,
  flatMap,
  floor,
  fromPairs,
  groupBy,
  map,
  range,
  reduce,
  some,
  times,
} from 'lodash-es';
import { chain } from '@mander/utils';
import { match, P } from 'ts-pattern';

import {
  BASE_GROUND,
  DOUBLE_SPIKE_CHANCE,
  INTRO_WIDTH,
  LEVEL_HEIGHT,
  LEVEL_WIDTH,
  LEVELS_PER_SEED,
  OUTRO_WIDTH,
  SECTOR_COUNT,
  SECTOR_WIDTH,
  SPIKE_CLEARANCE,
  SPIKE_MAX_RUN,
  SPIKE_MIN_ENEMY_DISTANCE,
  SPIKE_MIN_GAP,
} from '../consts';
import { rollChestItems } from '../items';
import { rollPalette } from '../palette';
import { createRng, type Rng } from '../rng';
import { groundHeight } from '../structures/grid';
import { rollStructure } from '../structures/structures';
import {
  BLOCK,
  ENEMY,
  SPIKE,
  SPIKE_CEILING,
  type Structure,
  type StructureDifficulty,
} from '../structures/types';
import {
  type Level,
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_CHEST,
  TILE_EMPTY,
  TILE_ENEMY,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SOLID,
  TILE_SPIKE,
  TILE_SPAWN,
  TILE_SPIKE_CEILING,
  TILE_STONE,
  TILE_WOOD,
  type TilePosition,
} from '@mander/engine';
import type { Platform } from './platform';

const { nullish } = P;

interface Spike {
  row: number;
  column: number;
  tile: Tile;
}

interface Terrain {
  ground: number[];
  platforms: Platform[];
  enemies: TilePosition[];
  spikes: Spike[];
}

interface KeyPlacement {
  keyColumn: number;
  keySupportTop: number;
}

type PlacedCell =
  | { kind: 'PLATFORM'; platform: Platform }
  | { kind: 'ENEMY'; enemy: TilePosition }
  | { kind: 'SPIKE'; spike: Spike }
  | { kind: 'NONE' };

const spikeCell = (
  column: number,
  absoluteRow: number,
  tile: Tile,
): PlacedCell => ({
  kind: 'SPIKE',
  spike: { row: absoluteRow, column, tile },
});

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
        enemy: { x: column, y: absoluteRow },
      }),
    )
    .with(SPIKE, (): PlacedCell => spikeCell(column, absoluteRow, TILE_SPIKE))
    .with(
      SPIKE_CEILING,
      (): PlacedCell => spikeCell(column, absoluteRow, TILE_SPIKE_CEILING),
    )
    .otherwise((): PlacedCell => ({ kind: 'NONE' }));

interface ColumnResult {
  ground: number;
  platforms: Platform[];
  enemies: TilePosition[];
  spikes: Spike[];
}

const columnGround = (
  grid: Structure,
  column: number,
  baseline: number,
): number =>
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
    spikes: chain(cells)
      .filter(
        (cell): cell is Extract<PlacedCell, { kind: 'SPIKE' }> =>
          cell.kind === 'SPIKE',
      )
      .map((cell) => cell.spike)
      .value(),
  };
};

interface SectorResult {
  ground: number[];
  platforms: Platform[];
  enemies: TilePosition[];
  spikes: Spike[];
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
    spikes: flatMap(columns, (column) => column.spikes),
  };
};

interface SectorAccumulator {
  ground: number[];
  platforms: Platform[];
  enemies: TilePosition[];
  spikes: Spike[];
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
        spikes: [...acc.spikes, ...sector.spikes],
        baseline: sector.ground.at(-1) || acc.baseline,
        cursor: acc.cursor + SECTOR_WIDTH,
      };
    },
    {
      ground: [],
      platforms: [],
      enemies: [],
      spikes: [],
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
    spikes: sectors.spikes,
  };
};

const isWallColumn = (column: number, width: number): boolean =>
  column === 0 || column === width - 1;

const MATERIALS: Tile[] = [
  TILE_SOLID,
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
];

const materialColumns = (rng: Rng, width: number): Tile[] => {
  const intro = rng.pick(MATERIALS);
  const sectors = map(range(SECTOR_COUNT), () => rng.pick(MATERIALS));
  const outro = rng.pick(MATERIALS);
  return [
    ...times(INTRO_WIDTH, () => intro),
    ...flatMap(sectors, (material) => times(SECTOR_WIDTH, () => material)),
    ...times(width - INTRO_WIDTH - SECTOR_COUNT * SECTOR_WIDTH, () => outro),
  ];
};

const tileAt = (
  row: number,
  column: number,
  ground: number[],
  platformCells: ReadonlySet<string>,
  width: number,
  materials: Tile[],
): Tile =>
  match(true)
    .with(
      P.when(() => isWallColumn(column, width)),
      (): Tile => materials[column],
    )
    .with(
      P.when(() => row >= LEVEL_HEIGHT - ground[column]),
      (): Tile => materials[column],
    )
    .with(
      P.when(() => platformCells.has(`${row}:${column}`)),
      (): Tile => materials[column],
    )
    .otherwise((): Tile => TILE_EMPTY);

const paintTiles = (
  ground: number[],
  platforms: Platform[],
  width: number,
  materials: Tile[],
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
    map(range(width), (column) =>
      tileAt(row, column, ground, platformCells, width, materials),
    ),
  );
};

const keyZoneStart = (width: number): number =>
  Math.max(INTRO_WIDTH, floor(width * 0.25));

const keyZoneEnd = (width: number): number => width - OUTRO_WIDTH;

const keyPerches = (
  platforms: Platform[],
  start: number,
  end: number,
): Platform[] =>
  filter(
    platforms,
    (platform) =>
      !platform.isOverHole && platform.column >= start && platform.column < end,
  );

const keyGroundColumns = (
  ground: number[],
  start: number,
  end: number,
): number[] => filter(range(start, end), (column) => ground[column] !== 0);

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

const isHole = (ground: number[], column: number): boolean =>
  ground[column] === 0;

const isSpikeSpot = (
  tiles: Tile[][],
  ground: number[],
  enemyColumns: number[],
  keyColumn: number,
  column: number,
): boolean =>
  ground[column] > 0 &&
  !isHole(ground, column - 1) &&
  !isHole(ground, column + 1) &&
  Math.abs(column - keyColumn) >= 2 &&
  !some(
    enemyColumns,
    (enemyColumn) => Math.abs(enemyColumn - column) < SPIKE_MIN_ENEMY_DISTANCE,
  ) &&
  hasSpikeClearance(tiles, column, LEVEL_HEIGHT - ground[column] - 1);

interface SpikeScan {
  spikes: Spike[];
  runLength: number;
  wantsPair: boolean;
  gap: number;
}

const floorSpike = (ground: number[], column: number): Spike => ({
  row: LEVEL_HEIGHT - ground[column] - 1,
  column,
  tile: TILE_SPIKE,
});

const extendRun = (state: SpikeScan, spike: Spike): SpikeScan => ({
  spikes: [...state.spikes, spike],
  runLength: 0,
  wantsPair: false,
  gap: 0,
});

const startRun = (state: SpikeScan, spike: Spike, rng: Rng): SpikeScan => ({
  spikes: [...state.spikes, spike],
  runLength: 1,
  wantsPair: rng.chance(DOUBLE_SPIKE_CHANCE),
  gap: 0,
});

const skipColumn = (state: SpikeScan): SpikeScan => ({
  ...state,
  runLength: 0,
  wantsPair: false,
  gap: state.gap + 1,
});

const scanColumn = (
  rng: Rng,
  ground: number[],
  eligible: boolean,
  column: number,
  state: SpikeScan,
): SpikeScan =>
  match({
    extending:
      state.runLength > 0 &&
      state.runLength < SPIKE_MAX_RUN &&
      state.wantsPair &&
      eligible,
    starting: eligible && state.gap >= SPIKE_MIN_GAP,
  })
    .with({ extending: true }, () =>
      extendRun(state, floorSpike(ground, column)),
    )
    .with({ starting: true }, () =>
      startRun(state, floorSpike(ground, column), rng),
    )
    .otherwise(() => skipColumn(state));

const placeSpikes = (
  tiles: Tile[][],
  terrain: Terrain,
  keyColumn: number,
  width: number,
  rng: Rng,
): Spike[] => {
  const { ground, enemies } = terrain;
  const enemyColumns = map(enemies, (enemy) => enemy.x);
  return reduce(
    range(INTRO_WIDTH, width - OUTRO_WIDTH),
    (state: SpikeScan, column): SpikeScan =>
      scanColumn(
        rng,
        ground,
        isSpikeSpot(tiles, ground, enemyColumns, keyColumn, column),
        column,
        state,
      ),
    { spikes: [], runLength: 0, wantsPair: false, gap: SPIKE_MIN_GAP },
  ).spikes;
};

const thinForDifficulty = (
  spikes: Spike[],
  structureDifficulty: StructureDifficulty,
  rng: Rng,
): Spike[] =>
  match(structureDifficulty)
    .with('HARD', () => spikes)
    .with('NORMAL', () =>
      chain(spikes)
        .map((spike) => ({ spike, order: rng.next() }))
        .sortBy('order')
        .take(spikes.length - floor(spikes.length / 2))
        .map('spike')
        .value(),
    )
    .exhaustive();

const stampSpikes = (tiles: Tile[][], spikes: Spike[]): Tile[][] => {
  const byRow = groupBy(spikes, 'row');
  return map(tiles, (rowTiles, rowIndex) =>
    match(byRow[rowIndex])
      .with(nullish, () => rowTiles)
      .otherwise((rowSpikes) =>
        map(rowTiles, (tile, columnIndex) =>
          match(rowSpikes.find((spike) => spike.column === columnIndex))
            .with(nullish, (): Tile => tile)
            .otherwise((spike): Tile => spike.tile),
        ),
      ),
  );
};

interface EntityTiles {
  spawn: TilePosition;
  chest: TilePosition;
  portal: TilePosition;
  key: TilePosition;
}

const entityTiles = (
  groundTop: (column: number) => number,
  placement: KeyPlacement,
  width: number,
): EntityTiles => {
  const chestColumn = width - 9;
  const portalColumn = width - 4;
  return {
    spawn: { x: 2, y: groundTop(2) / TILE_SIZE - 1 },
    chest: { x: chestColumn, y: groundTop(chestColumn) / TILE_SIZE - 1 },
    portal: { x: portalColumn, y: groundTop(portalColumn) / TILE_SIZE - 1 },
    key: { x: placement.keyColumn, y: placement.keySupportTop / TILE_SIZE - 1 },
  };
};

const stampEntities = (
  tiles: Tile[][],
  entities: EntityTiles,
  enemies: TilePosition[],
): Tile[][] => {
  const stamped: Record<string, Tile> = {
    ...fromPairs(
      map(enemies, (enemy) => [`${enemy.y}:${enemy.x}`, TILE_ENEMY]),
    ),
    [`${entities.chest.y}:${entities.chest.x}`]: TILE_CHEST,
    [`${entities.key.y}:${entities.key.x}`]: TILE_KEY,
    [`${entities.portal.y}:${entities.portal.x}`]: TILE_PORTAL,
    [`${entities.portal.y - 1}:${entities.portal.x}`]: TILE_PORTAL,
    [`${entities.spawn.y}:${entities.spawn.x}`]: TILE_SPAWN,
    [`${entities.spawn.y - 1}:${entities.spawn.x}`]: TILE_SPAWN,
  };

  return map(tiles, (rowTiles, row) =>
    map(rowTiles, (tile, column) =>
      match({ entityTile: stamped[`${row}:${column}`], tile })
        .with({ entityTile: nullish }, (): Tile => tile)
        .with({ tile: TILE_EMPTY }, ({ entityTile }): Tile => entityTile)
        .otherwise((): Tile => tile),
    ),
  );
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
  const materials = materialColumns(createRng(`${seed}-materials`), width);
  const baseTiles = paintTiles(
    terrain.ground,
    terrain.platforms,
    width,
    materials,
  );

  const groundTop = (column: number): number =>
    (LEVEL_HEIGHT - terrain.ground[column]) * TILE_SIZE;

  const placement = placeKey(
    rng,
    terrain.platforms,
    terrain.ground,
    width,
    groundTop,
  );
  const autoSpikes = thinForDifficulty(
    placeSpikes(baseTiles, terrain, placement.keyColumn, width, rng),
    structureDifficulty,
    rng,
  );

  const entities = entityTiles(groundTop, placement, width);

  return {
    seed,
    width,
    height: LEVEL_HEIGHT,
    tiles: stampEntities(
      stampSpikes(baseTiles, [...terrain.spikes, ...autoSpikes]),
      entities,
      terrain.enemies,
    ),
    chestItems: rollChestItems(rng),
    enemies: terrain.enemies,
    palette: rollPalette(createRng(paletteSeed)),
  };
};
