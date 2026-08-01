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
  times,
} from 'lodash-es';
import { chain } from '@mander/utils';
import { match, P } from 'ts-pattern';

import {
  cellMaterial,
  ENEMY,
  groundHeight,
  isBlockCell,
  SECTOR_WIDTH,
  SPIKE,
  SPIKE_CEILING,
  type Structure,
  type StructureDifficulty,
} from '@mander/structures';

import {
  BASE_GROUND,
  INTRO_WIDTH,
  LEVEL_HEIGHT,
  LEVEL_WIDTH,
  LEVELS_PER_SEED,
  OUTRO_WIDTH,
  SECTOR_COUNT,
} from '../consts';
import { rollChestItems } from '../items';
import { rollPalette } from '../palette';
import { createRng, type Rng } from '../rng';
import { rollStructure } from './roll-structure';
import {
  isSpikeTile,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPIKE,
  TILE_SPAWN,
  TILE_SPIKE_CEILING,
} from '@mander/engine';
import type { Point } from '@mander/utils';

import type { Platform } from './platform';
import type { Spike } from './spike';
import { growSpikes, thinSpikes } from './spikes';

const { nullish } = P;

interface Terrain {
  ground: number[];
  materials: Tile[];
  platforms: Platform[];
  enemies: Point[];
  spikes: Spike[];
}

interface KeyPlacement {
  keyColumn: number;
  keySupportTop: number;
}

type PlacedCell =
  | { kind: 'PLATFORM'; platform: Platform }
  | { kind: 'ENEMY'; enemy: Point }
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
    .with(P.when(isBlockCell), (block): PlacedCell =>
      match(absoluteRow < groundSurfaceRow)
        .with(true, (): PlacedCell => ({
          kind: 'PLATFORM',
          platform: {
            column,
            row: absoluteRow,
            isOverHole: columnGround === 0,
            material: cellMaterial(block),
          },
        }))
        .otherwise((): PlacedCell => ({ kind: 'NONE' })),
    )
    .with(ENEMY, (): PlacedCell => ({
      kind: 'ENEMY',
      enemy: { x: column, y: absoluteRow },
    }))
    .with(SPIKE, (): PlacedCell => spikeCell(column, absoluteRow, TILE_SPIKE))
    .with(SPIKE_CEILING, (): PlacedCell =>
      spikeCell(column, absoluteRow, TILE_SPIKE_CEILING),
    )
    .otherwise((): PlacedCell => ({ kind: 'NONE' }));

interface ColumnResult {
  ground: number;
  material: Tile;
  platforms: Platform[];
  enemies: Point[];
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

/** The material of the topmost stacked block — the surface the player sees. */
const columnMaterial = (grid: Structure, column: number): Tile =>
  match(groundHeight(grid, column))
    .with(0, (): Tile => TILE_DIRT)
    .otherwise((stacked): Tile =>
      cellMaterial(grid[grid.length - stacked][column]),
    );

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
    material: columnMaterial(grid, column),
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
  materials: Tile[];
  platforms: Platform[];
  enemies: Point[];
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
    materials: map(columns, (column) => column.material),
    platforms: flatMap(columns, (column) => column.platforms),
    enemies: flatMap(columns, (column) => column.enemies),
    spikes: flatMap(columns, (column) => column.spikes),
  };
};

interface SectorAccumulator {
  ground: number[];
  materials: Tile[];
  platforms: Platform[];
  enemies: Point[];
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
        materials: [...acc.materials, ...sector.materials],
        platforms: [...acc.platforms, ...sector.platforms],
        enemies: [...acc.enemies, ...sector.enemies],
        spikes: [...acc.spikes, ...sector.spikes],
        baseline: sector.ground.at(-1) || acc.baseline,
        cursor: acc.cursor + SECTOR_WIDTH,
      };
    },
    {
      ground: [],
      materials: [],
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
    materials: [
      ...times(INTRO_WIDTH, (): Tile => TILE_DIRT),
      ...sectors.materials,
      ...times(width - sectors.cursor, (): Tile => TILE_DIRT),
    ],
    platforms: sectors.platforms,
    enemies: sectors.enemies,
    spikes: sectors.spikes,
  };
};

const isWallColumn = (column: number, width: number): boolean =>
  column === 0 || column === width - 1;

const tileAt = (
  row: number,
  column: number,
  ground: number[],
  platformCells: ReadonlyMap<string, Tile>,
  width: number,
  materials: Tile[],
): Tile =>
  match(platformCells.get(`${row}:${column}`))
    .with(P.number, (material): Tile => material)
    .otherwise((): Tile =>
      match(true)
        .with(
          P.when(() => isWallColumn(column, width)),
          (): Tile => materials[column],
        )
        .with(
          P.when(() => row >= LEVEL_HEIGHT - ground[column]),
          (): Tile => materials[column],
        )
        .otherwise((): Tile => TILE_AIR),
    );

