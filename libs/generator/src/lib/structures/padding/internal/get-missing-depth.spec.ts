import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getMissingDepth } from './get-missing-depth';

const level = (height: number): Tile[][] => times(height, () => [TILE_AIR]);

const depth = (height: number, lowest: number): number =>
  getMissingDepth({ tiles: level(height), front: level(height), lowest }).depth;

describe('getMissingDepth', () => {
  it('should ask for four rows when the lowest filled row is the bottom one', () => {
    expect(depth(2, 1)).toBe(4);
  });

  it('should ask for fewer rows when there is air under the lowest filled row', () => {
    expect(depth(3, 0)).toBe(2);
  });

  it('should ask for nothing when there are four rows of air under it', () => {
    expect(depth(5, 0)).toBe(0);
  });

  it('should ask for nothing when there are more than four rows of air under it', () => {
    expect(depth(8, 0)).toBe(0);
  });

  it('should ask for nothing when no row is filled', () => {
    expect(depth(2, -1)).toBe(0);
  });

  it('should count the rows of the front layer when it is taller than the grid', () => {
    expect(
      getMissingDepth({ tiles: level(2), front: level(4), lowest: 1 }).depth,
    ).toBe(2);
  });

  it('should keep the grid the same when it works out the depth', () => {
    const tiles = level(2);

    expect(getMissingDepth({ tiles, front: tiles, lowest: 1 }).tiles).toBe(
      tiles,
    );
  });
});
