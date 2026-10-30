import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findEnemySpawns } from './find-enemy-spawns';
import { TILE_BEARTRAP } from './tile-beartrap';
import { TILE_ENEMY } from './tile-enemy';
import { TILE_ENEMY_FLYING } from './tile-enemy-flying';
import { TILE_ENEMY_HORNED } from './tile-enemy-horned';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findEnemySpawns', () => {
  it('should return every spawn with the tile it stands on when the level mixes enemy kinds', () => {
    expect(
      findEnemySpawns(
        createLevel([
          [TILE_ENEMY_FLYING, TILE_AIR, TILE_ENEMY],
          [TILE_AIR, TILE_ENEMY_HORNED, TILE_AIR],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0, tile: TILE_ENEMY_FLYING },
      { x: 2, y: 0, tile: TILE_ENEMY },
      { x: 1, y: 1, tile: TILE_ENEMY_HORNED },
    ]);
  });

  it('should return one spawn when the level holds a single enemy', () => {
    expect(
      findEnemySpawns(
        createLevel([
          [TILE_AIR, TILE_ENEMY],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0, tile: TILE_ENEMY }]);
  });

  it('should return nothing when the level holds no enemy', () => {
    expect(
      findEnemySpawns(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });

  it('should pass the beartraps by when the level holds them', () => {
    expect(
      findEnemySpawns(
        createLevel([
          [TILE_AIR, TILE_BEARTRAP],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual([]);
  });
});
