import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createColumnNumbers } from './create-column-numbers';

const LEVEL: Tile[][] = [
  [TILE_AIR, TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

describe('createColumnNumbers', () => {
  it('should give a number to every column when the grid has rows', () => {
    expect(createColumnNumbers(LEVEL).columns).toEqual([0, 1, 2]);
  });

  it('should keep the grid the same when it numbers the columns', () => {
    expect(createColumnNumbers(LEVEL).tiles).toBe(LEVEL);
  });

  it('should give no columns when the grid has no rows', () => {
    expect(createColumnNumbers([]).columns).toEqual([]);
  });

  it('should give no columns when the first row is empty', () => {
    expect(createColumnNumbers([[]]).columns).toEqual([]);
  });

  it('should count the columns from the first row when rows have different lengths', () => {
    expect(
      createColumnNumbers([[TILE_AIR], [TILE_DIRT, TILE_DIRT, TILE_DIRT]])
        .columns,
    ).toEqual([0]);
  });
});
