import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { createEnemies } from '../create-enemies';
import { isPlayerAboveEnemy } from './is-player-above-enemy';

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

const ENEMY: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: 100, y: 74 },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: 100, y: top },
});

describe('isPlayerAboveEnemy', () => {
  it('should say yes when the player is high above the enemy', () => {
    const player = createPlayerAt(20);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(true);
  });

  it('should say yes when the feet of the player are just level with the top of the enemy', () => {
    const player = createPlayerAt(32);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(true);
  });

  it('should say no when the player is any lower than that', () => {
    const player = createPlayerAt(33);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(false);
  });

  it('should say no when the player stands beside the enemy', () => {
    const player = createPlayerAt(74);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(false);
  });
});
