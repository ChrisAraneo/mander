import { createRandom } from '@mander/engine';
import {
  TILE_ENEMY_FAST,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_SHOOTER,
  type Tile,
} from '@mander/model';
import { filter, size, times, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import type { EnemyChances } from '../../types/enemy-chances';
import { takeRandomGroundEnemyTile } from './take-random-ground-enemy-tile';

const NOTHING: EnemyChances = { horned: 0, fast: 0, shooter: 0, freezing: 0 };

const DRAWS = 400;

const takeMany = (chances: EnemyChances): Tile[] =>
  pipe(createRandom('DAY-1'), (random) =>
    times(DRAWS, () => takeRandomGroundEnemyTile(chances, random)),
  );

const computeShare = (tiles: Tile[], wanted: Tile): number =>
  size(filter(tiles, (tile) => tile === wanted)) / DRAWS;

describe('takeRandomGroundEnemyTile', () => {
  it('should hop when the level rolls for nothing else', () => {
    expect(uniq(takeMany(NOTHING))).toEqual([TILE_ENEMY_HOPPING]);
  });

  it('should give every enemy horns when the level is certain of them', () => {
    expect(uniq(takeMany({ ...NOTHING, horned: 1 }))).toEqual([
      TILE_ENEMY_HORNED,
    ]);
  });

  it('should make every enemy fast when the level is certain of them', () => {
    expect(uniq(takeMany({ ...NOTHING, horned: 1, fast: 1 }))).toEqual([
      TILE_ENEMY_FAST,
    ]);
  });

  it('should make every enemy a shooter when the level is certain of them', () => {
    expect(
      uniq(takeMany({ horned: 1, fast: 1, shooter: 1, freezing: 1 })),
    ).toEqual([TILE_ENEMY_SHOOTER]);
  });

  it('should hand shooters the share the level promised them when it rolls for them', () => {
    const share = computeShare(
      takeMany({ horned: 0.5, fast: 0.25, shooter: 0.15, freezing: 0.15 }),
      TILE_ENEMY_SHOOTER,
    );

    expect(share).toBeGreaterThan(0.1);
    expect(share).toBeLessThan(0.2);
  });

  it('should draw the same enemies when the generator starts from the same seed', () => {
    expect(
      takeMany({ horned: 0.5, fast: 0.25, shooter: 0.15, freezing: 0.15 }),
    ).toEqual(
      takeMany({ horned: 0.5, fast: 0.25, shooter: 0.15, freezing: 0.15 }),
    );
  });
});
