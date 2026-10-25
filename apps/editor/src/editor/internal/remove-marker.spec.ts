import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { removeMarker } from './remove-marker';

const createGrid = (): number[][] => [
  [STRUCTURE_START, TILE_DIRT],
  [STRUCTURE_END, STRUCTURE_START],
];

describe('removeMarker', () => {
  it('should turn every cell of the marker into air when the grid holds it', () => {
    expect(removeMarker(createGrid(), STRUCTURE_START)).toEqual([
      [TILE_AIR, TILE_DIRT],
      [STRUCTURE_END, TILE_AIR],
    ]);
  });

  it('should give an empty grid when the grid is empty', () => {
    expect(removeMarker([], STRUCTURE_START)).toEqual([]);
  });

  it('should not change the old grid when it removes a marker', () => {
    const grid = createGrid();

    removeMarker(grid, STRUCTURE_END);

    expect(grid).toEqual(createGrid());
  });
});
