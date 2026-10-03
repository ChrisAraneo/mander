import { type Sector, VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findStackedPlacements } from './find-stacked-placements';

const FIRST: Sector = [[], []];

const SECOND: Sector = [[], []];

const THIRD: Sector = [[], []];

describe('findStackedPlacements', () => {
  it('should put the first structure at the bottom of the stack when it stacks them', () => {
    expect(map(findStackedPlacements([FIRST, SECOND, THIRD]), 'row')).toEqual([
      VERTICAL_BAND_HEIGHT * 2,
      VERTICAL_BAND_HEIGHT,
      0,
    ]);
  });

  it('should keep every structure in the first column when it stacks them', () => {
    expect(
      map(findStackedPlacements([FIRST, SECOND, THIRD]), 'column'),
    ).toEqual([0, 0, 0]);
  });

  it('should put a lone structure on the top row when it stacks one', () => {
    expect(findStackedPlacements([FIRST])).toEqual([
      { structure: FIRST, row: 0, column: 0 },
    ]);
  });

  it('should keep the structures in their order when it stacks them', () => {
    const placed = findStackedPlacements([FIRST, SECOND]);

    expect(placed[0].structure).toBe(FIRST);
    expect(placed[1].structure).toBe(SECOND);
  });

  it('should give no placements when there are no structures', () => {
    expect(findStackedPlacements([])).toEqual([]);
  });
});
