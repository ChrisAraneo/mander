import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { filterMarkerCells } from './filter-marker-cells';

describe('filterMarkerCells', () => {
  it('should give the start and the end with where they sit when the grid marks them', () => {
    expect(
      filterMarkerCells([
        [TILE_AIR, STRUCTURE_END],
        [STRUCTURE_START, TILE_DIRT],
      ]),
    ).toEqual([
      { cell: STRUCTURE_END, row: 0, column: 1 },
      { cell: STRUCTURE_START, row: 1, column: 0 },
    ]);
  });

  it('should give no cells when the grid marks nothing', () => {
    expect(filterMarkerCells([[TILE_AIR, TILE_DIRT]])).toEqual([]);
  });
});
