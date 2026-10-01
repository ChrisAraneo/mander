import type { Sector } from '@mander/structures';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { normalisePlacements } from './normalise-placements';
import type { Placement } from './placement';

const SECTOR: Sector = [[], []];

const createPlacements = (
  positions: { row: number; column: number }[],
): Placement[] =>
  map(positions, ({ row, column }) => ({ structure: SECTOR, row, column }));

const findPositions = (placements: Placement[]) =>
  map(normalisePlacements(placements), ({ row, column }) => ({ row, column }));

describe('normalisePlacements', () => {
  it('should move every placement down when one starts above the top row', () => {
    expect(
      findPositions(
        createPlacements([
          { row: -2, column: 0 },
          { row: 0, column: 20 },
        ]),
      ),
    ).toEqual([
      { row: 0, column: 0 },
      { row: 2, column: 20 },
    ]);
  });

  it('should move every placement right when one starts left of the first column', () => {
    expect(
      findPositions(
        createPlacements([
          { row: 0, column: -5 },
          { row: 3, column: 15 },
        ]),
      ),
    ).toEqual([
      { row: 0, column: 0 },
      { row: 3, column: 20 },
    ]);
  });

  it('should leave the placements where they are when they already start at the top left', () => {
    expect(
      findPositions(
        createPlacements([
          { row: 0, column: 0 },
          { row: 4, column: 20 },
        ]),
      ),
    ).toEqual([
      { row: 0, column: 0 },
      { row: 4, column: 20 },
    ]);
  });

  it('should keep the structure of each placement when it moves them', () => {
    expect(
      normalisePlacements(createPlacements([{ row: -2, column: 0 }]))[0]
        .structure,
    ).toBe(SECTOR);
  });

  it('should give no placements when there are none', () => {
    expect(normalisePlacements([])).toEqual([]);
  });
});
