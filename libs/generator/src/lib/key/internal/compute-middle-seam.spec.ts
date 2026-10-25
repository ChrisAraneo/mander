import { TILE_AIR, type Tile } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeMiddleSeam } from './compute-middle-seam';

const createLevel = (width: number): Tile[][] => [times(width, () => TILE_AIR)];

describe('computeMiddleSeam', () => {
  it('should give the seam left of the middle structure when the level holds an odd number of structures', () => {
    expect(computeMiddleSeam(createLevel(3 * STRUCTURE_WIDTH))).toBe(
      STRUCTURE_WIDTH,
    );
  });

  it('should give the seam in the middle when the level holds an even number of structures', () => {
    expect(computeMiddleSeam(createLevel(4 * STRUCTURE_WIDTH))).toBe(
      2 * STRUCTURE_WIDTH,
    );
  });

  it('should give zero when the level is narrower than two structures', () => {
    expect(computeMiddleSeam(createLevel(STRUCTURE_WIDTH))).toBe(0);
  });

  it('should give zero when the level is empty', () => {
    expect(computeMiddleSeam([])).toBe(0);
  });
});
