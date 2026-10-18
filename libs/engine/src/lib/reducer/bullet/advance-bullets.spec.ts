import {
  type Bullet,
  type Level,
  MAX_TICK_SECONDS,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { advanceBullets } from './advance-bullets';
import { BULLET_SIZE, BULLET_SPEED } from './consts';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['..........', '..........', '##########'];

const createLevel = (rows: string[]): Level => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const LEVEL = createLevel(ROWS);

const LEVEL_RIGHT_EDGE = size(head(ROWS)) * TILE_SIZE;

const createBullet = (start: number, speed: number): Bullet => ({
  position: { x: start, y: TILE_SIZE },
  velocity: { x: { current: speed, max: BULLET_SPEED } },
});

const createBullets = (): Bullet[] => [
  createBullet(100, BULLET_SPEED),
  createBullet(200, -BULLET_SPEED),
];

const computePositions = (bullets: Bullet[]): number[] =>
  map(bullets, (bullet) => bullet.position.x);

describe('advanceBullets', () => {
  it('should move every bullet along by its speed when time passes', () => {
    const bullets = createBullets();

    const advanced = advanceBullets(LEVEL, bullets, 0.02);

    expect(size(advanced)).toBe(2);
    expect(advanced[0].position.x).toBeCloseTo(108.4, 6);
    expect(advanced[1].position.x).toBeCloseTo(191.6, 6);
    expect(advanced[0].position.y).toBe(TILE_SIZE);
    expect(advanced[0].velocity).toEqual(bullets[0].velocity);
  });

  it('should move a bullet only as far as the longest tick when a long time passes', () => {
    const bullet = createBullet(100, BULLET_SPEED);

    const advanced = advanceBullets(LEVEL, [bullet], 10);

    expect(advanced[0].position.x).toBeCloseTo(
      advanceBullets(LEVEL, [bullet], MAX_TICK_SECONDS)[0].position.x,
      6,
    );
    expect(advanced[0].position.x).toBeCloseTo(116.8, 6);
  });

  it('should drop a bullet when it has flown out past the left of the level', () => {
    const bullets = [createBullet(-BULLET_SIZE - 1, 0), createBullet(50, 0)];

    const advanced = advanceBullets(LEVEL, bullets, 0.02);

    expect(computePositions(advanced)).toEqual([50]);
  });

  it('should drop a bullet when it has flown out past the right of the level', () => {
    const bullets = [
      createBullet(LEVEL_RIGHT_EDGE + 1, 0),
      createBullet(50, 0),
    ];

    const advanced = advanceBullets(LEVEL, bullets, 0.02);

    expect(computePositions(advanced)).toEqual([50]);
  });

  it('should keep a bullet when it sits exactly on the right edge of the level', () => {
    const bullets = [createBullet(LEVEL_RIGHT_EDGE, 0)];

    const advanced = advanceBullets(LEVEL, bullets, 0.02);

    expect(computePositions(advanced)).toEqual([LEVEL_RIGHT_EDGE]);
  });

  it('should keep a bullet when only its far side is still inside the left of the level', () => {
    const bullets = [createBullet(-BULLET_SIZE, 0)];

    const advanced = advanceBullets(LEVEL, bullets, 0.02);

    expect(computePositions(advanced)).toEqual([-BULLET_SIZE]);
  });

  it('should give no bullets when there are no bullets in flight', () => {
    const advanced = advanceBullets(LEVEL, [], 0.02);

    expect(advanced).toEqual([]);
  });

  it('should leave the given bullets alone when it moves them', () => {
    const bullets = createBullets();

    advanceBullets(LEVEL, bullets, 0.02);

    expect(bullets).toEqual(createBullets());
  });
});
