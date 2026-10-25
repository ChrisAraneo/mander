import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findChestTile } from './find-chest-tile';
import { TILE_CHEST } from './tile-chest';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findChestTile', () => {
  it('should return the chest position when the level has a chest', () => {
    expect(
      findChestTile(
        createLevel([
          [TILE_AIR, TILE_CHEST],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should return null when the level has no chest', () => {
    expect(
      findChestTile(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should return the first chest in reading order when the level has several', () => {
    expect(
      findChestTile(
        createLevel([
          [TILE_AIR, TILE_AIR, TILE_CHEST],
          [TILE_CHEST, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 2, y: 0 });
  });
});