const paintTiles = (
  ground: number[],
  platforms: Platform[],
  width: number,
  materials: Tile[],
): Tile[][] => {
  const platformCells = new Map(
    chain(platforms)
      .filter(
        (platform) =>
          platform.row >= 1 &&
          platform.column > 0 &&
          platform.column < width - 1,
      )
      .map((platform): [string, Tile] => [
        `${platform.row}:${platform.column}`,
        platform.material,
      ])
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

/**
 * Entities are only stamped onto air, so a support whose cell is already taken
 * — by a structure spike, or by the next block of a stacked wall — would
 * swallow the key and leave the level unfinishable.
 */
const isFreeCell = (tiles: Tile[][], row: number, column: number): boolean =>
  tiles[row]?.[column] === TILE_AIR;

const keyPerches = (
  tiles: Tile[][],
  platforms: Platform[],
  start: number,
  end: number,
): Platform[] =>
  filter(
    platforms,
    (platform) =>
      !platform.isOverHole &&
      platform.column >= start &&
      platform.column < end &&
      isFreeCell(tiles, platform.row - 1, platform.column),
  );

const keyGroundColumns = (
  tiles: Tile[][],
  ground: number[],
  start: number,
  end: number,
): number[] =>
  filter(
    range(start, end),
    (column) =>
      ground[column] !== 0 &&
      isFreeCell(tiles, LEVEL_HEIGHT - ground[column] - 1, column),
  );

const placeKey = (
  rng: Rng,
  tiles: Tile[][],
  platforms: Platform[],
  ground: number[],
  width: number,
  groundTop: (column: number) => number,
): KeyPlacement => {
  const start = keyZoneStart(width);
  const end = keyZoneEnd(width);
  const perches = keyPerches(tiles, platforms, start, end);
  return match(perches.length > 0 && rng.chance(0.65))
    .with(true, (): KeyPlacement => {
      const perch = rng.pick(perches);
      return { keyColumn: perch.column, keySupportTop: perch.row * TILE_SIZE };
    })
    .otherwise((): KeyPlacement => {
      const groundColumns = keyGroundColumns(tiles, ground, start, end);
      const keyColumn = match(groundColumns.length > 0)
        .with(true, () => rng.pick(groundColumns))
        .otherwise(() => INTRO_WIDTH);
      return { keyColumn, keySupportTop: groundTop(keyColumn) };
    });
};

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
  spawn: Point;
  chest: Point;
  portal: Point;
  key: Point;
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

const entityCells = (
  entities: EntityTiles,
  enemies: Point[],
): Record<string, Tile> => ({
  ...fromPairs(map(enemies, (enemy) => [`${enemy.y}:${enemy.x}`, TILE_ENEMY])),
  [`${entities.chest.y}:${entities.chest.x}`]: TILE_CHEST,
  [`${entities.key.y}:${entities.key.x}`]: TILE_KEY,
  [`${entities.portal.y}:${entities.portal.x}`]: TILE_PORTAL,
  [`${entities.portal.y - 1}:${entities.portal.x}`]: TILE_PORTAL,
  [`${entities.spawn.y}:${entities.spawn.x}`]: TILE_SPAWN,
  [`${entities.spawn.y - 1}:${entities.spawn.x}`]: TILE_SPAWN,
});

/**
 * The sweep grows spikes on every block with room for one, the block the key
 * or the spawn needs included. Entities only stamp onto air, so those cells are
 * cleared first — a level whose key was swallowed can never be finished.
 */
const clearEntityCells = (
  tiles: Tile[][],
  cells: Record<string, Tile>,
): Tile[][] =>
  map(tiles, (rowTiles, row) =>
    map(rowTiles, (tile, column): Tile =>
      match({ needed: cells[`${row}:${column}`], tile })
        .with({ needed: nullish }, (): Tile => tile)
        .with({ tile: P.when(isSpikeTile) }, (): Tile => TILE_AIR)
        .otherwise((): Tile => tile),
    ),
  );

const stampEntities = (
  tiles: Tile[][],
  cells: Record<string, Tile>,
): Tile[][] =>
  map(tiles, (rowTiles, row) =>
    map(rowTiles, (tile, column) =>
      match({ entityTile: cells[`${row}:${column}`], tile })
        .with({ entityTile: nullish }, (): Tile => tile)
        .with({ tile: TILE_AIR }, ({ entityTile }): Tile => entityTile)
        .otherwise((): Tile => tile),
    ),
  );

const structureDifficultyFor = (levelIndex: number): StructureDifficulty =>
  match(levelIndex <= 3)
    .with(true, (): StructureDifficulty => 'NORMAL')
    .otherwise((): StructureDifficulty => 'HARD');

export const generateLevel = (
  seed: string,
  difficulty = 0,
  paletteSeed = seed,
): Level => {
  const rng = createRng(seed);
  const levelIndex = clamp(floor(difficulty), 0, LEVELS_PER_SEED - 1);
  const structureDifficulty = structureDifficultyFor(levelIndex);
  const width = LEVEL_WIDTH;

  const terrain = buildTerrain(rng, structureDifficulty, width);
  // The spikes the structures themselves carry go down first: both key
  // placement and the sweep that grows the rest have to see them.
  const baseTiles = stampSpikes(
    paintTiles(terrain.ground, terrain.platforms, width, terrain.materials),
    terrain.spikes,
  );

  const groundTop = (column: number): number =>
    (LEVEL_HEIGHT - terrain.ground[column]) * TILE_SIZE;

  // The key is placed on the bare terrain, before the spikes: every perch it
  // could choose is about to sprout one, and it should still be free to choose.
  const placement = placeKey(
    rng,
    baseTiles,
    terrain.platforms,
    terrain.ground,
    width,
    groundTop,
  );
  const cells = entityCells(
    entityTiles(groundTop, placement, width),
    terrain.enemies,
  );

  return {
    seed,
    width,
    height: LEVEL_HEIGHT,
    tiles: stampEntities(
      clearEntityCells(
        thinSpikes(rng, growSpikes(baseTiles), levelIndex),
        cells,
      ),
      cells,
    ),
    chestItems: rollChestItems(rng),
    enemies: terrain.enemies,
    palette: rollPalette(createRng(paletteSeed)),
  };
};
