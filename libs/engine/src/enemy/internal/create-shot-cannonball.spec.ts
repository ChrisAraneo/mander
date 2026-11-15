import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SIZE, CANNONBALL_SPEED } from '../../cannon/consts';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { createShotCannonball } from './create-shot-cannonball';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_TOP = 56;

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

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

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const SHOOTER: Enemy = {
  kind: 'SHOOTER',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
};

describe('createShotCannonball', () => {
  it('should put the cannonball in the middle of the shooter when it is fired', () => {
    const cannonball = createShotCannonball(SHOOTER, createPlayerAt(600));

    expect(cannonball.position).toEqual({
      x: ENEMY_LEFT + (ENEMY_WIDTH - CANNONBALL_SIZE) / 2,
      y: ENEMY_TOP + (ENEMY_HEIGHT - CANNONBALL_SIZE) / 2,
    });
  });

  it('should send the cannonball right at cannonball speed when the player stands to the right', () => {
    const cannonball = createShotCannonball(SHOOTER, createPlayerAt(600));

    expect(cannonball.velocity.x).toEqual({
      current: CANNONBALL_SPEED,
      max: CANNONBALL_SPEED,
    });
  });

  it('should send the cannonball on a level line when the shooter fires', () => {
    const cannonball = createShotCannonball(SHOOTER, createPlayerAt(600));

    expect(cannonball.velocity.y).toEqual({
      current: 0,
      max: CANNONBALL_SPEED,
    });
  });

  it('should send the cannonball left at cannonball speed when the player stands to the left', () => {
    const cannonball = createShotCannonball(SHOOTER, createPlayerAt(100));

    expect(cannonball.velocity.x).toEqual({
      current: -CANNONBALL_SPEED,
      max: CANNONBALL_SPEED,
    });
  });

  it('should aim at the player rather than where the shooter walks when the two disagree', () => {
    const facingRight = createShotCannonball(SHOOTER, createPlayerAt(100));
    const facingLeft = createShotCannonball(
      { ...SHOOTER, statuses: { ...SHOOTER.statuses, isFacingRight: false } },
      createPlayerAt(100),
    );

    expect(facingRight).toEqual(facingLeft);
  });
});
