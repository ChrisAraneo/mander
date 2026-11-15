import { createRandom } from '@mander/common';
import {
  type Tile,
  type TileCell,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { createSpawnPatrol } from './create-spawn-patrol';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const NO_CHANCE = 0;
const NO_SPEED = 0;
const NO_RELOAD = 0;
const SPAWN_COLUMN = 2;
const SPAWN_ROW = 1;
const SPAWN_LEFT = 69;
const SPAWN_TOP = 42;

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

const LEVEL = createLevel(['.....', '..e..', '#####']);

const SPAWN: TileCell = {
  x: SPAWN_COLUMN,
  y: SPAWN_ROW,
  tile: TILE_ENEMY,
};

describe('createSpawnPatrol', () => {
  it('should set a still hopping enemy in the middle of its tile when the tile stands on ground', () => {
    const patrol = createSpawnPatrol(LEVEL, SPAWN, createRandom('SEED'));

    expect(patrol).toEqual({
      kind: 'HOPPING',
      position: { x: SPAWN_LEFT, y: SPAWN_TOP },
      velocity: {
        x: { current: NO_SPEED, max: ENEMY_MOVE_SPEED },
        y: { current: NO_SPEED, max: ENEMY_JUMP_VELOCITY },
      },
      timers: { death: null, reload: NO_RELOAD },
      spawn: { x: SPAWN_LEFT, y: SPAWN_TOP },
      statuses: { isFacingRight: true, isGrounded: false },
    });
  });

  it('should remember where the enemy came from when it sets the enemy', () => {
    const patrol = createSpawnPatrol(LEVEL, SPAWN, createRandom('SEED'));

    expect(patrol.spawn).toEqual(patrol.position);
    expect(patrol.spawn).not.toBe(patrol.position);
  });

  it('should leave the spawn cell unchanged when it sets the enemy', () => {
    createSpawnPatrol(LEVEL, SPAWN, createRandom('SEED'));

    expect(SPAWN).toEqual({
      x: SPAWN_COLUMN,
      y: SPAWN_ROW,
      tile: TILE_ENEMY,
    });
  });

  it('should give the same enemy twice when the same generator is seeded again', () => {
    const first = createSpawnPatrol(LEVEL, SPAWN, createRandom('SEED'));
    const second = createSpawnPatrol(LEVEL, SPAWN, createRandom('SEED'));

    expect(first).toEqual(second);
  });
});
