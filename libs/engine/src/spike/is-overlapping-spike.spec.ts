import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../state/types/game-level';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL_ROWS = ['..v..', '.....', '..^..', '#####'];

const LEVEL = createLevel(LEVEL_ROWS);

const BARE_LEVEL = createLevel(['.....', '.....', '.....', '#####']);

const BOX_SIZE = 8;

const ON_THE_PRONG_X = 76;

const BESIDE_THE_PRONG_X = 64;

const ON_THE_FLOOR_PRONG_Y = 82;

const ON_THE_CEILING_PRONG_Y = 2;

const IN_THE_OPEN_AIR_Y = 40;

const BESIDE_THE_PRONG_Y = 66;

describe('isOverlappingSpike', () => {
  it('should say yes when the box sits on the prong of a floor spike', () => {
    const isOverlapping = isOverlappingSpike(
      LEVEL,
      ON_THE_PRONG_X,
      ON_THE_FLOOR_PRONG_Y,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the box sits on the prong of a ceiling spike', () => {
    const isOverlapping = isOverlappingSpike(
      LEVEL,
      ON_THE_PRONG_X,
      ON_THE_CEILING_PRONG_Y,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the box floats in open air between the spikes', () => {
    const isOverlapping = isOverlappingSpike(
      LEVEL,
      ON_THE_PRONG_X,
      IN_THE_OPEN_AIR_Y,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the box is in a spike tile but beside its prong', () => {
    const isOverlapping = isOverlappingSpike(
      LEVEL,
      BESIDE_THE_PRONG_X,
      BESIDE_THE_PRONG_Y,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the level holds no spike at all', () => {
    const isOverlapping = isOverlappingSpike(
      BARE_LEVEL,
      ON_THE_PRONG_X,
      ON_THE_FLOOR_PRONG_Y,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(false);
  });

  it('should leave the level it was handed untouched when it looks for a spike', () => {
    const level = createLevel(LEVEL_ROWS);

    isOverlappingSpike(
      level,
      ON_THE_PRONG_X,
      ON_THE_FLOOR_PRONG_Y,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(level).toEqual(createLevel(LEVEL_ROWS));
  });
});
