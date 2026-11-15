import {
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRespawnTestLevel } from './create-respawn-test-level';

const LEVEL_WIDTH = 10;

const LEVEL_HEIGHT = 4;

const SPAWN_ROW = 2;

const SPAWN_COLUMN = 1;

const ENEMY_COLUMN = 4;

const CANNON_COLUMN = 8;

const HAZARD_ROW = 1;

const FALLING_SPIKE_COLUMN = 1;

const FIREBALL_COLUMN = 6;

const FLOOR_ROW = 3;

describe('createRespawnTestLevel', () => {
  it('should measure the level from its rows when it builds the level', () => {
    const level = createRespawnTestLevel();

    expect(level.width).toBe(LEVEL_WIDTH);
    expect(level.height).toBe(LEVEL_HEIGHT);
  });

  it('should hold the spawn, the enemy and the cannon when it builds the level', () => {
    const level = createRespawnTestLevel();

    expect(level.tiles[SPAWN_ROW][SPAWN_COLUMN]).toBe(TILE_SPAWN);
    expect(level.tiles[SPAWN_ROW][ENEMY_COLUMN]).toBe(TILE_ENEMY);
    expect(level.tiles[SPAWN_ROW][CANNON_COLUMN]).toBe(TILE_CANNON);
  });

  it('should hang the falling spike and the fireball above the spawn row when it builds the level', () => {
    const level = createRespawnTestLevel();

    expect(level.tiles[HAZARD_ROW][FALLING_SPIKE_COLUMN]).toBe(
      TILE_SPIKE_FALLING,
    );
    expect(level.tiles[HAZARD_ROW][FIREBALL_COLUMN]).toBe(TILE_FIREBALL);
  });

  it('should floor the level with dirt and leave the rest open when it builds the level', () => {
    const level = createRespawnTestLevel();

    expect(level.tiles[FLOOR_ROW][0]).toBe(TILE_DIRT);
    expect(level.tiles[0][0]).toBe(TILE_AIR);
  });

  it('should build a level of its own each time it is called', () => {
    expect(createRespawnTestLevel()).not.toBe(createRespawnTestLevel());
    expect(createRespawnTestLevel()).toEqual(createRespawnTestLevel());
  });
});
