import {
  MAX_TICK_SECONDS,
  type Snowball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../state/types/game-level';
import { SNOWBALL_SIZE, SNOWBALL_SPEED } from './consts';
import { nextSnowballs } from './next-snowballs';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['..........', '..........', '##########'];

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(ROWS);

const LEVEL_RIGHT_EDGE = size(head(ROWS)) * TILE_SIZE;

const DELTA_SECONDS = 0.02;

const LONG_DELTA_SECONDS = 10;

const FLYING_RIGHT_X = 100;

const FLYING_LEFT_X = 200;

const RESTING_X = 50;

const A_STEP_BEYOND_THE_EDGE = 1;

const PAST_THE_LEFT_EDGE_X = -SNOWBALL_SIZE - A_STEP_BEYOND_THE_EDGE;

const PAST_THE_RIGHT_EDGE_X = LEVEL_RIGHT_EDGE + A_STEP_BEYOND_THE_EDGE;

const NO_SPEED = 0;

const EXPECTED_SNOWBALLS = 2;

const PRECISION = 6;

const createSnowball = (left: number, speed: number): Snowball => ({
  position: { x: left, y: TILE_SIZE },
  velocity: { x: { current: speed, max: SNOWBALL_SPEED } },
});

const computePositions = (snowballs: Snowball[]): number[] =>
  map(snowballs, (snowball) => snowball.position.x);

describe('nextSnowballs', () => {
  it('should move every snowball along by its speed when time passes', () => {
    const snowballs = [
      createSnowball(FLYING_RIGHT_X, SNOWBALL_SPEED),
      createSnowball(FLYING_LEFT_X, -SNOWBALL_SPEED),
    ];

    const advanced = nextSnowballs(snowballs, LEVEL, DELTA_SECONDS);

    expect(size(advanced)).toBe(EXPECTED_SNOWBALLS);
    expect(advanced[0].position.x).toBeCloseTo(
      FLYING_RIGHT_X + SNOWBALL_SPEED * DELTA_SECONDS,
      PRECISION,
    );
    expect(advanced[1].position.x).toBeCloseTo(
      FLYING_LEFT_X - SNOWBALL_SPEED * DELTA_SECONDS,
      PRECISION,
    );
    expect(advanced[0].position.y).toBe(TILE_SIZE);
    expect(advanced[0].velocity).toEqual(snowballs[0].velocity);
  });

  it('should move a snowball only as far as the longest tick when a long time passes', () => {
    const snowball = createSnowball(FLYING_RIGHT_X, SNOWBALL_SPEED);

    const advanced = nextSnowballs([snowball], LEVEL, LONG_DELTA_SECONDS);

    expect(advanced[0].position.x).toBeCloseTo(
      FLYING_RIGHT_X + SNOWBALL_SPEED * MAX_TICK_SECONDS,
      PRECISION,
    );
  });

  it('should drop a snowball when it has flown out past the left of the level', () => {
    const snowballs = [
      createSnowball(PAST_THE_LEFT_EDGE_X, NO_SPEED),
      createSnowball(RESTING_X, NO_SPEED),
    ];

    const advanced = nextSnowballs(snowballs, LEVEL, DELTA_SECONDS);

    expect(computePositions(advanced)).toEqual([RESTING_X]);
  });

  it('should drop a snowball when it has flown out past the right of the level', () => {
    const snowballs = [
      createSnowball(PAST_THE_RIGHT_EDGE_X, NO_SPEED),
      createSnowball(RESTING_X, NO_SPEED),
    ];

    const advanced = nextSnowballs(snowballs, LEVEL, DELTA_SECONDS);

    expect(computePositions(advanced)).toEqual([RESTING_X]);
  });

  it('should give back nothing when there are no snowballs in the air', () => {
    expect(nextSnowballs([], LEVEL, DELTA_SECONDS)).toEqual([]);
  });

  it('should leave the given snowballs alone when they move', () => {
    const snowballs = [createSnowball(FLYING_RIGHT_X, SNOWBALL_SPEED)];

    nextSnowballs(snowballs, LEVEL, DELTA_SECONDS);

    expect(snowballs).toEqual([createSnowball(FLYING_RIGHT_X, SNOWBALL_SPEED)]);
  });
});
