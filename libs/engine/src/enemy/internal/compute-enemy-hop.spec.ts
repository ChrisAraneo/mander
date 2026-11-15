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
import { ENEMY_JUMP_VELOCITY } from '../consts';
import { createEnemies } from '../create-enemies';
import { computeEnemyHop } from './compute-enemy-hop';

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
const ENEMY_TOP = 74;
const OVERHEAD_TOP = 16;
const FAR_LEFT = 300;
const NO_FALL_SPEED = 0;
const SLOW_FALL_SPEED = 12;
const FAST_FALL_SPEED = 150;

const LEVEL = createLevel(['.....', '..e..', '#####']);

const ENEMY: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number, top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: top },
});

const createDeadPlayerAt = (left: number, top: number): Player => ({
  ...createPlayerAt(left, top),
  timers: { ...BASE_PLAYER.timers, death: 0 },
});

describe('computeEnemyHop', () => {
  it('should make the enemy jump when it is on the ground and the player is overhead', () => {
    const player = createPlayerAt(ENEMY_LEFT, OVERHEAD_TOP);

    const hop = computeEnemyHop(ENEMY, player, NO_FALL_SPEED, true);

    expect(hop).toEqual({ velocityY: -ENEMY_JUMP_VELOCITY, isGrounded: false });
  });

  it('should keep the enemy as it was when it is on the ground and the player stands beside it', () => {
    const player = createPlayerAt(ENEMY_LEFT, ENEMY_TOP);

    const hop = computeEnemyHop(ENEMY, player, SLOW_FALL_SPEED, true);

    expect(hop).toEqual({ velocityY: SLOW_FALL_SPEED, isGrounded: true });
  });

  it('should keep the enemy as it was when it is on the ground and the player is high up far away', () => {
    const player = createPlayerAt(FAR_LEFT, OVERHEAD_TOP);

    const hop = computeEnemyHop(ENEMY, player, SLOW_FALL_SPEED, true);

    expect(hop).toEqual({ velocityY: SLOW_FALL_SPEED, isGrounded: true });
  });

  it('should keep the enemy as it was when it is in the air and the player is overhead', () => {
    const player = createPlayerAt(ENEMY_LEFT, OVERHEAD_TOP);

    const hop = computeEnemyHop(ENEMY, player, FAST_FALL_SPEED, false);

    expect(hop).toEqual({ velocityY: FAST_FALL_SPEED, isGrounded: false });
  });

  it('should keep the enemy as it was when the player overhead is dead', () => {
    const player = createDeadPlayerAt(ENEMY_LEFT, OVERHEAD_TOP);

    const hop = computeEnemyHop(ENEMY, player, SLOW_FALL_SPEED, true);

    expect(hop).toEqual({ velocityY: SLOW_FALL_SPEED, isGrounded: true });
  });
});
