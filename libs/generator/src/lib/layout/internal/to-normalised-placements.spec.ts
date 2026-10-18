import type { Sector } from '@mander/structures';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toNormalisedPlacements } from './to-normalised-placements';
import type { StructurePlacement } from './types/structure-placement';

const SECTOR: Sector = [[], []];

const createPlacements = (
  positions: { row: number; column: number }[],
): StructurePlacement[] =>
  map(positions, ({ row, column }) => ({ structure: SECTOR, row, column }));

const getPositions = (placements: StructurePlacement[]) =>
  map(toNormalisedPlacements(placements), ({ row, column }) => ({
    row,
    column,
  }));

describe('toNormalisedPlacements', () => {
  it('should move every placement down when one starts above the top row', () => {
    expect(
      getPositions(
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
      getPositions(
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
      getPositions(
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
      toNormalisedPlacements(createPlacements([{ row: -2, column: 0 }]))[0]
        .structure,
    ).toBe(SECTOR);
  });

  it('should give no placements when there are none', () => {
    expect(toNormalisedPlacements([])).toEqual([]);
  });
});
