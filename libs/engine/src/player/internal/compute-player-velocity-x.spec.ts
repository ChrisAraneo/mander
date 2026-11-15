import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ICE,
  TILE_SAND,
  TILE_SIZE,
} from '@mander/model';
import { ceil, head, map, reduce, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SAND_MOVE_FACTOR } from '../../sand/consts';
import {
  ACCELERATION_SECONDS,
  COLD_MOVE_FACTOR,
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
  s: TILE_SAND,
};

const ROWS = ['......', '......', '##~~ss'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const FLOOR_ROW = 2;

const FLOOR_Y = FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT;

const HEARTS = 3;

const PRECISION = 10;

const MOVING_RIGHT = 1;

const MOVING_LEFT = -1;

const HOLDING_NOTHING = 0;

const STANDING_STILL = 0;

const HALF_SPEED = PLAYER_MAX_MOVE_VELOCITY / 2;

const HALF_STRETCH_SECONDS = ICE_ACCELERATION_SECONDS / 2;

const TURNAROUND_SECONDS = 2 * ICE_ACCELERATION_SECONDS;

const DELTA_SECONDS = 1 / 60;

const DIRT_X = 0;

const ICE_COLUMN = 2;

const ICE_X = ICE_COLUMN * TILE_SIZE;

const SAND_COLUMN = 4;

const SAND_X = SAND_COLUMN * TILE_SIZE;

const SAND_VELOCITY = PLAYER_MAX_MOVE_VELOCITY * SAND_MOVE_FACTOR;

const computeStep = (seconds: number): number =>
  (PLAYER_MAX_MOVE_VELOCITY / seconds) * DELTA_SECONDS;

const DIRT_STEP = computeStep(ACCELERATION_SECONDS);

const ICE_STEP = computeStep(ICE_ACCELERATION_SECONDS);

const createPlayer = (positionX: number, velocityX: number): Player => ({
  position: { x: positionX, y: FLOOR_Y },
  velocity: {
    x: { current: velocityX, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const computeSlideVelocityX = (
  positionX: number,
  direction: number,
  seconds: number,
  velocityX: number,
): number =>
  reduce(
    times(ceil(seconds / DELTA_SECONDS)),
    (current) =>
      computePlayerVelocityX(
        LEVEL,
        createPlayer(positionX, current),
        direction,
        DELTA_SECONDS,
      ),
    velocityX,
  );

describe('computePlayerVelocityX', () => {
  it('should only inch the player forward on the first tick when they set off on solid ground', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        createPlayer(DIRT_X, STANDING_STILL),
        MOVING_RIGHT,
        DELTA_SECONDS,
      ),
    ).toBeCloseTo(DIRT_STEP, PRECISION);
  });

  it('should only shave a sliver off the speed when they let go of the key on solid ground', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        createPlayer(DIRT_X, PLAYER_MAX_MOVE_VELOCITY),
        HOLDING_NOTHING,
        DELTA_SECONDS,
      ),
    ).toBeCloseTo(PLAYER_MAX_MOVE_VELOCITY - DIRT_STEP, PRECISION);
  });

  it('should bring the player up to full speed when they hold the key for a full stretch on solid ground', () => {
    expect(
      computeSlideVelocityX(
        DIRT_X,
        MOVING_RIGHT,
        ACCELERATION_SECONDS,
        STANDING_STILL,
      ),
    ).toBe(PLAYER_MAX_MOVE_VELOCITY);
  });

  it('should bring the player to a standstill when they let go for a full stretch on solid ground', () => {
    expect(
      computeSlideVelocityX(
        DIRT_X,
        HOLDING_NOTHING,
        ACCELERATION_SECONDS,
        PLAYER_MAX_MOVE_VELOCITY,
      ),
    ).toBe(0);
  });

  it('should only inch the player forward on the first tick when they set off on ice', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        createPlayer(ICE_X, STANDING_STILL),
        MOVING_RIGHT,
        DELTA_SECONDS,
      ),
    ).toBeCloseTo(ICE_STEP, PRECISION);
  });

  it('should only shave a sliver off the speed when they let go of the key on ice', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        createPlayer(ICE_X, PLAYER_MAX_MOVE_VELOCITY),
        HOLDING_NOTHING,
        DELTA_SECONDS,
      ),
    ).toBeCloseTo(PLAYER_MAX_MOVE_VELOCITY - ICE_STEP, PRECISION);
  });

  it('should give way under the player on ice when it holds firm on solid ground', () => {
    expect(ICE_STEP).toBeLessThan(DIRT_STEP);
  });

  it('should leave the player far short of full speed when they hold the key on ice for the stretch that runs them up to speed on solid ground', () => {
    expect(
      computeSlideVelocityX(
        ICE_X,
        MOVING_RIGHT,
        ACCELERATION_SECONDS,
        STANDING_STILL,
      ),
    ).toBeLessThan(HALF_SPEED);
  });

  it('should bring the player up to full speed when they hold the key for a full stretch on ice', () => {
    expect(
      computeSlideVelocityX(
        ICE_X,
        MOVING_RIGHT,
        ICE_ACCELERATION_SECONDS,
        STANDING_STILL,
      ),
    ).toBe(PLAYER_MAX_MOVE_VELOCITY);
  });

  it('should bring the player to a standstill when they let go for a full stretch on ice', () => {
    expect(
      computeSlideVelocityX(
        ICE_X,
        HOLDING_NOTHING,
        ICE_ACCELERATION_SECONDS,
        PLAYER_MAX_MOVE_VELOCITY,
      ),
    ).toBe(0);
  });

  it('should still be short of full speed when they are halfway through the stretch on ice', () => {
    expect(
      Math.abs(
        computeSlideVelocityX(
          ICE_X,
          MOVING_RIGHT,
          HALF_STRETCH_SECONDS,
          STANDING_STILL,
        ) - HALF_SPEED,
      ),
    ).toBeLessThanOrEqual(ICE_STEP);
  });

  it('should keep the player sliding when they hold no key on ice', () => {
    expect(
      Math.abs(
        computeSlideVelocityX(
          ICE_X,
          HOLDING_NOTHING,
          HALF_STRETCH_SECONDS,
          PLAYER_MAX_MOVE_VELOCITY,
        ) - HALF_SPEED,
      ),
    ).toBeLessThanOrEqual(ICE_STEP);
  });

  it('should take two stretches to turn the player around when they hold the other key on ice', () => {
    expect(
      computeSlideVelocityX(
        ICE_X,
        MOVING_LEFT,
        TURNAROUND_SECONDS,
        PLAYER_MAX_MOVE_VELOCITY,
      ),
    ).toBe(-PLAYER_MAX_MOVE_VELOCITY);
  });

  it('should bring the player up to 0.65 of full speed when they hold the key on sand', () => {
    expect(
      computeSlideVelocityX(
        SAND_X,
        MOVING_RIGHT,
        ACCELERATION_SECONDS,
        STANDING_STILL,
      ),
    ).toBeCloseTo(SAND_VELOCITY, PRECISION);
  });

  it('should slow the player to 0.65 of full speed when they run onto sand at full speed', () => {
    expect(
      computeSlideVelocityX(
        SAND_X,
        MOVING_RIGHT,
        ACCELERATION_SECONDS,
        PLAYER_MAX_MOVE_VELOCITY,
      ),
    ).toBeCloseTo(SAND_VELOCITY, PRECISION);
  });

  it('should move the player left at 0.65 of full speed when they hold the left key on sand', () => {
    expect(
      computeSlideVelocityX(
        SAND_X,
        MOVING_LEFT,
        ACCELERATION_SECONDS,
        STANDING_STILL,
      ),
    ).toBeCloseTo(-SAND_VELOCITY, PRECISION);
  });

  it('should bring the player to a standstill when they let go of the key on sand', () => {
    expect(
      computeSlideVelocityX(
        SAND_X,
        HOLDING_NOTHING,
        ACCELERATION_SECONDS,
        SAND_VELOCITY,
      ),
    ).toBe(0);
  });

  it('should keep the player at full speed when they are in the air above sand', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        {
          ...createPlayer(SAND_X, PLAYER_MAX_MOVE_VELOCITY),
          statuses: {
            isFacingRight: true,
            isGrounded: false,
            isJumpQueued: false,
          },
        },
        MOVING_RIGHT,
        DELTA_SECONDS,
      ),
    ).toBe(PLAYER_MAX_MOVE_VELOCITY);
  });

  it('should slow a cold player further when they walk on sand', () => {
    expect(
      computePlayerVelocityX(
        LEVEL,
        {
          ...createPlayer(
            SAND_X,
            PLAYER_MAX_MOVE_VELOCITY * COLD_MOVE_FACTOR * SAND_MOVE_FACTOR,
          ),
          timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 1 },
        },
        MOVING_RIGHT,
        DELTA_SECONDS,
      ),
    ).toBeCloseTo(
      PLAYER_MAX_MOVE_VELOCITY * COLD_MOVE_FACTOR * SAND_MOVE_FACTOR,
      PRECISION,
    );
  });
});
