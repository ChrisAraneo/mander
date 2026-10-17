import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { isSpikeAhead } from './is-spike-ahead';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
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

const LEVEL = createLevel(['.....', '..^..', '#####']);

const WALLED_LEVEL = createLevel(['.....', '..#..', '#####']);

const SPIKE_ROW_TOP = 34;

describe('isSpikeAhead', () => {
  it('should say yes when the enemy walking right is about to reach a spike', () => {
    const isSpike = isSpikeAhead(LEVEL, 41, SPIKE_ROW_TOP, 1);

    expect(isSpike).toBe(true);
  });

  it('should say yes when the enemy walking left is about to reach a spike', () => {
    const isSpike = isSpikeAhead(LEVEL, 96, SPIKE_ROW_TOP, -1);

    expect(isSpike).toBe(true);
  });

  it('should say yes when only the lower part of the enemy is level with the spike', () => {
    const isSpike = isSpikeAhead(LEVEL, 41, 20, 1);

    expect(isSpike).toBe(true);
  });

  it('should say no when the spike is behind the enemy', () => {
    const isSpike = isSpikeAhead(LEVEL, 41, SPIKE_ROW_TOP, -1);

    expect(isSpike).toBe(false);
  });

  it('should say no when the tile ahead of the enemy is empty', () => {
    const isSpike = isSpikeAhead(LEVEL, 10, SPIKE_ROW_TOP, 1);

    expect(isSpike).toBe(false);
  });

  it('should say no when the spike is in the row below the enemy', () => {
    const isSpike = isSpikeAhead(LEVEL, 41, 2, 1);

    expect(isSpike).toBe(false);
  });

  it('should say no when the tile ahead of the enemy is a wall', () => {
    const isSpike = isSpikeAhead(WALLED_LEVEL, 41, SPIKE_ROW_TOP, 1);

    expect(isSpike).toBe(false);
  });
});
