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
import { computePlayerAccelerationSeconds } from './compute-player-acceleration-seconds';

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

describe('computePlayerAccelerationSeconds', () => {
  it('should give the short stretch when the player stands on solid ground', () => {
    expect(
      computePlayerAccelerationSeconds(LEVEL, createStandingPlayer(DIRT_LEFT)),
    ).toBe(ACCELERATION_SECONDS);
  });

  it('should give the long stretch when the player stands on ice', () => {
    expect(
      computePlayerAccelerationSeconds(LEVEL, createStandingPlayer(ICE_LEFT)),
    ).toBe(ICE_ACCELERATION_SECONDS);
  });

  it('should leave the player it was handed untouched when it works out the stretch', () => {
    const player = createStandingPlayer(ICE_LEFT);

    computePlayerAccelerationSeconds(LEVEL, player);

    expect(player).toEqual(createStandingPlayer(ICE_LEFT));
  });
});
