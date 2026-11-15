import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { GameLevel } from '../../state/types/game-level';
import { isSpikeAhead } from './is-spike-ahead';

const BEFORE_SPIKE_LEFT = 41;
const PAST_SPIKE_LEFT = 96;
const OPEN_AIR_LEFT = 10;
const LOWER_PART_TOP = 20;
const ROW_BELOW_TOP = 2;

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..^..', '#####']);

const WALLED_LEVEL = createLevel(['.....', '..#..', '#####']);

const SPIKE_ROW_TOP = 34;

describe('isSpikeAhead', () => {
  it('should say yes when the enemy walking right is about to reach a spike', () => {
    const isSpike = isSpikeAhead(
      LEVEL,
      BEFORE_SPIKE_LEFT,
      SPIKE_ROW_TOP,
      FACING_RIGHT,
    );

    expect(isSpike).toBe(true);
  });

  it('should say yes when the enemy walking left is about to reach a spike', () => {
    const isSpike = isSpikeAhead(
      LEVEL,
      PAST_SPIKE_LEFT,
      SPIKE_ROW_TOP,
      FACING_LEFT,
    );

    expect(isSpike).toBe(true);
  });

  it('should say yes when only the lower part of the enemy is level with the spike', () => {
    const isSpike = isSpikeAhead(
      LEVEL,
      BEFORE_SPIKE_LEFT,
      LOWER_PART_TOP,
      FACING_RIGHT,
    );

    expect(isSpike).toBe(true);
  });

  it('should say no when the spike is behind the enemy', () => {
    const isSpike = isSpikeAhead(
      LEVEL,
      BEFORE_SPIKE_LEFT,
      SPIKE_ROW_TOP,
      FACING_LEFT,
    );

    expect(isSpike).toBe(false);
  });

  it('should say no when the tile ahead of the enemy is empty', () => {
    const isSpike = isSpikeAhead(
      LEVEL,
      OPEN_AIR_LEFT,
      SPIKE_ROW_TOP,
      FACING_RIGHT,
    );

    expect(isSpike).toBe(false);
  });

  it('should say no when the spike is in the row below the enemy', () => {
    const isSpike = isSpikeAhead(
      LEVEL,
      BEFORE_SPIKE_LEFT,
      ROW_BELOW_TOP,
      FACING_RIGHT,
    );

    expect(isSpike).toBe(false);
  });

  it('should say no when the tile ahead of the enemy is a wall', () => {
    const isSpike = isSpikeAhead(
      WALLED_LEVEL,
      BEFORE_SPIKE_LEFT,
      SPIKE_ROW_TOP,
      FACING_RIGHT,
    );

    expect(isSpike).toBe(false);
  });
});
