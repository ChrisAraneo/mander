import {
  type Sector,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_HEIGHT,
} from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { VERTICAL_GROUND_DEPTH } from '../../consts';
import { computeStackedHeight } from './compute-stacked-height';

const SECTOR: Sector = [[], []];

describe('computeStackedHeight', () => {
  it('should reach past the bottom structure down through the ground when it measures a stack', () => {
    expect(
      computeStackedHeight([
        { structure: SECTOR, row: VERTICAL_BAND_HEIGHT, column: 0 },
        { structure: SECTOR, row: 0, column: 0 },
      ]),
    ).toBe(VERTICAL_BAND_HEIGHT + VERTICAL_HEIGHT + VERTICAL_GROUND_DEPTH);
  });

  it('should give one structure and the ground when the stack holds one structure', () => {
    expect(
      computeStackedHeight([{ structure: SECTOR, row: 0, column: 0 }]),
    ).toBe(VERTICAL_HEIGHT + VERTICAL_GROUND_DEPTH);
  });

  it('should give zero when there are no placements', () => {
    expect(computeStackedHeight([])).toBe(0);
  });
});
