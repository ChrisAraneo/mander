import { createRandom, type Random } from '@mander/common';
import {
  TILE_ENEMY_FAST,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_SHOOTER,
  type Tile,
} from '@mander/model';
import { filter, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { EnemyChances } from '../../types/enemy-chances';
import { takeRandomGroundEnemyTile } from './take-random-ground-enemy-tile';

const NOTHING: EnemyChances = { horned: 0, fast: 0, shooter: 0, freezing: 0 };

const EVERYTHING: EnemyChances = {
  horned: 1,
  fast: 1,
  shooter: 1,
  freezing: 1,
};

const MIXED: EnemyChances = {
  horned: 0.5,
  fast: 0.25,
  shooter: 0.15,
  freezing: 0.15,
};

const DRAWS = 400;

const LEAST_SHOOTER_SHARE = 0.1;

const MOST_SHOOTER_SHARE = 0.2;

const takeRandomTilesWith = (chances: EnemyChances, random: Random): Tile[] =>
  times(DRAWS, () => takeRandomGroundEnemyTile(chances, random));

const takeRandomTiles = (chances: EnemyChances, seed = 'DAY-1'): Tile[] =>
  takeRandomTilesWith(chances, createRandom(seed));

const computeShare = (tiles: Tile[], wanted: Tile): number =>
  size(filter(tiles, (tile) => tile === wanted)) / DRAWS;

describe('takeRandomGroundEnemyTile', () => {
  it('should hop when the level rolls for nothing else', () => {
    expect(uniq(takeRandomTiles(NOTHING))).toEqual([TILE_ENEMY_HOPPING]);
  });

  it('should give every enemy horns when the level is certain of them', () => {
    expect(uniq(takeRandomTiles({ ...NOTHING, horned: 1 }))).toEqual([
      TILE_ENEMY_HORNED,
    ]);
  });

  it('should make every enemy fast when the level is certain of them', () => {
    expect(uniq(takeRandomTiles({ ...NOTHING, horned: 1, fast: 1 }))).toEqual([
      TILE_ENEMY_FAST,
    ]);
  });

  it('should make every enemy a shooter when the level is certain of them', () => {
    expect(uniq(takeRandomTiles(EVERYTHING))).toEqual([TILE_ENEMY_SHOOTER]);
  });

  it('should hand shooters the share the level promised them when it rolls for them', () => {
    const share = computeShare(takeRandomTiles(MIXED), TILE_ENEMY_SHOOTER);

    expect(share).toBeGreaterThan(LEAST_SHOOTER_SHARE);
    expect(share).toBeLessThan(MOST_SHOOTER_SHARE);
  });

  it('should draw the same enemies when the generator starts from the same seed', () => {
    expect(takeRandomTiles(MIXED)).toEqual(takeRandomTiles(MIXED));
  });

  it('should draw other enemies when the generator starts from another seed', () => {
    expect(takeRandomTiles(MIXED)).not.toEqual(takeRandomTiles(MIXED, 'DAY-2'));
  });
});
