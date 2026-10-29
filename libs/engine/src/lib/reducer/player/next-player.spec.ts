import {
  GRAVITY,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import type { InputState } from '../../types/input-state';
import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import { nextPlayer } from './next-player';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = [
  '..........',
  '..........',
  '..........',
  '..........',
  '.........#',
  '##########',
];

const LEVEL: GameLevel = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const DELTA_SECONDS = 0.03125;

const NO_INPUT: InputState = { isLeft: false, isRight: false, isJump: false };

const RIGHT_INPUT: InputState = { isLeft: false, isRight: true, isJump: false };

const LEFT_INPUT: InputState = { isLeft: true, isRight: false, isJump: false };

const BOTH_INPUT: InputState = { isLeft: true, isRight: true, isJump: false };

const JUMP_INPUT: InputState = { isLeft: false, isRight: false, isJump: true };

const createStandingPlayer = (
  left: number,
  isFacingRight: boolean,
): Player => ({
  position: { x: left, y: 112 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight, isGrounded: true, isJumpQueued: false },
});

const createAirbornePlayer = (
  top: number,
  velocityY: number,
  isJumpQueued: boolean,
): Player => ({
  position: { x: 100, y: top },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: velocityY, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued },
});

describe('nextPlayer', () => {
  it('should walk the player right at full speed when only right is held', () => {
    const player = createStandingPlayer(100, false);

    const stepped = nextPlayer(LEVEL, player, RIGHT_INPUT, DELTA_SECONDS);

    expect(stepped.position).toEqual({ x: 106.5625, y: 112 });
    expect(stepped.velocity.x.current).toBe(PLAYER_MAX_MOVE_VELOCITY);
    expect(stepped.statuses.isFacingRight).toBe(true);
  });

  it('should walk the player left at full speed when only left is held', () => {
    const player = createStandingPlayer(100, true);

    const stepped = nextPlayer(LEVEL, player, LEFT_INPUT, DELTA_SECONDS);

    expect(stepped.position).toEqual({ x: 93.4375, y: 112 });
    expect(stepped.velocity.x.current).toBe(-PLAYER_MAX_MOVE_VELOCITY);
    expect(stepped.statuses.isFacingRight).toBe(false);
  });

  it('should keep the player still and facing the same way when both directions are held', () => {
    const player = createStandingPlayer(100, false);

    const stepped = nextPlayer(LEVEL, player, BOTH_INPUT, DELTA_SECONDS);

    expect(stepped.position).toEqual({ x: 100, y: 112 });
    expect(stepped.velocity.x.current).toBe(0);
    expect(stepped.statuses.isFacingRight).toBe(false);
  });

  it('should keep the player still and facing the same way when no direction is held', () => {
    const player = createStandingPlayer(100, true);

    const stepped = nextPlayer(LEVEL, player, NO_INPUT, DELTA_SECONDS);

    expect(stepped.position).toEqual({ x: 100, y: 112 });
    expect(stepped.velocity.x.current).toBe(0);
    expect(stepped.statuses.isFacingRight).toBe(true);
    expect(stepped.statuses.isGrounded).toBe(true);
  });

  it('should launch the player upwards when the player stands on the ground and jump is held', () => {
    const player = createStandingPlayer(100, true);

    const stepped = nextPlayer(LEVEL, player, JUMP_INPUT, DELTA_SECONDS);

    expect(stepped.velocity.y.current).toBeCloseTo(
      -PLAYER_MAX_JUMP_VELOCITY + GRAVITY * DELTA_SECONDS,
      6,
    );
    expect(stepped.position.y).toBeCloseTo(
      112 + stepped.velocity.y.current * DELTA_SECONDS,
      6,
    );
    expect(stepped.statuses.isGrounded).toBe(false);
  });

  it('should launch the player upwards when the player stands on the ground with a jump queued', () => {
    const player = {
      ...createStandingPlayer(100, true),
      statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: true },
    };

    const stepped = nextPlayer(LEVEL, player, NO_INPUT, DELTA_SECONDS);

    expect(stepped.velocity.y.current).toBeCloseTo(
      -PLAYER_MAX_JUMP_VELOCITY + GRAVITY * 2.6 * DELTA_SECONDS,
      6,
    );
    expect(stepped.statuses.isGrounded).toBe(false);
  });

  it('should not jump when the player is in the air and jump is held', () => {
    const player = createAirbornePlayer(50, -300, false);

    const stepped = nextPlayer(LEVEL, player, JUMP_INPUT, DELTA_SECONDS);

    expect(stepped.velocity.y.current).toBe(-300 + GRAVITY * DELTA_SECONDS);
    expect(stepped.statuses.isGrounded).toBe(false);
  });

  it('should pull the player down harder when the player is rising without jump held', () => {
    const player = createAirbornePlayer(50, -300, false);

    const stepped = nextPlayer(LEVEL, player, NO_INPUT, DELTA_SECONDS);

    expect(stepped.velocity.y.current).toBeCloseTo(
      -300 + GRAVITY * 2.6 * DELTA_SECONDS,
      6,
    );
  });

  it('should pull the player down normally when the player is falling without jump held', () => {
    const player = createAirbornePlayer(50, 100, false);

    const stepped = nextPlayer(LEVEL, player, NO_INPUT, DELTA_SECONDS);

    expect(stepped.velocity.y.current).toBe(100 + GRAVITY * DELTA_SECONDS);
  });

  it('should stop the player against the wall when the player walks into it', () => {
    const player = createStandingPlayer(264, true);

    const stepped = nextPlayer(LEVEL, player, RIGHT_INPUT, DELTA_SECONDS);

    expect(stepped.position.x).toBe(266);
    expect(stepped.velocity.x.current).toBe(0);
  });

  it('should land the player on the floor when the player falls onto it', () => {
    const player = createAirbornePlayer(110, 100, false);

    const stepped = nextPlayer(LEVEL, player, NO_INPUT, DELTA_SECONDS);

    expect(stepped.position.y).toBe(112);
    expect(stepped.statuses.isGrounded).toBe(true);
    expect(stepped.velocity.y.current).toBe(0);
  });

  it('should clear the queued jump when the player cannot jump yet', () => {
    const player = createAirbornePlayer(50, -300, true);

    const stepped = nextPlayer(LEVEL, player, NO_INPUT, DELTA_SECONDS);

    expect(stepped.statuses.isJumpQueued).toBe(false);
    expect(stepped.statuses.isGrounded).toBe(false);
  });

  it('should keep the hearts and timers of the player when the player moves', () => {
    const player = createStandingPlayer(100, true);

    const stepped = nextPlayer(LEVEL, player, RIGHT_INPUT, DELTA_SECONDS);

    expect(stepped.hearts).toBe(player.hearts);
    expect(stepped.timers).toBe(player.timers);
  });

  it('should leave the given player unchanged when the player moves', () => {
    const player = createStandingPlayer(100, true);

    nextPlayer(LEVEL, player, RIGHT_INPUT, DELTA_SECONDS);

    expect(player).toEqual(createStandingPlayer(100, true));
  });
});
