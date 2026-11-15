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
import { isOverlappingHorizontally } from './is-overlapping-horizontally';

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
const PLAYER_TOP = 30;
const WITHIN_GRACE_RIGHT_LEFT = 116;
const WITHIN_GRACE_LEFT_LEFT = 83;
const BEYOND_GRACE_RIGHT_LEFT = 119;
const BEYOND_GRACE_LEFT_LEFT = 81;

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

describe('isOverlappingHorizontally', () => {
  it('should say yes when the player is right above the enemy', () => {
    const player = createPlayerAt(ENEMY_LEFT);

    const isOverlapping = isOverlappingHorizontally(ENEMY, player);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the player is just past the right side of the enemy but within the grace', () => {
    const player = createPlayerAt(WITHIN_GRACE_RIGHT_LEFT);

    const isOverlapping = isOverlappingHorizontally(ENEMY, player);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the player is just past the left side of the enemy but within the grace', () => {
    const player = createPlayerAt(WITHIN_GRACE_LEFT_LEFT);

    const isOverlapping = isOverlappingHorizontally(ENEMY, player);

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the player is beyond the grace on the right of the enemy', () => {
    const player = createPlayerAt(BEYOND_GRACE_RIGHT_LEFT);

    const isOverlapping = isOverlappingHorizontally(ENEMY, player);

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the player is beyond the grace on the left of the enemy', () => {
    const player = createPlayerAt(BEYOND_GRACE_LEFT_LEFT);

    const isOverlapping = isOverlappingHorizontally(ENEMY, player);

    expect(isOverlapping).toBe(false);
  });
});
