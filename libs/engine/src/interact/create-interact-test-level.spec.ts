import { TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createInteractTestLevel } from './create-interact-test-level';

const LEVEL_WIDTH = 5;

const LEVEL_HEIGHT = 3;

const SPAWN_ROW = 1;

const SPAWN_COLUMN = 1;

const FLOOR_ROW = 2;

describe('createInteractTestLevel', () => {
  it('should measure the level from its rows when it builds the level', () => {
    const level = createInteractTestLevel();

    expect(level.width).toBe(LEVEL_WIDTH);
    expect(level.height).toBe(LEVEL_HEIGHT);
  });

  it('should put the spawn on the floor with open air above when it builds the level', () => {
    const level = createInteractTestLevel();

    expect(level.tiles[SPAWN_ROW][SPAWN_COLUMN]).toBe(TILE_SPAWN);
    expect(level.tiles[0][SPAWN_COLUMN]).toBe(TILE_AIR);
    expect(level.tiles[FLOOR_ROW][SPAWN_COLUMN]).toBe(TILE_DIRT);
  });

  it('should hold no chest items and no enemy chances when it builds the level', () => {
    const level = createInteractTestLevel();

    expect(level.chestItems).toEqual([]);
    expect(level.hornedEnemyChance).toBe(0);
  });

  it('should build a level of its own each time it is called', () => {
    expect(createInteractTestLevel()).not.toBe(createInteractTestLevel());
    expect(createInteractTestLevel()).toEqual(createInteractTestLevel());
  });
});
