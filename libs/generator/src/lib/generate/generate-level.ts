import { clamp, filter, floor, map, some } from 'lodash-es';

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
import { BLOCK, ENEMY, type StructureDifficulty } from '../structures/types';
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

interface Terrain {
  ground: number[];
  platforms: Platform[];
  enemies: Point[];
}

interface KeyPlacement {
  keyColumn: number;
  keySupportTop: number;
}

const placeStructureCell = (
  terrain: Terrain,
  cell: number,
  column: number,
  absoluteRow: number,
  groundSurfaceRow: number,
  columnGround: number,
): void => {
  if (cell === BLOCK) {
    if (absoluteRow < groundSurfaceRow) {
      terrain.platforms.push({
        column,
        row: absoluteRow,
        isOverHole: columnGround === 0,
      });
    }
  } else if (cell === ENEMY) {
    terrain.enemies.push({
      x: column * TILE_SIZE,
      y: absoluteRow * TILE_SIZE,
    });
  }
};

const fillSector = (
  terrain: Terrain,
  grid: number[][],
  cursor: number,
  baseline: number,
): void => {
  const rowCount = grid.length;
  const baselineRow = LEVEL_HEIGHT - baseline;
  for (let column = 0; column < SECTOR_WIDTH; column++) {
    const stacked = groundHeight(grid, column);
    terrain.ground[cursor + column] =
      stacked === 0 ? 0 : baseline + stacked - 1;
    const groundSurfaceRow = LEVEL_HEIGHT - terrain.ground[cursor + column];

    for (let row = 0; row < rowCount; row++) {
      const absoluteRow = baselineRow - (rowCount - 1 - row);
      placeStructureCell(
        terrain,
        grid[row][column],
        cursor + column,
        absoluteRow,
        groundSurfaceRow,
        terrain.ground[cursor + column],
      );
    }
  }
};

const buildTerrain = (
  rng: Rng,
  structureDifficulty: StructureDifficulty,
  width: number,
): Terrain => {
  const terrain: Terrain = {
    ground: Array.from({ length: width }, (): number => BASE_GROUND),
    platforms: [],
    enemies: [],
  };

  let baseline = BASE_GROUND;
  let cursor = INTRO_WIDTH;
  for (let sectorIndex = 0; sectorIndex < SECTOR_COUNT; sectorIndex++) {
    const grid = rollStructure(rng, structureDifficulty);
    fillSector(terrain, grid, cursor, baseline);
    baseline = terrain.ground[cursor + SECTOR_WIDTH - 1] || baseline;
    cursor += SECTOR_WIDTH;
  }

  for (let column = cursor; column < width; column++) {
    terrain.ground[column] = baseline;
  }
  return terrain;
};

const paintTiles = (
  ground: number[],
  platforms: Platform[],
  width: number,
): Tile[][] => {
  const tiles: Tile[][] = [];
  for (let row = 0; row < LEVEL_HEIGHT; row++) {
    tiles.push(Array.from({ length: width }, (): Tile => TILE_EMPTY));
  }
  for (let column = 0; column < width; column++) {
    for (let row = LEVEL_HEIGHT - ground[column]; row < LEVEL_HEIGHT; row++) {
      tiles[row][column] = TILE_SOLID;
    }
  }
  for (const platform of platforms) {
    if (platform.row >= 1 && platform.column > 0 && platform.column < width - 1) {
      tiles[platform.row][platform.column] = TILE_SOLID;
    }
  }
  for (let row = 0; row < LEVEL_HEIGHT; row++) {
    tiles[row][0] = TILE_SOLID;
    tiles[row][width - 1] = TILE_SOLID;
  }
  return tiles;
};

