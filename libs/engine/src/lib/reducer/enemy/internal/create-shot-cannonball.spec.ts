import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { CANNONBALL_SIZE, CANNONBALL_SPEED } from '../../cannon/consts';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { createShotCannonball } from './create-shot-cannonball';

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
  position: { x: left, y: 56 },
});

const SHOOTER: Enemy = {
  kind: 'SHOOTER',
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
};

describe('createShotCannonball', () => {
  it('should put the cannonball in the middle of the shooter when it is fired', () => {
    const cannonball = createShotCannonball(SHOOTER, createPlayerAt(600));

    expect(cannonball.position).toEqual({
      x: 320 + (ENEMY_WIDTH - CANNONBALL_SIZE) / 2,
      y: 64 + (ENEMY_HEIGHT - CANNONBALL_SIZE) / 2,
    });
  });

  it('should send the cannonball right at cannonball speed when the player stands to the right', () => {
    const cannonball = createShotCannonball(SHOOTER, createPlayerAt(600));

    expect(cannonball.velocity.x).toEqual({
      current: CANNONBALL_SPEED,
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
