import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getMissingDepth } from './get-missing-depth';

const createLevel = (height: number): Tile[][] =>
  times(height, () => [TILE_AIR]);

const getDepth = (height: number, lowest: number): number =>
  getMissingDepth({
    tiles: createLevel(height),
    front: createLevel(height),
    lowest,
  }).depth;

describe('getMissingDepth', () => {
  it('should ask for four rows when the lowest filled row is the bottom one', () => {
    expect(getDepth(2, 1)).toBe(4);
  });

  it('should ask for fewer rows when there is air under the lowest filled row', () => {
    expect(getDepth(3, 0)).toBe(2);
  });

  it('should ask for nothing when there are four rows of air under it', () => {
    expect(getDepth(5, 0)).toBe(0);
  });

  it('should ask for nothing when there are more than four rows of air under it', () => {
    expect(getDepth(8, 0)).toBe(0);
  });

  it('should ask for nothing when no row is filled', () => {
    expect(getDepth(2, -1)).toBe(0);
  });

  it('should count the rows of the front layer when it is taller than the grid', () => {
    expect(
      getMissingDepth({
        tiles: createLevel(2),
        front: createLevel(4),
        lowest: 1,
      }).depth,
    ).toBe(2);
  });

  it('should keep the grid the same when it works out the depth', () => {
    const tiles = createLevel(2);

    expect(getMissingDepth({ tiles, front: tiles, lowest: 1 }).tiles).toBe(
      tiles,
    );
  });
});
