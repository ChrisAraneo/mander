import {
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_HOPPING,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchEnemyTiles } from './patch-enemy-tiles';

const GRID: Tile[][] = [
  [TILE_ENEMY, TILE_ENEMY],
  [TILE_DIRT, TILE_AIR],
];

describe('patchEnemyTiles', () => {
  it('should write every enemy in when the patches name them', () => {
    expect(
      patchEnemyTiles({
        tiles: GRID,
        patches: [
          { row: 0, column: 0, tile: TILE_ENEMY_HOPPING },
          { row: 0, column: 1, tile: TILE_ENEMY_FLYING },
        ],
      }),
    ).toEqual([
      [TILE_ENEMY_HOPPING, TILE_ENEMY_FLYING],
      [TILE_DIRT, TILE_AIR],
    ]);
  });

  it('should give the grid back untouched when no patch names an enemy', () => {
    expect(patchEnemyTiles({ tiles: GRID, patches: [] })).toEqual(GRID);
  });

  it('should not change the old grid when it writes the enemies in', () => {
    patchEnemyTiles({
      tiles: GRID,
      patches: [{ row: 0, column: 0, tile: TILE_ENEMY_HOPPING }],
    });

    expect(GRID).toEqual([
      [TILE_ENEMY, TILE_ENEMY],
      [TILE_DIRT, TILE_AIR],
    ]);
  });
});
