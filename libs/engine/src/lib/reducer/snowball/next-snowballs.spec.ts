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

import type { GameLevel } from '../../types/game-level';
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

const createSnowball = (start: number, speed: number): Snowball => ({
  position: { x: start, y: TILE_SIZE },
  velocity: { x: { current: speed, max: SNOWBALL_SPEED } },
});

const computePositions = (snowballs: Snowball[]): number[] =>
  map(snowballs, (snowball) => snowball.position.x);

describe('nextSnowballs', () => {
  it('should move every snowball along by its speed when time passes', () => {
    const snowballs = [
      createSnowball(100, SNOWBALL_SPEED),
      createSnowball(200, -SNOWBALL_SPEED),
    ];

    const advanced = nextSnowballs(LEVEL, snowballs, 0.02);

    expect(size(advanced)).toBe(2);
    expect(advanced[0].position.x).toBeCloseTo(100 + SNOWBALL_SPEED * 0.02, 6);
    expect(advanced[1].position.x).toBeCloseTo(200 - SNOWBALL_SPEED * 0.02, 6);
    expect(advanced[0].position.y).toBe(TILE_SIZE);
    expect(advanced[0].velocity).toEqual(snowballs[0].velocity);
  });

  it('should move a snowball only as far as the longest tick when a long time passes', () => {
    const snowball = createSnowball(100, SNOWBALL_SPEED);

    const advanced = nextSnowballs(LEVEL, [snowball], 10);

    expect(advanced[0].position.x).toBeCloseTo(
      100 + SNOWBALL_SPEED * MAX_TICK_SECONDS,
      6,
    );
  });

  it('should drop a snowball when it has flown out past the left of the level', () => {
    const snowballs = [
      createSnowball(-SNOWBALL_SIZE - 1, 0),
      createSnowball(50, 0),
    ];

    const advanced = nextSnowballs(LEVEL, snowballs, 0.02);

    expect(computePositions(advanced)).toEqual([50]);
  });

  it('should drop a snowball when it has flown out past the right of the level', () => {
    const snowballs = [
      createSnowball(LEVEL_RIGHT_EDGE + 1, 0),
      createSnowball(50, 0),
    ];

    const advanced = nextSnowballs(LEVEL, snowballs, 0.02);

    expect(computePositions(advanced)).toEqual([50]);
  });

  it('should give back nothing when there are no snowballs in the air', () => {
    expect(nextSnowballs(LEVEL, [], 0.02)).toEqual([]);
  });

  it('should leave the given snowballs alone when they move', () => {
    const snowballs = [createSnowball(100, SNOWBALL_SPEED)];

    nextSnowballs(LEVEL, snowballs, 0.02);

    expect(snowballs[0].position.x).toBe(100);
  });
});
