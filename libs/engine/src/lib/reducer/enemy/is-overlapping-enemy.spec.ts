import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createEnemies } from './create-enemies';
import { isOverlappingEnemy } from './is-overlapping-enemy';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const createEnemyAt = (left: number, top: number): Enemy => ({
  ...createEnemies(LEVEL)[0],
  position: { x: left, y: top },
});

describe('isOverlappingEnemy', () => {
  it('should say yes when the two enemies stand partly inside each other', () => {
    const one = createEnemyAt(100, 100);
    const other = createEnemyAt(110, 105);

    const isOverlapping = isOverlappingEnemy(one, other);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the enemies stand in the same place', () => {
    const one = createEnemyAt(100, 100);
    const other = createEnemyAt(100, 100);

    const isOverlapping = isOverlappingEnemy(one, other);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the enemies reach just past touching', () => {
    const one = createEnemyAt(100, 100);
    const other = createEnemyAt(115, 100);

    const isOverlapping = isOverlappingEnemy(one, other);

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the enemies are far apart', () => {
    const one = createEnemyAt(100, 100);
    const other = createEnemyAt(300, 100);

    const isOverlapping = isOverlappingEnemy(one, other);

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the enemies only touch side by side', () => {
    const one = createEnemyAt(100, 100);
    const other = createEnemyAt(116, 100);

    const isOverlapping = isOverlappingEnemy(one, other);

    expect(isOverlapping).toBe(false);
  });

  it('should say no when one enemy only touches the top of the other', () => {
    const one = createEnemyAt(100, 100);
    const other = createEnemyAt(100, 116);

    const isOverlapping = isOverlappingEnemy(one, other);

    expect(isOverlapping).toBe(false);
  });
});
