import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findEnemyTiles } from './find-enemy-tiles';
import { TILE_ENEMY } from './tile-enemy';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findEnemyTiles', () => {
  it('should return every enemy position when the level has several enemies', () => {
    expect(
      findEnemyTiles(
        createLevel([
          [TILE_ENEMY, TILE_AIR, TILE_ENEMY],
          [TILE_AIR, TILE_ENEMY, TILE_AIR],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should return one position when the level has a single enemy', () => {
    expect(
      findEnemyTiles(
        createLevel([
          [TILE_AIR, TILE_ENEMY],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should return nothing when the level has no enemy', () => {
    expect(
      findEnemyTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
