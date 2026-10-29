import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { isOverlappingSpike } from './is-overlapping-spike';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  v: TILE_SPIKE_CEILING,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['..v..', '.....', '..^..', '#####']);

const BOX_SIZE = 8;

describe('isOverlappingSpike', () => {
  it('should say yes when the box sits on the prong of a floor spike', () => {
    const isOverlapping = isOverlappingSpike(LEVEL, 76, 82, BOX_SIZE, BOX_SIZE);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the box sits on the prong of a ceiling spike', () => {
    const isOverlapping = isOverlappingSpike(LEVEL, 76, 2, BOX_SIZE, BOX_SIZE);

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the box floats in open air between the spikes', () => {
    const isOverlapping = isOverlappingSpike(LEVEL, 76, 40, BOX_SIZE, BOX_SIZE);

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the box is in a spike tile but beside its prong', () => {
    const isOverlapping = isOverlappingSpike(LEVEL, 64, 66, BOX_SIZE, BOX_SIZE);

    expect(isOverlapping).toBe(false);
  });
});
