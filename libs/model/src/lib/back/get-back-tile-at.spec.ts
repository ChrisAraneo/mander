import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_BRICK } from '../blocks/tile-brick';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import { getBackTileAt } from './get-back-tile-at';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 2,
  tiles: [
    [TILE_AIR, TILE_AIR],
    [TILE_DIRT, TILE_DIRT],
  ],
  backTiles: [
    [TILE_BRICK, TILE_AIR],
    [TILE_AIR, TILE_BRICK],
  ],
  chestItems: [],
};

const FLAT_LEVEL: Level = { ...LEVEL, backTiles: undefined };

describe('getBackTileAt', () => {
  it('should return the back tile when the coordinates lie inside the level', () => {
    expect(getBackTileAt(LEVEL, 0, 0)).toBe(TILE_BRICK);
    expect(getBackTileAt(LEVEL, 1, 1)).toBe(TILE_BRICK);
  });

  it('should return air when the back tile is air', () => {
    expect(getBackTileAt(LEVEL, 1, 0)).toBe(TILE_AIR);
  });

  it('should return air when the coordinates lie outside the level', () => {
    expect(getBackTileAt(LEVEL, -1, 0)).toBe(TILE_AIR);
    expect(getBackTileAt(LEVEL, 2, 0)).toBe(TILE_AIR);
    expect(getBackTileAt(LEVEL, 0, -1)).toBe(TILE_AIR);
    expect(getBackTileAt(LEVEL, 0, 2)).toBe(TILE_AIR);
  });

  it('should return air when the level has no back tiles', () => {
    expect(getBackTileAt(FLAT_LEVEL, 0, 0)).toBe(TILE_AIR);
  });
});
