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
import { isPlayerNearEnemy } from './is-player-near-enemy';

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

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 20 },
});

describe('isPlayerNearEnemy', () => {
  it('should say yes when the player is just inside the range on the right of the enemy', () => {
    const player = createPlayerAt(179);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(true);
  });

  it('should say yes when the player is just inside the range on the left of the enemy', () => {
    const player = createPlayerAt(21);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(true);
  });

  it('should say no when the player is exactly two and a half tiles to the right of the enemy', () => {
    const player = createPlayerAt(180);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(false);
  });

  it('should say no when the player is exactly two and a half tiles to the left of the enemy', () => {
    const player = createPlayerAt(20);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(false);
  });
});
