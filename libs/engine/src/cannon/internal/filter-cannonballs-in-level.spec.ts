import {
  type Cannonball,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SPEED } from '../consts';
import { filterCannonballsInLevel } from './filter-cannonballs-in-level';

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

const createCannonballAt = (left: number): Cannonball => ({
  position: { x: left, y: TILE_SIZE },
  velocity: {
    x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    y: { current: 0, max: CANNONBALL_SPEED },
  },
});

describe('filterCannonballsInLevel', () => {
  it('should keep the ball when it is still inside the level', () => {
    const cannonball = createCannonballAt(INSIDE_LEFT);

    const kept = filterCannonballsInLevel({
      cannonballs: [cannonball],
      level: LEVEL,
    });

    expect(kept).toEqual([cannonball]);
  });

  it('should drop the ball when it has left the level', () => {
    const cannonball = createCannonballAt(BEYOND_RIGHT_EDGE);

    const kept = filterCannonballsInLevel({
      cannonballs: [cannonball],
      level: LEVEL,
    });

    expect(kept).toEqual([]);
  });

  it('should give no balls when it is given none', () => {
    const kept = filterCannonballsInLevel({ cannonballs: [], level: LEVEL });

    expect(kept).toEqual([]);
  });

  it('should hand back the same ball when it keeps it', () => {
    const cannonball = createCannonballAt(INSIDE_LEFT);

    const kept = filterCannonballsInLevel({
      cannonballs: [cannonball],
      level: LEVEL,
    });

    expect(kept[0]).toBe(cannonball);
  });
});
