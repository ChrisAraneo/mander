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
import { computePlayerWalk } from './compute-player-walk';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '.....#', '######'];

const PRECISION = 6;

const HEARTS = 3;

const PLAYER_TOP = 40;

const OPEN_LEFT = 40;

const BESIDE_WALL_LEFT = 130;

const TICK_SECONDS = 0.04;

const RUN_SPEED = 210;

const STOPPED_SPEED = 0;

const WALK_RIGHT_LEFT = 48.4;

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

describe('computePlayerWalk', () => {
  it('should walk the player the whole way when nothing is in the way', () => {
    const walk = computePlayerWalk(
      LEVEL,
      createRunningPlayer(OPEN_LEFT),
      TICK_SECONDS,
      RUN_SPEED,
    );

    expect(walk.nextX).toBeCloseTo(WALK_RIGHT_LEFT, PRECISION);
    expect(walk.blockedVelocityX).toBe(RUN_SPEED);
  });

  it('should stop the player flush against the wall when a solid tile is in the way', () => {
    const walk = computePlayerWalk(
      LEVEL,
      createRunningPlayer(BESIDE_WALL_LEFT),
      TICK_SECONDS,
      RUN_SPEED,
    );

    expect(walk.nextX).toBe(FLUSH_WITH_WALL_LEFT);
    expect(walk.blockedVelocityX).toBe(STOPPED_SPEED);
  });

  it('should leave the player where they are when they are standing still', () => {
    const walk = computePlayerWalk(
      LEVEL,
      createRunningPlayer(OPEN_LEFT),
      TICK_SECONDS,
      STOPPED_SPEED,
    );

    expect(walk.nextX).toBe(OPEN_LEFT);
    expect(walk.blockedVelocityX).toBe(STOPPED_SPEED);
  });

  it('should leave the player it was handed untouched when it walks them on', () => {
    const player = createRunningPlayer(OPEN_LEFT);

    computePlayerWalk(LEVEL, player, TICK_SECONDS, RUN_SPEED);

    expect(player).toEqual(createRunningPlayer(OPEN_LEFT));
  });
});
