import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../create-enemies';
import { computeEnemyHead } from './compute-enemy-head';

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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const createEnemyAt = (top: number): Enemy => ({
  ...createEnemies(LEVEL)[0],
  position: { x: 100, y: top },
});

describe('computeEnemyHead', () => {
  it('should put the head a little below the top of the enemy when it stands in the level', () => {
    const enemy = createEnemyAt(40);

    const headY = computeEnemyHead(enemy);

    expect(headY).toBe(43);
  });

  it('should put the head a little below the top of the level when the enemy stands at the very top', () => {
    const enemy = createEnemyAt(0);

    const headY = computeEnemyHead(enemy);

    expect(headY).toBe(3);
  });
});
