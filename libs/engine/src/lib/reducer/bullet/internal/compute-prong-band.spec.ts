import {
  PRONG_HEIGHT,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeProngBand } from './compute-prong-band';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  v: TILE_SPIKE_CEILING,
  '^': TILE_SPIKE,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['####', '..v.', '....', '.^..', '####']);

describe('computeProngBand', () => {
  it('should hang the band from the top of the tile when the spike points down from the ceiling', () => {
    const band = computeProngBand(LEVEL, { x: 2, y: 1 });

    expect(band).toEqual({
      x: 2 * TILE_SIZE,
      y: 1 * TILE_SIZE,
      width: TILE_SIZE,
      height: PRONG_HEIGHT,
    });
  });

  it('should rest the band on the bottom of the tile when the spike stands on the floor', () => {
    const band = computeProngBand(LEVEL, { x: 1, y: 3 });

    expect(band.x).toBe(1 * TILE_SIZE);
    expect(band.y).toBeCloseTo(4 * TILE_SIZE - PRONG_HEIGHT, 6);
    expect(band.width).toBe(TILE_SIZE);
    expect(band.height).toBe(PRONG_HEIGHT);
  });
});
