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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const ENEMY_LEFT = 100;
const ENEMY_HEAD_TOP = 74;
const HIGH_ABOVE_TOP = 20;
const FEET_LEVEL_TOP = 32;
const JUST_BELOW_TOP = 33;
const BESIDE_TOP = 74;

const LEVEL = createLevel(['.....', '..e..', '#####']);

const ENEMY: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: ENEMY_LEFT, y: ENEMY_HEAD_TOP },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: ENEMY_LEFT, y: top },
});

describe('isPlayerAboveEnemy', () => {
  it('should say yes when the player is high above the enemy', () => {
    const player = createPlayerAt(HIGH_ABOVE_TOP);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(true);
  });

  it('should say yes when the feet of the player are just level with the top of the enemy', () => {
    const player = createPlayerAt(FEET_LEVEL_TOP);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(true);
  });

  it('should say no when the player is any lower than that', () => {
    const player = createPlayerAt(JUST_BELOW_TOP);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(false);
  });

  it('should say no when the player stands beside the enemy', () => {
    const player = createPlayerAt(BESIDE_TOP);

    const isAbove = isPlayerAboveEnemy(ENEMY, player);

    expect(isAbove).toBe(false);
  });
});
