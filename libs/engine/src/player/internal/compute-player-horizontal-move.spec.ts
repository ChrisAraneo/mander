import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { computePlayerHorizontalMove } from './compute-player-horizontal-move';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '.....#', '######'];

const PRECISION = 6;

const HEARTS = 3;

const PLAYER_TOP = 40;

const OPEN_LEFT = 40;

const BESIDE_WALL_LEFT = 130;

const TICK_SECONDS = 0.04;

const RUN_SPEED = 210;

const STANDING_STILL = 0;

const RUN_RIGHT_LEFT = 48.4;

const RUN_LEFT_LEFT = 31.6;

const FLUSH_WITH_WALL_LEFT = 138;

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const createRunningPlayer = (positionX: number): Player => ({
  position: { x: positionX, y: PLAYER_TOP },
  velocity: createBasePlayerVelocity(),
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('computePlayerHorizontalMove', () => {
  it('should move the player the whole way when nothing is in the way', () => {
    const move = computePlayerHorizontalMove(
      LEVEL,
      createRunningPlayer(OPEN_LEFT),
      TICK_SECONDS,
      RUN_SPEED,
    );

    expect(move.position).toBeCloseTo(RUN_RIGHT_LEFT, PRECISION);
    expect(move.isBlocked).toBe(false);
  });

  it('should move the player to the left when the speed is below zero', () => {
    const move = computePlayerHorizontalMove(
      LEVEL,
      createRunningPlayer(OPEN_LEFT),
      TICK_SECONDS,
      -RUN_SPEED,
    );

    expect(move.position).toBeCloseTo(RUN_LEFT_LEFT, PRECISION);
    expect(move.isBlocked).toBe(false);
  });

  it('should stop the player flush against the wall when a solid tile is in the way', () => {
    const move = computePlayerHorizontalMove(
      LEVEL,
      createRunningPlayer(BESIDE_WALL_LEFT),
      TICK_SECONDS,
      RUN_SPEED,
    );

    expect(move.position).toBe(FLUSH_WITH_WALL_LEFT);
    expect(move.isBlocked).toBe(true);
  });

  it('should leave the player where they are when the speed is zero', () => {
    const move = computePlayerHorizontalMove(
      LEVEL,
      createRunningPlayer(OPEN_LEFT),
      TICK_SECONDS,
      STANDING_STILL,
    );

    expect(move.position).toBe(OPEN_LEFT);
    expect(move.isBlocked).toBe(false);
  });

  it('should leave the player it was handed untouched when it works out the move', () => {
    const player = createRunningPlayer(OPEN_LEFT);

    computePlayerHorizontalMove(LEVEL, player, TICK_SECONDS, RUN_SPEED);

    expect(player).toEqual(createRunningPlayer(OPEN_LEFT));
  });
});
