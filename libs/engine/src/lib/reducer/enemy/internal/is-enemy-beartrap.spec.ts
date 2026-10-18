import {
  type Enemy,
  type EnemyKind,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../create-enemies';
import { isEnemyBeartrap } from './is-enemy-beartrap';

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

const BASE_ENEMY = createEnemies(LEVEL)[0];

const createEnemyOfKind = (kind: EnemyKind): Enemy => ({
  ...BASE_ENEMY,
  kind,
});

describe('isEnemyBeartrap', () => {
  it('should say yes when the enemy is a beartrap', () => {
    const enemy = createEnemyOfKind('BEARTRAP');

    const isBeartrap = isEnemyBeartrap(enemy);

    expect(isBeartrap).toBe(true);
  });

  it('should say no when the enemy is a hopping enemy', () => {
    const enemy = createEnemyOfKind('HOPPING');

    const isBeartrap = isEnemyBeartrap(enemy);

    expect(isBeartrap).toBe(false);
  });

  it('should say no when the enemy is a horned enemy', () => {
    const enemy = createEnemyOfKind('HORNED');

    const isBeartrap = isEnemyBeartrap(enemy);

    expect(isBeartrap).toBe(false);
  });

  it('should say no when the enemy is a flying enemy', () => {
    const enemy = createEnemyOfKind('FLYING');

    const isBeartrap = isEnemyBeartrap(enemy);

    expect(isBeartrap).toBe(false);
  });
});
