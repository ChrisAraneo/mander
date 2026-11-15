import {
  type Bullet,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BULLET_SPEED } from '../consts';
import { filterBulletsInLevel } from './filter-bullets-in-level';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['..........', '..........', '##########'];

const INSIDE_LEFT = 100;
const BEYOND_RIGHT_EDGE = size(head(ROWS)) * TILE_SIZE + TILE_SIZE;

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const createBulletAt = (left: number): Bullet => ({
  position: { x: left, y: TILE_SIZE },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('filterBulletsInLevel', () => {
  it('should keep the bullet when it is still inside the level', () => {
    const bullet = createBulletAt(INSIDE_LEFT);

    const kept = filterBulletsInLevel({ bullets: [bullet], level: LEVEL });

    expect(kept).toEqual([bullet]);
  });

  it('should drop the bullet when it has left the level', () => {
    const bullet = createBulletAt(BEYOND_RIGHT_EDGE);

    const kept = filterBulletsInLevel({ bullets: [bullet], level: LEVEL });

    expect(kept).toEqual([]);
  });

  it('should give no bullets when it is given none', () => {
    const kept = filterBulletsInLevel({ bullets: [], level: LEVEL });

    expect(kept).toEqual([]);
  });

  it('should hand back the same bullet when it keeps it', () => {
    const bullet = createBulletAt(INSIDE_LEFT);

    const kept = filterBulletsInLevel({ bullets: [bullet], level: LEVEL });

    expect(kept[0]).toBe(bullet);
  });
});
