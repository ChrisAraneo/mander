import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createPlayer } from '../player/create-player';
import { createEnemies } from './create-enemies';
import { isTouchingEnemy } from './is-touching-enemy';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  s: TILE_SPAWN,
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

const LEVEL = createLevel(['.....', '.....', 's.e..', '#####']);

const createEnemyAt = (left: number, top: number): Enemy => ({
  ...createEnemies(LEVEL)[0],
  position: { x: left, y: top },
});

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  position: { x: left, y: top },
});

describe('isTouchingEnemy', () => {
  it('should say yes when the player stands inside the enemy', () => {
    const player = createPlayerAt(100, 100);
    const enemy = createEnemyAt(100, 110);

    const isTouching = isTouchingEnemy(player, enemy);

    expect(isTouching).toBe(true);
  });

  it('should say yes when the player reaches just past the side of the enemy', () => {
    const player = createPlayerAt(114, 100);
    const enemy = createEnemyAt(100, 110);

    const isTouching = isTouchingEnemy(player, enemy);

    expect(isTouching).toBe(true);
  });

  it('should say no when the player is far from the enemy', () => {
    const player = createPlayerAt(100, 100);
    const enemy = createEnemyAt(300, 100);

    const isTouching = isTouchingEnemy(player, enemy);

    expect(isTouching).toBe(false);
  });

  it('should say no when the player only touches the side of the enemy', () => {
    const player = createPlayerAt(115, 100);
    const enemy = createEnemyAt(100, 110);

    const isTouching = isTouchingEnemy(player, enemy);

    expect(isTouching).toBe(false);
  });

  it('should say no when the feet of the player only touch the top of the enemy', () => {
    const player = createPlayerAt(100, 100);
    const enemy = createEnemyAt(100, 145);

    const isTouching = isTouchingEnemy(player, enemy);

    expect(isTouching).toBe(false);
  });
});
