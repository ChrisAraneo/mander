import { TILE_AIR } from '@mander/model';
import {
  type Sector,
  STRUCTURE_HEIGHT,
  STRUCTURE_WIDTH,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_HEIGHT,
} from '@mander/structures';
import { every, flatten, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { VERTICAL_GROUND_DEPTH } from '../../consts';
import { createStructureGrid } from './create-structure-grid';
import type { Placement } from './placement';

const SECTOR: Sector = [[], []];

const JOINED: Placement[] = [
  { structure: SECTOR, row: 2, column: 0 },
  { structure: SECTOR, row: 0, column: STRUCTURE_WIDTH },
];

const STACKED: Placement[] = [
  { structure: SECTOR, row: VERTICAL_BAND_HEIGHT, column: 0 },
  { structure: SECTOR, row: 0, column: 0 },
];

describe('createStructureGrid', () => {
  it('should make the grid as tall and as wide as the structures in a horizontal level when it measures them', () => {
    const { tiles } = createStructureGrid({
      levelType: 'HORIZONTAL',
      placements: JOINED,
    });

    expect(size(tiles)).toBe(2 + STRUCTURE_HEIGHT);
    expect(map(tiles, size)).toEqual(map(tiles, () => STRUCTURE_WIDTH * 2));
  });

  it('should leave room for the ground under the stack in a vertical level when it measures it', () => {
    const { tiles } = createStructureGrid({
      levelType: 'VERTICAL',
      placements: STACKED,
    });

    expect(size(tiles)).toBe(
      VERTICAL_BAND_HEIGHT + VERTICAL_HEIGHT + VERTICAL_GROUND_DEPTH,
    );
    expect(map(tiles, size)).toEqual(map(tiles, () => STRUCTURE_WIDTH));
  });

  it('should fill the grid with air when it makes it', () => {
    expect(
      every(
        flatten(
          createStructureGrid({ levelType: 'HORIZONTAL', placements: JOINED })
            .tiles,
        ),
        (tile) => tile === TILE_AIR,
      ),
    ).toBe(true);
  });

  it('should make an empty grid in a horizontal level when there are no placements', () => {
    expect(
      createStructureGrid({ levelType: 'HORIZONTAL', placements: [] }).tiles,
    ).toEqual([]);
  });

  it('should make an empty grid in a vertical level when there are no placements', () => {
    expect(
      createStructureGrid({ levelType: 'VERTICAL', placements: [] }).tiles,
    ).toEqual([]);
  });

  it('should pass the level type on when it makes the grid', () => {
    expect(
      createStructureGrid({ levelType: 'VERTICAL', placements: [] }).levelType,
    ).toBe('VERTICAL');
  });

  it('should pass the placements on when it makes the grid', () => {
    expect(
      createStructureGrid({ levelType: 'HORIZONTAL', placements: JOINED })
        .placements,
    ).toBe(JOINED);
  });
});
