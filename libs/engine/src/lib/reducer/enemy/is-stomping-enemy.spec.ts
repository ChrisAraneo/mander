import type { Enemy, Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT } from '../player/consts';
import {
  ENEMY_HEIGHT,
  ENEMY_HITBOX_INSET,
  ENEMY_JUMP_VELOCITY,
  ENEMY_WIDTH,
} from './consts';
import { isStompingEnemy } from './is-stomping-enemy';

const DELTA_SECONDS = 1 / 60;

const ENEMY_X = 100;

const ENEMY_Y = 200;

const HEAD = ENEMY_Y + ENEMY_HITBOX_INSET;

const BELLY = ENEMY_Y + ENEMY_HEIGHT / 2;

const FLOOR = ENEMY_Y + ENEMY_HEIGHT;

const createEnemyAt = (top = ENEMY_Y, velocityY = 0): Enemy => ({
  kind: 'HOPPING',
  position: { x: ENEMY_X, y: top },
  velocity: {
    x: { current: 0, max: 78 },
    y: { current: velocityY, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: ENEMY_X, y: top },
  statuses: { isFacingRight: true, isGrounded: true },
});

const createPlayerWithFeetAt = (
  feetY: number,
  left = ENEMY_X,
  velocityY = 400,
): Player => ({
  position: { x: left, y: feetY - PLAYER_HEIGHT },
  velocity: {
    x: { current: 0, max: 200 },
    y: { current: velocityY, max: 520 },
  },
  hearts: { value: 5 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});

const isStomping = (previous: Player, player: Player, enemy: Enemy): boolean =>
  isStompingEnemy(previous, player, enemy, DELTA_SECONDS);

describe('isStompingEnemy', () => {
  it('should kill the enemy when the falling player lands on it', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(HEAD - 10),
        createPlayerWithFeetAt(HEAD + 4),
        createEnemyAt(),
      ),
    ).toBe(true);
  });

  it('should kill the enemy when the player falls straight past it in a single tick', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(HEAD - 20),
        createPlayerWithFeetAt(FLOOR + 20, ENEMY_X, 1150),
        createEnemyAt(),
      ),
    ).toBe(true);
  });

  it('should kill the enemy when the player meets it a little way into its head', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(BELLY),
        createPlayerWithFeetAt(BELLY + 8),
        createEnemyAt(),
      ),
    ).toBe(true);
  });

  it('should kill the enemy when it hops up into the falling player', () => {
    const risen = ENEMY_JUMP_VELOCITY * DELTA_SECONDS;

    expect(
      isStomping(
        createPlayerWithFeetAt(HEAD + 6),
        createPlayerWithFeetAt(HEAD + 13),
        createEnemyAt(ENEMY_Y - risen, -ENEMY_JUMP_VELOCITY),
      ),
    ).toBe(true);
  });

  it('should kill the enemy when the very edge of the player clips it', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(HEAD - 6, ENEMY_X - 17),
        createPlayerWithFeetAt(HEAD + 2, ENEMY_X - 17),
        createEnemyAt(),
      ),
    ).toBe(true);
  });

  it('should spare the enemy when the player only walks into it from the same floor', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(FLOOR, ENEMY_X - 12, 0),
        createPlayerWithFeetAt(FLOOR, ENEMY_X - 10, 0),
        createEnemyAt(),
      ),
    ).toBe(false);
  });

  it('should spare the enemy when a player already sunk past its belly strikes it side-on', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(FLOOR),
        createPlayerWithFeetAt(FLOOR + 6),
        createEnemyAt(),
      ),
    ).toBe(false);
  });

  it('should spare the enemy when the player is rising into it from below', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(HEAD + 6, ENEMY_X, -400),
        createPlayerWithFeetAt(HEAD - 2, ENEMY_X, -400),
        createEnemyAt(),
      ),
    ).toBe(false);
  });

  it('should spare the enemy when it drops onto the player from above', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(FLOOR + 4),
        createPlayerWithFeetAt(FLOOR + 11),
        createEnemyAt(ENEMY_Y, 400),
      ),
    ).toBe(false);
  });

  it('should spare the enemy when it stands clear of the falling player', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(HEAD - 10, ENEMY_X - ENEMY_WIDTH * 2),
        createPlayerWithFeetAt(HEAD + 4, ENEMY_X - ENEMY_WIDTH * 2),
        createEnemyAt(),
      ),
    ).toBe(false);
  });

  it('should spare the enemy when the player has not reached it yet', () => {
    expect(
      isStomping(
        createPlayerWithFeetAt(HEAD - 40),
        createPlayerWithFeetAt(HEAD - 10),
        createEnemyAt(),
      ),
    ).toBe(false);
  });
});
