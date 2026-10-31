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
import { computeEnemyCentre } from './compute-enemy-centre';

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

describe('computeEnemyCentre', () => {
  it('should find the middle of the enemy when it stands somewhere in the level', () => {
    const enemy = createEnemyAt(100, 40);

    const centre = computeEnemyCentre(enemy);

    expect(centre).toEqual({ x: 111, y: 51 });
  });

  it('should find the middle of the enemy when it stands in the top left corner', () => {
    const enemy = createEnemyAt(0, 0);

    const centre = computeEnemyCentre(enemy);

    expect(centre).toEqual({ x: 11, y: 11 });
  });
});
