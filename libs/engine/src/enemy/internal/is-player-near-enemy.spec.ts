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

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const ENEMY_LEFT = 100;
const ENEMY_HEAD_TOP = 74;
const PLAYER_TOP = 20;
const INSIDE_RANGE_RIGHT_LEFT = 179;
const INSIDE_RANGE_LEFT_LEFT = 21;
const AT_RANGE_RIGHT_LEFT = 180;
const AT_RANGE_LEFT_LEFT = 20;

const LEVEL = createLevel(['.....', '..e..', '#####']);

const ENEMY: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: ENEMY_LEFT, y: ENEMY_HEAD_TOP },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

describe('isPlayerNearEnemy', () => {
  it('should say yes when the player is just inside the range on the right of the enemy', () => {
    const player = createPlayerAt(INSIDE_RANGE_RIGHT_LEFT);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(true);
  });

  it('should say yes when the player is just inside the range on the left of the enemy', () => {
    const player = createPlayerAt(INSIDE_RANGE_LEFT_LEFT);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(true);
  });

  it('should say no when the player is exactly two and a half tiles to the right of the enemy', () => {
    const player = createPlayerAt(AT_RANGE_RIGHT_LEFT);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(false);
  });

  it('should say no when the player is exactly two and a half tiles to the left of the enemy', () => {
    const player = createPlayerAt(AT_RANGE_LEFT_LEFT);

    const isNear = isPlayerNearEnemy(ENEMY, player);

    expect(isNear).toBe(false);
  });
});
