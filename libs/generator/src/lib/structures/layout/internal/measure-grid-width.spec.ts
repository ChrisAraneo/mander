import { type Sector, STRUCTURE_WIDTH } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { measureGridWidth } from './measure-grid-width';

const SECTOR: Sector = [[], []];

describe('measureGridWidth', () => {
  it('should reach the right edge of the rightmost structure when the structures sit side by side', () => {
    expect(
      measureGridWidth([
        { structure: SECTOR, row: 0, column: 0 },
        { structure: SECTOR, row: 2, column: STRUCTURE_WIDTH },
      ]),
    ).toBe(STRUCTURE_WIDTH * 2);
  });

  it('should give one structure width when the structures sit in one column', () => {
    expect(
      measureGridWidth([
        { structure: SECTOR, row: 21, column: 0 },
        { structure: SECTOR, row: 0, column: 0 },
      ]),
    ).toBe(STRUCTURE_WIDTH);
  });

  it('should give zero when there are no placements', () => {
    expect(measureGridWidth([])).toBe(0);
  });
});
