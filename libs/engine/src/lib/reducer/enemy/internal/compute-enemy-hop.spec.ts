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

const LEVEL = createLevel(['.....', '..e..', '#####']);

const ENEMY: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: 100, y: 74 },
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
    const player = createPlayerAt(100, 16);

    const hop = computeEnemyHop(true, 0, ENEMY, player);

    expect(hop).toEqual({ velocityY: -ENEMY_JUMP_VELOCITY, isGrounded: false });
  });

  it('should keep the enemy as it was when it is on the ground and the player stands beside it', () => {
    const player = createPlayerAt(100, 74);

    const hop = computeEnemyHop(true, 12, ENEMY, player);

    expect(hop).toEqual({ velocityY: 12, isGrounded: true });
  });

  it('should keep the enemy as it was when it is on the ground and the player is high up far away', () => {
    const player = createPlayerAt(300, 16);

    const hop = computeEnemyHop(true, 12, ENEMY, player);

    expect(hop).toEqual({ velocityY: 12, isGrounded: true });
  });

  it('should keep the enemy as it was when it is in the air and the player is overhead', () => {
    const player = createPlayerAt(100, 16);

    const hop = computeEnemyHop(false, 150, ENEMY, player);

    expect(hop).toEqual({ velocityY: 150, isGrounded: false });
  });

  it('should keep the enemy as it was when the player overhead is dead', () => {
    const player = createDeadPlayerAt(100, 16);

    const hop = computeEnemyHop(true, 12, ENEMY, player);

    expect(hop).toEqual({ velocityY: 12, isGrounded: true });
  });
});
