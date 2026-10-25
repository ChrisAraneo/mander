import { type Sector } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { createPlacement } from './create-placement';

const PREVIOUS_SECTOR: Sector = [[], []];

const SECTOR: Sector = [[], []];

describe('createPlacement', () => {
  it('should line the entry up one column past the exit when it places the structure', () => {
    expect(
      createPlacement(
        { structure: PREVIOUS_SECTOR, row: 3, column: 40 },
        SECTOR,
        { row: 10, column: 19 },
        { row: 12, column: 0 },
      ),
    ).toEqual({ structure: SECTOR, row: 1, column: 60 });
  });

  it('should keep the structure it places when it works out where it goes', () => {
    expect(
      createPlacement(
        { structure: PREVIOUS_SECTOR, row: 0, column: 0 },
        SECTOR,
        { row: 0, column: 0 },
        { row: 0, column: 0 },
      ).structure,
    ).toBe(SECTOR);
  });

  it('should put the structure one column after the last one when the exit and the entry sit on the same cell', () => {
    expect(
      createPlacement(
        { structure: PREVIOUS_SECTOR, row: 4, column: 7 },
        SECTOR,
        { row: 2, column: 0 },
        { row: 2, column: 0 },
      ),
    ).toEqual({ structure: SECTOR, row: 4, column: 8 });
  });
});
