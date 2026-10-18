import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeMissingGroundDepth } from './compute-missing-ground-depth';

const createLevel = (height: number): Tile[][] =>
  times(height, () => [TILE_AIR]);

describe('computeMissingGroundDepth', () => {
  it('should ask for four rows when the row is the bottom one', () => {
    expect(computeMissingGroundDepth(createLevel(2), 1)).toBe(4);
  });

  it('should ask for fewer rows when there are rows under the row', () => {
    expect(computeMissingGroundDepth(createLevel(3), 0)).toBe(2);
  });

  it('should ask for nothing when there are four rows under the row', () => {
    expect(computeMissingGroundDepth(createLevel(5), 0)).toBe(0);
  });

  it('should ask for nothing when there are more than four rows under the row', () => {
    expect(computeMissingGroundDepth(createLevel(8), 0)).toBe(0);
  });
});
