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
  PLAYER_HEIGHT,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from '../consts';
import { isOnIce } from './is-on-ice';

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

const createStandingPlayer = (x: number, isGrounded: boolean): Player => ({
  position: { x, y: FLOOR_Y },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded, isJumpQueued: false },
});

describe('isOnIce', () => {
  it('should put the player on ice when they stand on an ice block', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(2 * TILE_SIZE, true))).toBe(
      true,
    );
  });

  it('should not put the player on ice when they stand on another kind of block', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(0, true))).toBe(false);
  });

  it('should put the player on ice when only part of their footprint rests on ice', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(2 * TILE_SIZE - 6, true))).toBe(
      true,
    );
  });

  it('should not put the player on ice when they are in the air above it', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(2 * TILE_SIZE, false))).toBe(
      false,
    );
  });

  it('should not put the player on ice when they stand past the edge of the level', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(40 * TILE_SIZE, true))).toBe(
      false,
    );
  });
});
