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

const FLOOR_ROW = 2;

const FLOOR_Y = FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT;

const HEARTS = 3;

const ICE_COLUMN = 2;

const DIRT_LEFT = 0;

const ICE_LEFT = ICE_COLUMN * TILE_SIZE;

const FOOTPRINT_OVERHANG = 6;

const PART_ON_ICE_LEFT = ICE_LEFT - FOOTPRINT_OVERHANG;

const PAST_LEVEL_COLUMN = 40;

const PAST_LEVEL_LEFT = PAST_LEVEL_COLUMN * TILE_SIZE;

const createStandingPlayer = (
  positionX: number,
  isGrounded: boolean,
): Player => ({
  position: { x: positionX, y: FLOOR_Y },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded, isJumpQueued: false },
});

describe('isOnIce', () => {
  it('should put the player on ice when they stand on an ice block', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(ICE_LEFT, true))).toBe(true);
  });

  it('should not put the player on ice when they stand on another kind of block', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(DIRT_LEFT, true))).toBe(false);
  });

  it('should put the player on ice when only part of their footprint rests on ice', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(PART_ON_ICE_LEFT, true))).toBe(
      true,
    );
  });

  it('should not put the player on ice when they are in the air above it', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(ICE_LEFT, false))).toBe(false);
  });

  it('should not put the player on ice when they stand past the edge of the level', () => {
    expect(isOnIce(LEVEL, createStandingPlayer(PAST_LEVEL_LEFT, true))).toBe(
      false,
    );
  });

  it('should leave the player it was handed untouched when it looks underfoot', () => {
    const player = createStandingPlayer(ICE_LEFT, true);

    isOnIce(LEVEL, player);

    expect(player).toEqual(createStandingPlayer(ICE_LEFT, true));
  });
});
