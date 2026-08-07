import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import { TILE_SPAWN } from '../player/spawn';
import type { Tile } from '../tile/tile';
import { findSpawnTile } from './find-spawn-tile';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findSpawnTile', () => {
  it('should point at the tile the player starts from when the level marks one', () => {
    expect(
      findSpawnTile(
        level([
          [TILE_AIR, TILE_SPAWN],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should come back empty-handed when the level marks nowhere to start', () => {
    expect(
      findSpawnTile(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should take the first it meets when the level offers more than one', () => {
    expect(
      findSpawnTile(
        level([
          [TILE_AIR, TILE_SPAWN],
          [TILE_SPAWN, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });
});
