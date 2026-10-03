import {
  type Sector,
  STRUCTURE_WIDTH,
  VERTICAL_BAND_HEIGHT,
} from '@mander/structures';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findStructurePlacements } from './find-structure-placements';

const FIRST: Sector = [[], []];

const SECOND: Sector = [[], []];

const THIRD: Sector = [[], []];

describe('findStructurePlacements', () => {
  it('should chain the structures across in a horizontal level when it places them', () => {
    expect(
      findStructurePlacements({
        structures: [FIRST, SECOND],
        levelType: 'HORIZONTAL',
      }).placements,
    ).toEqual([
      { structure: FIRST, row: 0, column: 0 },
      { structure: SECOND, row: 0, column: STRUCTURE_WIDTH },
    ]);
  });

  it('should stack the structures up in a vertical level when it places them', () => {
    expect(
      map(
        findStructurePlacements({
          structures: [FIRST, SECOND, THIRD],
          levelType: 'VERTICAL',
        }).placements,
        ({ row, column }) => ({ row, column }),
      ),
    ).toEqual([
      { row: VERTICAL_BAND_HEIGHT * 2, column: 0 },
      { row: VERTICAL_BAND_HEIGHT, column: 0 },
      { row: 0, column: 0 },
    ]);
  });

  it('should place nothing in a horizontal level when there are no structures', () => {
    expect(
      findStructurePlacements({ structures: [], levelType: 'HORIZONTAL' })
        .placements,
    ).toEqual([]);
  });

  it('should place nothing in a vertical level when there are no structures', () => {
    expect(
      findStructurePlacements({ structures: [], levelType: 'VERTICAL' })
        .placements,
    ).toEqual([]);
  });

  it('should pass the level type on when it places the structures', () => {
    expect(
      findStructurePlacements({ structures: [], levelType: 'VERTICAL' })
        .levelType,
    ).toBe('VERTICAL');
  });
});
