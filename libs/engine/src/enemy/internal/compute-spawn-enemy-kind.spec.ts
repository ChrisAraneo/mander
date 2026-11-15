import { createRandom } from '@mander/common';
import {
  type Tile,
  type TileCell,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
} from '@mander/model';
import { constant, head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { computeSpawnEnemyKind } from './compute-spawn-enemy-kind';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const NO_CHANCE = 0;
const CERTAIN_CHANCE = 1;
const GROUND_SPAWN_COLUMN = 2;
const GROUND_SPAWN_ROW = 1;
const AIR_SPAWN_ROW = 0;
const ALWAYS_ROLLED = 0;

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: NO_CHANCE,
  fastEnemyChance: NO_CHANCE,
  shooterEnemyChance: NO_CHANCE,
  freezingEnemyChance: NO_CHANCE,
});

const GROUND_LEVEL = createLevel(['.....', '..e..', '#####']);

const AIR_LEVEL = createLevel(['..e..', '.....', '#####']);

const GROUND_SPAWN: TileCell = {
  x: GROUND_SPAWN_COLUMN,
  y: GROUND_SPAWN_ROW,
  tile: TILE_ENEMY,
};

const AIR_SPAWN: TileCell = {
  x: GROUND_SPAWN_COLUMN,
  y: AIR_SPAWN_ROW,
  tile: TILE_ENEMY,
};

const FLYING_SPAWN: TileCell = {
  x: GROUND_SPAWN_COLUMN,
  y: GROUND_SPAWN_ROW,
  tile: TILE_ENEMY_FLYING,
};

describe('computeSpawnEnemyKind', () => {
  it('should call the enemy hopping when it stands on solid ground and nothing is rolled', () => {
    const kind = computeSpawnEnemyKind(
      GROUND_LEVEL,
      GROUND_SPAWN,
      createRandom('SEED'),
    );

    expect(kind).toBe('HOPPING');
  });

  it('should call the enemy flying when there is only air under its tile', () => {
    const kind = computeSpawnEnemyKind(
      AIR_LEVEL,
      AIR_SPAWN,
      createRandom('SEED'),
    );

    expect(kind).toBe('FLYING');
  });

  it('should take the kind from the tile when the tile names one', () => {
    const kind = computeSpawnEnemyKind(
      GROUND_LEVEL,
      FLYING_SPAWN,
      createRandom('SEED'),
    );

    expect(kind).toBe('FLYING');
  });

  it('should call the enemy horned when the horned roll comes in', () => {
    const level = { ...GROUND_LEVEL, hornedEnemyChance: CERTAIN_CHANCE };

    const kind = computeSpawnEnemyKind(
      level,
      GROUND_SPAWN,
      constant(ALWAYS_ROLLED),
    );

    expect(kind).toBe('HORNED');
  });

  it('should give the same kind twice when the same generator is seeded again', () => {
    const level = { ...GROUND_LEVEL, hornedEnemyChance: CERTAIN_CHANCE };

    const first = computeSpawnEnemyKind(
      level,
      GROUND_SPAWN,
      createRandom('SEED'),
    );
    const second = computeSpawnEnemyKind(
      level,
      GROUND_SPAWN,
      createRandom('SEED'),
    );

    expect(first).toBe(second);
  });

  it('should leave the level unchanged when it works out the kind', () => {
    computeSpawnEnemyKind(GROUND_LEVEL, GROUND_SPAWN, createRandom('SEED'));

    expect(GROUND_LEVEL).toEqual(createLevel(['.....', '..e..', '#####']));
  });
});
