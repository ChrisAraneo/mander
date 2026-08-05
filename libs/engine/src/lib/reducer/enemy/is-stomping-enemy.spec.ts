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

const enemyAt = (y = ENEMY_Y, vy = 0): Enemy => ({
  kind: 'HOPPING',
  position: { x: ENEMY_X, y },
  velocity: {
    x: { current: 0, max: 78 },
    y: { current: vy, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: null },
  spawn: { x: ENEMY_X, y },
  statuses: { isFacingRight: true, isGrounded: true },
});

const playerWithFeetAt = (feetY: number, x = ENEMY_X, vy = 400): Player => ({
  position: { x, y: feetY - PLAYER_HEIGHT },
  velocity: {
    x: { current: 0, max: 200 },
    y: { current: vy, max: 520 },
  },
  hearts: { value: 5 },
  timers: { death: null, invincibility: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});

const stomps = (previous: Player, player: Player, enemy: Enemy): boolean =>
  isStompingEnemy(previous, player, enemy, DELTA_SECONDS);

describe('isStompingEnemy', () => {
  const head = ENEMY_Y + ENEMY_HITBOX_INSET;
  const belly = ENEMY_Y + ENEMY_HEIGHT / 2;
  const floor = ENEMY_Y + ENEMY_HEIGHT;

  it('kills an enemy the falling player lands on', () => {
    expect(
      stomps(
        playerWithFeetAt(head - 10),
        playerWithFeetAt(head + 4),
        enemyAt(),
      ),
    ).toBe(true);
  });

  it('kills an enemy the player fell straight past in a single tick', () => {
    expect(
      stomps(
        playerWithFeetAt(head - 20),
        playerWithFeetAt(floor + 20, ENEMY_X, 1150),
        enemyAt(),
      ),
    ).toBe(true);
  });

  it('kills an enemy the player met a little way into its head', () => {
    expect(
      stomps(playerWithFeetAt(belly), playerWithFeetAt(belly + 8), enemyAt()),
    ).toBe(true);
  });

  it('kills an enemy that hopped up into the falling player', () => {
    const risen = ENEMY_JUMP_VELOCITY * DELTA_SECONDS;
    expect(
      stomps(
        playerWithFeetAt(head + 6),
        playerWithFeetAt(head + 13),
        enemyAt(ENEMY_Y - risen, -ENEMY_JUMP_VELOCITY),
      ),
    ).toBe(true);
  });

  it('kills an enemy clipped by the very edge of the player', () => {
    expect(
      stomps(
        playerWithFeetAt(head - 6, ENEMY_X - 17),
        playerWithFeetAt(head + 2, ENEMY_X - 17),
        enemyAt(),
      ),
    ).toBe(true);
  });

  it('spares an enemy the player only walks into, standing on the same floor', () => {
    expect(
      stomps(
        playerWithFeetAt(floor, ENEMY_X - 12, 0),
        playerWithFeetAt(floor, ENEMY_X - 10, 0),
        enemyAt(),
      ),
    ).toBe(false);
  });

  it('spares an enemy struck side-on by a player already sunk past its belly', () => {
    expect(
      stomps(playerWithFeetAt(floor), playerWithFeetAt(floor + 6), enemyAt()),
    ).toBe(false);
  });

  it('spares an enemy the player is rising into from below', () => {
    expect(
      stomps(
        playerWithFeetAt(head + 6, ENEMY_X, -400),
        playerWithFeetAt(head - 2, ENEMY_X, -400),
        enemyAt(),
      ),
    ).toBe(false);
  });

  it('spares an enemy dropping onto the player from above', () => {
    expect(
      stomps(
        playerWithFeetAt(floor + 4),
        playerWithFeetAt(floor + 11),
        enemyAt(ENEMY_Y, 400),
      ),
    ).toBe(false);
  });

  it('spares an enemy standing clear of the falling player', () => {
    expect(
      stomps(
        playerWithFeetAt(head - 10, ENEMY_X - ENEMY_WIDTH * 2),
        playerWithFeetAt(head + 4, ENEMY_X - ENEMY_WIDTH * 2),
        enemyAt(),
      ),
    ).toBe(false);
  });

  it('spares an enemy the player has not reached yet', () => {
    expect(
      stomps(
        playerWithFeetAt(head - 40),
        playerWithFeetAt(head - 10),
        enemyAt(),
      ),
    ).toBe(false);
  });
});
