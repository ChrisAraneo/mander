import { TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createJumpTestLevel } from './create-jump-test-level';

const LEVEL_WIDTH = 5;

const LEVEL_HEIGHT = 3;

const SPAWN_ROW = 1;

const SPAWN_COLUMN = 1;

const FLOOR_ROW = 2;

describe('createJumpTestLevel', () => {
  it('should measure the level from its rows when it builds the level', () => {
    const level = createJumpTestLevel();

    expect(level.width).toBe(LEVEL_WIDTH);
    expect(level.height).toBe(LEVEL_HEIGHT);
  });

  it('should put the spawn on the floor with open air above when it builds the level', () => {
    const level = createJumpTestLevel();

    expect(level.tiles[SPAWN_ROW][SPAWN_COLUMN]).toBe(TILE_SPAWN);
    expect(level.tiles[0][SPAWN_COLUMN]).toBe(TILE_AIR);
    expect(level.tiles[FLOOR_ROW][SPAWN_COLUMN]).toBe(TILE_DIRT);
  });

  it('should build a level of its own each time it is called', () => {
    expect(createJumpTestLevel()).not.toBe(createJumpTestLevel());
    expect(createJumpTestLevel()).toEqual(createJumpTestLevel());
  });
});
