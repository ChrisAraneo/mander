import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { TILE_ENEMY } from './enemy-spawn';
import { findEnemyTiles } from './find-enemy-tiles';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findEnemyTiles', () => {
  it('should gather every spot when the level posts several enemies', () => {
    expect(
      findEnemyTiles(
        level([
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

  it('should gather the one spot when the level posts a single enemy', () => {
    expect(
      findEnemyTiles(
        level([
          [TILE_AIR, TILE_ENEMY],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should gather nothing when the level is left unguarded', () => {
    expect(
      findEnemyTiles(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
