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
import { isOverlappingSpikeFacing } from './is-overlapping-spike-facing';

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
});

const LEVEL = createLevel(['..v..', '.....', '..^..', '#####']);

const BOX_SIZE = 8;

describe('isOverlappingSpikeFacing', () => {
  it('should say yes when the box sits on a floor spike and floor spikes count', () => {
    const isOverlapping = isOverlappingSpikeFacing(
      LEVEL,
      76,
      82,
      BOX_SIZE,
      BOX_SIZE,
      ['FLOOR'],
    );

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the box sits on a floor spike and only ceiling spikes count', () => {
    const isOverlapping = isOverlappingSpikeFacing(
      LEVEL,
      76,
      82,
      BOX_SIZE,
      BOX_SIZE,
      ['CEILING'],
    );

    expect(isOverlapping).toBe(false);
  });

  it('should say yes when the box sits on a ceiling spike and ceiling spikes count', () => {
    const isOverlapping = isOverlappingSpikeFacing(
      LEVEL,
      76,
      2,
      BOX_SIZE,
      BOX_SIZE,
      ['CEILING'],
    );

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the box sits on a spike and no kind of spike counts', () => {
    const isOverlapping = isOverlappingSpikeFacing(
      LEVEL,
      76,
      82,
      BOX_SIZE,
      BOX_SIZE,
      [],
    );

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the box floats in open air and every kind of spike counts', () => {
    const isOverlapping = isOverlappingSpikeFacing(
      LEVEL,
      76,
      40,
      BOX_SIZE,
      BOX_SIZE,
      ['FLOOR', 'CEILING'],
    );

    expect(isOverlapping).toBe(false);
  });
});
