import { type Level, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isSweepColliding } from './is-sweep-colliding';
import type { Sweep } from './types/sweep';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '...#..', '......'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const createSweep = (
  axis: Sweep['axis'],
  originX: number,
  originY: number,
): Sweep => ({
  axis,
  level: LEVEL,
  originX,
  originY,
  width: 16,
  height: 16,
  delta: 0,
});

describe('isSweepColliding', () => {
  it('should collide when the box moved sideways into the wall', () => {
    const isColliding = isSweepColliding(createSweep('HORIZONTAL', 0, 40), 90);

    expect(isColliding).toBe(true);
  });

  it('should not collide when the box moved sideways through clear air', () => {
    const isColliding = isSweepColliding(createSweep('HORIZONTAL', 0, 8), 90);

    expect(isColliding).toBe(false);
  });

  it('should collide when the box moved down into the wall', () => {
    const isColliding = isSweepColliding(createSweep('VERTICAL', 100, 0), 40);

    expect(isColliding).toBe(true);
  });

  it('should not collide when the box moved down through clear air', () => {
    const isColliding = isSweepColliding(createSweep('VERTICAL', 10, 0), 40);

    expect(isColliding).toBe(false);
  });
});
