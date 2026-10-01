import { type Sector, STRUCTURE_HEIGHT } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { measureJoinedHeight } from './measure-joined-height';

const SECTOR: Sector = [[], []];

describe('measureJoinedHeight', () => {
  it('should reach the bottom of the lowest structure when the structures sit at different rows', () => {
    expect(
      measureJoinedHeight([
        { structure: SECTOR, row: 0, column: 0 },
        { structure: SECTOR, row: 3, column: 20 },
      ]),
    ).toBe(3 + STRUCTURE_HEIGHT);
  });

  it('should give one structure height when every structure sits on the top row', () => {
    expect(
      measureJoinedHeight([
        { structure: SECTOR, row: 0, column: 0 },
        { structure: SECTOR, row: 0, column: 20 },
      ]),
    ).toBe(STRUCTURE_HEIGHT);
  });

  it('should give zero when there are no placements', () => {
    expect(measureJoinedHeight([])).toBe(0);
  });
});
