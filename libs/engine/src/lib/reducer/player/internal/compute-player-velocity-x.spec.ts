import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ICE,
  TILE_SIZE,
} from '@mander/model';
import { head, map, reduce, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  ACCELERATION_SECONDS,
  ICE_ACCELERATION_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from '../consts';
import { computePlayerVelocityX } from './compute-player-velocity-x';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '~': TILE_ICE,
};

const ROWS = ['....', '....', '##~~'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const FLOOR_Y = 2 * TILE_SIZE - PLAYER_HEIGHT;

const TICK = 1 / 60;

const DIRT_X = 0;

const ICE_X = 2 * TILE_SIZE;

const toStep = (seconds: number): number =>
  (PLAYER_MAX_MOVE_VELOCITY / seconds) * TICK;

const DIRT_STEP = toStep(ACCELERATION_SECONDS);

const ICE_STEP = toStep(ICE_ACCELERATION_SECONDS);

const createPlayer = (x: number, velocityX: number): Player => ({
  position: { x, y: FLOOR_Y },
  velocity: {
    x: { current: velocityX, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const slide = (
  x: number,
  direction: number,
  seconds: number,
  velocityX: number,
): number =>
  reduce(
    times(Math.ceil(seconds / TICK)),
    (current) =>
      computePlayerVelocityX(LEVEL, createPlayer(x, current), direction, TICK),
    velocityX,
  );

describe('computePlayerVelocityX', () => {
  it('should only inch the player forward on the first tick when they set off on solid ground', () => {
    expect(
      computePlayerVelocityX(LEVEL, createPlayer(DIRT_X, 0), 1, TICK),
    ).toBeCloseTo(DIRT_STEP, 10);
  });

  it('should only shave a sliver off the speed when they let go of the key on solid ground', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        createPlayer(DIRT_X, PLAYER_MAX_MOVE_VELOCITY),
        0,
        TICK,
      ),
    ).toBeCloseTo(PLAYER_MAX_MOVE_VELOCITY - DIRT_STEP, 10);
  });

  it('should bring the player up to full speed after a full stretch of holding the key on solid ground', () => {
    expect(slide(DIRT_X, 1, ACCELERATION_SECONDS, 0)).toBe(
      PLAYER_MAX_MOVE_VELOCITY,
    );
  });

  it('should bring the player to a standstill after a full stretch of letting go on solid ground', () => {
    expect(
      slide(DIRT_X, 0, ACCELERATION_SECONDS, PLAYER_MAX_MOVE_VELOCITY),
    ).toBe(0);
  });

  it('should only inch the player forward on the first tick when they set off on ice', () => {
    expect(
      computePlayerVelocityX(LEVEL, createPlayer(ICE_X, 0), 1, TICK),
    ).toBeCloseTo(ICE_STEP, 10);
  });

  it('should only shave a sliver off the speed when they let go of the key on ice', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        createPlayer(ICE_X, PLAYER_MAX_MOVE_VELOCITY),
        0,
        TICK,
      ),
    ).toBeCloseTo(PLAYER_MAX_MOVE_VELOCITY - ICE_STEP, 10);
  });

  it('should give way under the player on ice when it holds firm on solid ground', () => {
    expect(ICE_STEP).toBeLessThan(DIRT_STEP);
  });

  it('should leave the player far short of full speed on ice over a stretch that runs them up to speed on solid ground', () => {
    expect(slide(ICE_X, 1, ACCELERATION_SECONDS, 0)).toBeLessThan(
      PLAYER_MAX_MOVE_VELOCITY / 2,
    );
  });

  it('should bring the player up to full speed after a full stretch of holding the key on ice', () => {
    expect(slide(ICE_X, 1, ICE_ACCELERATION_SECONDS, 0)).toBe(
      PLAYER_MAX_MOVE_VELOCITY,
    );
  });

  it('should bring the player to a standstill after a full stretch of letting go on ice', () => {
    expect(
      slide(ICE_X, 0, ICE_ACCELERATION_SECONDS, PLAYER_MAX_MOVE_VELOCITY),
    ).toBe(0);
  });

  it('should still be short of full speed halfway through the stretch on ice', () => {
    expect(
      Math.abs(
        slide(ICE_X, 1, ICE_ACCELERATION_SECONDS / 2, 0) -
          PLAYER_MAX_MOVE_VELOCITY / 2,
      ),
    ).toBeLessThanOrEqual(ICE_STEP);
  });

  it('should keep the player sliding when they hold no key on ice', () => {
    expect(
      Math.abs(
        slide(
          ICE_X,
          0,
          ICE_ACCELERATION_SECONDS / 2,
          PLAYER_MAX_MOVE_VELOCITY,
        ) -
          PLAYER_MAX_MOVE_VELOCITY / 2,
      ),
    ).toBeLessThanOrEqual(ICE_STEP);
  });

  it('should take two stretches to turn the player around on ice', () => {
    expect(
      slide(ICE_X, -1, 2 * ICE_ACCELERATION_SECONDS, PLAYER_MAX_MOVE_VELOCITY),
    ).toBe(-PLAYER_MAX_MOVE_VELOCITY);
  });
});
