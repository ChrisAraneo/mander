import { clamp, filter, floor, map, some } from 'lodash-es';
import {
  BASE_GROUND,
  INTRO_WIDTH,
  LEVELS_PER_SEED,
  LEVEL_HEIGHT,
  LEVEL_WIDTH,
  OUTRO_WIDTH,
  SECTOR_COUNT,
  SECTOR_WIDTH,
  HARD_SPIKE_CHANCE_MULTIPLIER,
  SPIKE_CLEARANCE,
  SPIKE_MIN_ENEMY_DISTANCE,
  SPIKE_MIN_GAP,
  SPIKE_SPAWN_CHANCE,
} from '../consts';
import { createRng } from '../rng';
import { rollChestItems } from '../items';
import { groundHeight } from '../structures/grid';
import { rollStructure } from '../structures/structures';
import { BLOCK, ENEMY, type StructureDifficulty } from '../structures/types';
import {
  TILE_EMPTY,
  TILE_SIZE,
  TILE_SOLID,
  TILE_SPIKE,
  type Level,
  type Point,
  type Tile,
} from '../types';
import type { Platform } from './platform';

export function generateLevel(seed: string, difficulty = 0): Level {
  const rng = createRng(seed);
  const difficultyIndex = clamp(floor(difficulty), 0, LEVELS_PER_SEED - 1);
  const structureDifficulty: StructureDifficulty = difficultyIndex <= 3 ? 'normal' : 'hard';
  const width = LEVEL_WIDTH;

  const ground: number[] = new Array(width).fill(BASE_GROUND);
  const platforms: Platform[] = [];
  const enemies: Point[] = [];

  let baseline = BASE_GROUND;
  let cursor = INTRO_WIDTH;
  for (let sectorIndex = 0; sectorIndex < SECTOR_COUNT; sectorIndex++) {
    const grid = rollStructure(rng, structureDifficulty);
    const rowCount = grid.length;
    const baselineRow = LEVEL_HEIGHT - baseline;

    for (let column = 0; column < SECTOR_WIDTH; column++) {
      const stacked = groundHeight(grid, column);
      ground[cursor + column] = stacked === 0 ? 0 : baseline + stacked - 1;
      const groundSurfaceRow = LEVEL_HEIGHT - ground[cursor + column];

      for (let row = 0; row < rowCount; row++) {
        const cell = grid[row][column];
        const absoluteRow = baselineRow - (rowCount - 1 - row);
        if (cell === BLOCK) {
          if (absoluteRow < groundSurfaceRow) {
            platforms.push({
              column: cursor + column,
              row: absoluteRow,
              overHole: ground[cursor + column] === 0,
            });
          }
        } else if (cell === ENEMY) {
          enemies.push({ x: (cursor + column) * TILE_SIZE, y: absoluteRow * TILE_SIZE });
        }
      }
    }

    baseline = ground[cursor + SECTOR_WIDTH - 1] || baseline;
    cursor += SECTOR_WIDTH;
  }

  for (let column = cursor; column < width; column++) ground[column] = baseline;

  const tiles: Tile[][] = [];
  for (let row = 0; row < LEVEL_HEIGHT; row++) {
    tiles.push(new Array(width).fill(TILE_EMPTY));
  }
  for (let column = 0; column < width; column++) {
    for (let row = LEVEL_HEIGHT - ground[column]; row < LEVEL_HEIGHT; row++) {
      tiles[row][column] = TILE_SOLID;
    }
  }
  for (const platform of platforms) {
    if (platform.row < 1) continue;
    if (platform.column > 0 && platform.column < width - 1) {
      tiles[platform.row][platform.column] = TILE_SOLID;
    }
  }
  for (let row = 0; row < LEVEL_HEIGHT; row++) {
    tiles[row][0] = TILE_SOLID;
    tiles[row][width - 1] = TILE_SOLID;
  }

  const groundTop = (column: number): number => (LEVEL_HEIGHT - ground[column]) * TILE_SIZE;

  const keyZoneStart = Math.max(INTRO_WIDTH, floor(width * 0.25));
  const keyZoneEnd = width - OUTRO_WIDTH;
  const keyPerches = filter(
    platforms,
    (platform) =>
      !platform.overHole && platform.column >= keyZoneStart && platform.column < keyZoneEnd
  );
  let keyColumn: number;
  let keySupportTop: number;
  if (keyPerches.length > 0 && rng.chance(0.65)) {
    const perch = rng.pick(keyPerches);
    keyColumn = perch.column;
    keySupportTop = perch.row * TILE_SIZE;
  } else {
    const groundColumns: number[] = [];
    for (let column = keyZoneStart; column < keyZoneEnd; column++) {
      if (ground[column] !== 0) groundColumns.push(column);
    }
    keyColumn = groundColumns.length > 0 ? rng.pick(groundColumns) : INTRO_WIDTH;
    keySupportTop = groundTop(keyColumn);
  }

  const enemyColumns = map(enemies, (enemy) => floor(enemy.x / TILE_SIZE));
  const spikeChance =
    SPIKE_SPAWN_CHANCE * (structureDifficulty === 'hard' ? HARD_SPIKE_CHANCE_MULTIPLIER : 1);
  let lastSpikeColumn = -SPIKE_MIN_GAP;
  for (let column = INTRO_WIDTH; column < width - OUTRO_WIDTH; column++) {
    const columnHeight = ground[column];
    if (columnHeight <= 0 || ground[column - 1] < columnHeight || ground[column + 1] < columnHeight) {
      continue;
    }
    if (column - lastSpikeColumn <= SPIKE_MIN_GAP) continue;
    if (Math.abs(column - keyColumn) < 2) continue;
    if (some(enemyColumns, (enemyColumn) => Math.abs(enemyColumn - column) < SPIKE_MIN_ENEMY_DISTANCE)) {
      continue;
    }

    const spikeRow = LEVEL_HEIGHT - columnHeight - 1;
    let isClear = true;
    for (let row = spikeRow; row >= spikeRow - SPIKE_CLEARANCE && isClear; row--) {
      if (row < 0 || tiles[row][column] !== TILE_EMPTY) isClear = false;
    }
    if (!isClear) continue;

    if (!rng.chance(spikeChance)) continue;
    tiles[spikeRow][column] = TILE_SPIKE;
    lastSpikeColumn = column;
  }

  const chestColumn = width - 9;
  const portalColumn = width - 4;

  return {
    seed,
    width,
    height: LEVEL_HEIGHT,
    tiles,
    spawn: { x: 2 * TILE_SIZE + 5, y: groundTop(2) - 2 * TILE_SIZE },
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
      x: keyColumn * TILE_SIZE + 7,
      y: keySupportTop - 34,
      width: 18,
      height: 22,
    },
    chestItems: rollChestItems(rng),
    enemies,
  };
}
