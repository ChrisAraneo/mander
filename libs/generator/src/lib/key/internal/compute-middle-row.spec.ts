import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeMiddleRow } from './compute-middle-row';

const createLevel = (height: number): Tile[][] =>
  times(height, () => [TILE_AIR]);

describe('computeMiddleRow', () => {
  it('should give the row halfway down when the level has an even height', () => {
    expect(computeMiddleRow(createLevel(10))).toBe(5);
  });

  it('should give the row just above the middle when the level has an odd height', () => {
    expect(computeMiddleRow(createLevel(7))).toBe(3);
  });

  it('should give zero when the level is empty', () => {
    expect(computeMiddleRow([])).toBe(0);
  });
});
