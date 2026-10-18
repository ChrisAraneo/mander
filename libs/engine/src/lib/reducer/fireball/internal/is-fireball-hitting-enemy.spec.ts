import { type Enemy, type Tile, TILE_AIR, TILE_DIRT, TILE_ENEMY, type Point } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { isFireballHittingEnemy } from './is-fireball-hitting-enemy';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const createEnemyAt = (position: Point): Enemy => ({
  ...createEnemies(LEVEL)[0],
  position,
});

const ENEMY = createEnemyAt({ x: 100, y: 100 });

describe('isFireballHittingEnemy', () => {
  it('should hit the enemy when the fireball sits on its centre', () => {
    const isHitting = isFireballHittingEnemy({ x: 111, y: 111 }, ENEMY);

    expect(isHitting).toBe(true);
  });

  it('should miss the enemy when the fireball is far away from it', () => {
    const isHitting = isFireballHittingEnemy({ x: 111, y: 200 }, ENEMY);

    expect(isHitting).toBe(false);
  });

  it('should hit the enemy when the fireball just overlaps its left side', () => {
    const isHitting = isFireballHittingEnemy({ x: 98.5, y: 111 }, ENEMY);

    expect(isHitting).toBe(true);
  });

  it('should miss the enemy when the fireball only touches its left side', () => {
    const isHitting = isFireballHittingEnemy({ x: 98, y: 111 }, ENEMY);

    expect(isHitting).toBe(false);
  });

  it('should miss the enemy when the fireball only touches its right side', () => {
    const isHitting = isFireballHittingEnemy({ x: 124, y: 111 }, ENEMY);

    expect(isHitting).toBe(false);
  });

  it('should miss the enemy when the fireball only touches its top', () => {
    const isHitting = isFireballHittingEnemy({ x: 111, y: 98 }, ENEMY);

    expect(isHitting).toBe(false);
  });

  it('should miss the enemy when the fireball only touches its bottom', () => {
    const isHitting = isFireballHittingEnemy({ x: 111, y: 124 }, ENEMY);

    expect(isHitting).toBe(false);
  });

  it('should hit the enemy when the fireball just overlaps its bottom', () => {
    const isHitting = isFireballHittingEnemy({ x: 111, y: 123.5 }, ENEMY);

    expect(isHitting).toBe(true);
  });
});
