import {
  type Cannonball,
  MAX_TICK_SECONDS,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { CANNONBALL_SIZE, CANNONBALL_SPEED } from './consts';
import { nextCannonballs } from './next-cannonballs';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['..........', '..........', '##########'];

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(ROWS);

const LEVEL_RIGHT_EDGE = size(head(ROWS)) * TILE_SIZE;

const createCannonball = (start: number, speed: number): Cannonball => ({
  position: { x: start, y: TILE_SIZE },
  velocity: { x: { current: speed, max: CANNONBALL_SPEED } },
});

const createCannonballs = (): Cannonball[] => [
  createCannonball(100, CANNONBALL_SPEED),
  createCannonball(200, -CANNONBALL_SPEED),
];

const computePositions = (cannonballs: Cannonball[]): number[] =>
  map(cannonballs, (cannonball) => cannonball.position.x);

describe('nextCannonballs', () => {
  it('should move every cannonball along by its speed when time passes', () => {
    const cannonballs = createCannonballs();

    const advanced = nextCannonballs(LEVEL, cannonballs, 0.02);

    expect(size(advanced)).toBe(2);
    expect(advanced[0].position.x).toBeCloseTo(104.4, 6);
    expect(advanced[1].position.x).toBeCloseTo(195.6, 6);
    expect(advanced[0].position.y).toBe(TILE_SIZE);
    expect(advanced[0].velocity).toEqual(cannonballs[0].velocity);
  });

  it('should move a cannonball only as far as the longest tick when a long time passes', () => {
    const cannonball = createCannonball(100, CANNONBALL_SPEED);

    const advanced = nextCannonballs(LEVEL, [cannonball], 10);

    expect(advanced[0].position.x).toBeCloseTo(
      100 + CANNONBALL_SPEED * MAX_TICK_SECONDS,
      6,
    );
    expect(advanced[0].position.x).toBeCloseTo(108.8, 6);
  });

  it('should drop a cannonball when it has flown out past the left of the level', () => {
    const cannonballs = [
      createCannonball(-CANNONBALL_SIZE - 1, 0),
      createCannonball(50, 0),
    ];

    const advanced = nextCannonballs(LEVEL, cannonballs, 0.02);

    expect(computePositions(advanced)).toEqual([50]);
  });

  it('should keep a cannonball when only its far side is still inside the left of the level', () => {
    const cannonballs = [createCannonball(-CANNONBALL_SIZE, 0)];

    const advanced = nextCannonballs(LEVEL, cannonballs, 0.02);

    expect(computePositions(advanced)).toEqual([-CANNONBALL_SIZE]);
  });

  it('should drop a cannonball when it has flown out past the right of the level', () => {
    const cannonballs = [
      createCannonball(LEVEL_RIGHT_EDGE + 1, 0),
      createCannonball(50, 0),
    ];

    const advanced = nextCannonballs(LEVEL, cannonballs, 0.02);

    expect(computePositions(advanced)).toEqual([50]);
  });

  it('should keep a cannonball when it sits exactly on the right edge of the level', () => {
    const cannonballs = [createCannonball(LEVEL_RIGHT_EDGE, 0)];

    const advanced = nextCannonballs(LEVEL, cannonballs, 0.02);

    expect(computePositions(advanced)).toEqual([LEVEL_RIGHT_EDGE]);
  });

  it('should drop a cannonball when this move carries it out of the level', () => {
    const cannonballs = [
      createCannonball(LEVEL_RIGHT_EDGE - 1, CANNONBALL_SPEED),
    ];

    const advanced = nextCannonballs(LEVEL, cannonballs, 0.02);

    expect(advanced).toEqual([]);
  });

  it('should give no cannonballs when there are no cannonballs in flight', () => {
    const advanced = nextCannonballs(LEVEL, [], 0.02);

    expect(advanced).toEqual([]);
  });

  it('should leave the given cannonballs alone when it moves them', () => {
    const cannonballs = createCannonballs();

    nextCannonballs(LEVEL, cannonballs, 0.02);

    expect(cannonballs).toEqual(createCannonballs());
  });
});
