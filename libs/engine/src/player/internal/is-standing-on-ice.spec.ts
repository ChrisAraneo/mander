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
import { isStandingOnIce } from './is-standing-on-ice';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '~': TILE_ICE,
};

const ROWS = ['....', '....', '##~~'];

const FLOOR_ROW = 2;

const HEARTS = 3;

const ICE_COLUMN = 2;

const DIRT_LEFT = 0;

const ICE_LEFT = ICE_COLUMN * TILE_SIZE;

const FOOTPRINT_OVERHANG = 6;

const PART_ON_ICE_LEFT = ICE_LEFT - FOOTPRINT_OVERHANG;

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

describe('isStandingOnIce', () => {
  it('should say the player is on ice when they stand on an ice block', () => {
    expect(isStandingOnIce(LEVEL, createStandingPlayer(ICE_LEFT))).toBe(true);
  });

  it('should say the player is not on ice when they stand on another kind of block', () => {
    expect(isStandingOnIce(LEVEL, createStandingPlayer(DIRT_LEFT))).toBe(false);
  });

  it('should say the player is on ice when only part of their footprint rests on it', () => {
    expect(isStandingOnIce(LEVEL, createStandingPlayer(PART_ON_ICE_LEFT))).toBe(
      true,
    );
  });

  it('should leave the player it was handed untouched when it looks underfoot', () => {
    const player = createStandingPlayer(ICE_LEFT);

    isStandingOnIce(LEVEL, player);

    expect(player).toEqual(createStandingPlayer(ICE_LEFT));
  });
});
