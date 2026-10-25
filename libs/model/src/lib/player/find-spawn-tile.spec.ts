import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findSpawnTile } from './find-spawn-tile';
import { TILE_SPAWN } from './tile-spawn';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findSpawnTile', () => {
  it('should return the spawn position when the level has a spawn', () => {
    expect(
      findSpawnTile(
        createLevel([
          [TILE_AIR, TILE_SPAWN],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should return null when the level has no spawn', () => {
    expect(
      findSpawnTile(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should return the first spawn in reading order when the level has several', () => {
    expect(
      findSpawnTile(
        createLevel([
          [TILE_AIR, TILE_SPAWN],
          [TILE_SPAWN, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });
});