const placeKey = (
  rng: Rng,
  platforms: Platform[],
  ground: number[],
  width: number,
  groundTop: (column: number) => number,
): KeyPlacement => {
  const keyZoneStart = Math.max(INTRO_WIDTH, floor(width * 0.25));
  const keyZoneEnd = width - OUTRO_WIDTH;
  const keyPerches = filter(
    platforms,
    (platform) =>
      !platform.isOverHole &&
      platform.column >= keyZoneStart &&
      platform.column < keyZoneEnd,
  );
  if (keyPerches.length > 0 && rng.chance(0.65)) {
    const perch = rng.pick(keyPerches);
    return { keyColumn: perch.column, keySupportTop: perch.row * TILE_SIZE };
  }

  const groundColumns: number[] = [];
  for (let column = keyZoneStart; column < keyZoneEnd; column++) {
    if (ground[column] !== 0) groundColumns.push(column);
  }
  const keyColumn =
    groundColumns.length > 0 ? rng.pick(groundColumns) : INTRO_WIDTH;
  return { keyColumn, keySupportTop: groundTop(keyColumn) };
};

const hasSpikeClearance = (
  tiles: Tile[][],
  column: number,
  spikeRow: number,
): boolean => {
  for (let row = spikeRow; row >= spikeRow - SPIKE_CLEARANCE; row--) {
    if (row < 0 || tiles[row][column] !== TILE_EMPTY) return false;
  }
  return true;
};

const canPlaceSpike = (
  ground: number[],
  enemyColumns: number[],
  keyColumn: number,
  lastSpikeColumn: number,
  column: number,
): boolean => {
  const columnHeight = ground[column];
  if (
    columnHeight <= 0 ||
    ground[column - 1] < columnHeight ||
    ground[column + 1] < columnHeight
  ) {
    return false;
  }
  if (column - lastSpikeColumn <= SPIKE_MIN_GAP) return false;
  if (Math.abs(column - keyColumn) < 2) return false;
  return !some(
    enemyColumns,
    (enemyColumn) => Math.abs(enemyColumn - column) < SPIKE_MIN_ENEMY_DISTANCE,
  );
};

const placeSpikes = (
  rng: Rng,
  tiles: Tile[][],
  terrain: Terrain,
  keyColumn: number,
  structureDifficulty: StructureDifficulty,
  width: number,
): void => {
  const { ground, enemies } = terrain;
  const enemyColumns = map(enemies, (enemy) => floor(enemy.x / TILE_SIZE));
  const spikeChance =
    SPIKE_SPAWN_CHANCE *
    (structureDifficulty === 'HARD' ? HARD_SPIKE_CHANCE_MULTIPLIER : 1);
  let lastSpikeColumn = -SPIKE_MIN_GAP;
  for (let column = INTRO_WIDTH; column < width - OUTRO_WIDTH; column++) {
    const spikeRow = LEVEL_HEIGHT - ground[column] - 1;
    if (
      canPlaceSpike(ground, enemyColumns, keyColumn, lastSpikeColumn, column) &&
      hasSpikeClearance(tiles, column, spikeRow) &&
      rng.chance(spikeChance)
    ) {
      tiles[spikeRow][column] = TILE_SPIKE;
      lastSpikeColumn = column;
    }
  }
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

export const generateLevel = (
  seed: string,
  difficulty = 0,
  paletteSeed = seed,
): Level => {
  const rng = createRng(seed);
  const difficultyIndex = clamp(floor(difficulty), 0, LEVELS_PER_SEED - 1);
  const structureDifficulty: StructureDifficulty =
    difficultyIndex <= 3 ? 'NORMAL' : 'HARD';
  const width = LEVEL_WIDTH;

  const terrain = buildTerrain(rng, structureDifficulty, width);
  const tiles = paintTiles(terrain.ground, terrain.platforms, width);

  const groundTop = (column: number): number =>
    (LEVEL_HEIGHT - terrain.ground[column]) * TILE_SIZE;

  const placement = placeKey(rng, terrain.platforms, terrain.ground, width, groundTop);
  placeSpikes(rng, tiles, terrain, placement.keyColumn, structureDifficulty, width);

  return {
    seed,
    width,
    height: LEVEL_HEIGHT,
    tiles,
    ...levelEntities(groundTop, placement, width),
    chestItems: rollChestItems(rng),
    enemies: terrain.enemies,
    palette: rollPalette(createRng(paletteSeed)),
  };
};
