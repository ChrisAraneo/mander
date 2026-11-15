import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ICE,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  ACCELERATION_SECONDS,
  ICE_ACCELERATION_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from '../consts';
import { computePlayerVelocityStep } from './compute-player-velocity-step';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '~': TILE_ICE,
};

const ROWS = ['....', '....', '##~~'];

const FLOOR_ROW = 2;

const ICE_COLUMN = 2;

const HEARTS = 3;

const DIRT_LEFT = 0;

const ICE_LEFT = ICE_COLUMN * TILE_SIZE;

const FLOOR_Y = FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT;

const DELTA_SECONDS = 1 / 60;

const HALF_DELTA_SECONDS = DELTA_SECONDS / 2;

const NO_TIME = 0;

const PRECISION = 10;

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const createStandingPlayer = (positionX: number): Player => ({
  position: { x: positionX, y: FLOOR_Y },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('computePlayerVelocityStep', () => {
  it('should cover the full speed over the short stretch when the player stands on solid ground', () => {
    expect(
      computePlayerVelocityStep(
        LEVEL,
        createStandingPlayer(DIRT_LEFT),
        DELTA_SECONDS,
      ),
    ).toBeCloseTo(
      (PLAYER_MAX_MOVE_VELOCITY / ACCELERATION_SECONDS) * DELTA_SECONDS,
      PRECISION,
    );
  });

  it('should take a smaller step when the player stands on ice', () => {
    expect(
      computePlayerVelocityStep(
        LEVEL,
        createStandingPlayer(ICE_LEFT),
        DELTA_SECONDS,
      ),
    ).toBeCloseTo(
      (PLAYER_MAX_MOVE_VELOCITY / ICE_ACCELERATION_SECONDS) * DELTA_SECONDS,
      PRECISION,
    );
  });

  it('should halve the step when only half a frame has passed', () => {
    expect(
      computePlayerVelocityStep(
        LEVEL,
        createStandingPlayer(DIRT_LEFT),
        HALF_DELTA_SECONDS,
      ),
    ).toBeCloseTo(
      computePlayerVelocityStep(
        LEVEL,
        createStandingPlayer(DIRT_LEFT),
        DELTA_SECONDS,
      ) / 2,
      PRECISION,
    );
  });

  it('should take no step when no time has passed', () => {
    expect(
      computePlayerVelocityStep(
        LEVEL,
        createStandingPlayer(DIRT_LEFT),
        NO_TIME,
      ),
    ).toBe(0);
  });

  it('should leave the player it was handed untouched when it works out the step', () => {
    const player = createStandingPlayer(ICE_LEFT);

    computePlayerVelocityStep(LEVEL, player, DELTA_SECONDS);

    expect(player).toEqual(createStandingPlayer(ICE_LEFT));
  });
});
