import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { TILE_CHEST } from './chest';
import { findChestTile } from './find-chest-tile';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findChestTile', () => {
  it('should point at the chest when the level holds one', () => {
    expect(
      findChestTile(
        level([
          [TILE_AIR, TILE_CHEST],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should come back empty-handed when the level holds no chest', () => {
    expect(
      findChestTile(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should take the first it meets when the level hides more than one', () => {
    expect(
      findChestTile(
        level([
          [TILE_AIR, TILE_AIR, TILE_CHEST],
          [TILE_CHEST, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 2, y: 0 });
  });
});
