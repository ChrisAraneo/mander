import {
  FAST_ENEMY_CHANCE,
  FREEZING_ENEMY_CHANCE,
  HORNED_ENEMY_CHANCE,
  SHOOTER_ENEMY_CHANCE,
} from '@mander/engine';
import { TILE_AIR, TILE_BRICK, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { createStructureTileMap } from './create-structure-tile-map';

describe('createStructureTileMap', () => {
  it('should turn the start and the end into air when it builds the level', () => {
    expect(
      createStructureTileMap({
        tiles: [
          [STRUCTURE_START, TILE_AIR, STRUCTURE_END],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ],
        backTiles: [
          [TILE_BRICK, TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
        ],
      }),
    ).toEqual({
      seed: '',
      width: 3,
      height: 2,
      tiles: [
        [TILE_AIR, TILE_AIR, TILE_AIR],
        [TILE_DIRT, TILE_DIRT, TILE_DIRT],
      ],
      backTiles: [
        [TILE_BRICK, TILE_AIR, TILE_AIR],
        [TILE_AIR, TILE_AIR, TILE_AIR],
      ],
      chestItems: [],
      hornedEnemyChance: HORNED_ENEMY_CHANCE,
      fastEnemyChance: FAST_ENEMY_CHANCE,
      shooterEnemyChance: SHOOTER_ENEMY_CHANCE,
      freezingEnemyChance: FREEZING_ENEMY_CHANCE,
    });
  });

  it('should build a level with no size when the sketch is empty', () => {
    const level = createStructureTileMap({ tiles: [], backTiles: [] });

    expect(level.width).toBe(0);
    expect(level.height).toBe(0);
  });
});
