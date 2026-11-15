import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SAND,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SAND_MOVE_FACTOR } from '../../sand/consts';
import {
  COLD_MOVE_FACTOR,
  COLD_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from '../consts';
import { computePlayerMoveSpeed } from './compute-player-move-speed';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  ':': TILE_SAND,
};

const ROWS = ['....', '....', '##::'];

const FLOOR_ROW = 2;

const SAND_COLUMN = 2;

const HEARTS = 3;

const NO_COLD = 0;

const DIRT_LEFT = 0;

const SAND_LEFT = SAND_COLUMN * TILE_SIZE;

const FLOOR_Y = FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT;

const PRECISION = 10;

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const createStandingPlayer = (
  positionX: number,
  coldSeconds: number,
): Player => ({
  position: { x: positionX, y: FLOOR_Y },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: {
    death: null,
    invincibility: 0,
    star: 0,
    hurt: 0,
    cold: coldSeconds,
  },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('computePlayerMoveSpeed', () => {
  it('should let the player run at full speed when they stand on solid ground', () => {
    expect(
      computePlayerMoveSpeed(LEVEL, createStandingPlayer(DIRT_LEFT, NO_COLD)),
    ).toBe(PLAYER_MAX_MOVE_VELOCITY);
  });

  it('should slow the player down when they stand on sand', () => {
    expect(
      computePlayerMoveSpeed(LEVEL, createStandingPlayer(SAND_LEFT, NO_COLD)),
    ).toBeCloseTo(PLAYER_MAX_MOVE_VELOCITY * SAND_MOVE_FACTOR, PRECISION);
  });

  it('should slow the player down when they are cold', () => {
    expect(
      computePlayerMoveSpeed(
        LEVEL,
        createStandingPlayer(DIRT_LEFT, COLD_SECONDS),
      ),
    ).toBeCloseTo(PLAYER_MAX_MOVE_VELOCITY * COLD_MOVE_FACTOR, PRECISION);
  });

  it('should slow the player down twice over when they are cold on sand', () => {
    expect(
      computePlayerMoveSpeed(
        LEVEL,
        createStandingPlayer(SAND_LEFT, COLD_SECONDS),
      ),
    ).toBeCloseTo(
      PLAYER_MAX_MOVE_VELOCITY * COLD_MOVE_FACTOR * SAND_MOVE_FACTOR,
      PRECISION,
    );
  });

  it('should leave the player it was handed untouched when it works out the speed', () => {
    const player = createStandingPlayer(SAND_LEFT, COLD_SECONDS);

    computePlayerMoveSpeed(LEVEL, player);

    expect(player).toEqual(createStandingPlayer(SAND_LEFT, COLD_SECONDS));
  });
});
