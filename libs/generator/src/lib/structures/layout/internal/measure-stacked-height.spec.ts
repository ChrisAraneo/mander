import {
  type Sector,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_HEIGHT,
} from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { VERTICAL_GROUND_DEPTH } from '../../../consts';
import { measureStackedHeight } from './measure-stacked-height';

const SECTOR: Sector = [[], []];

describe('measureStackedHeight', () => {
  it('should reach past the bottom structure down through the ground when it measures a stack', () => {
    expect(
      measureStackedHeight([
        { structure: SECTOR, row: VERTICAL_BAND_HEIGHT, column: 0 },
        { structure: SECTOR, row: 0, column: 0 },
      ]),
    ).toBe(VERTICAL_BAND_HEIGHT + VERTICAL_HEIGHT + VERTICAL_GROUND_DEPTH);
  });

  it('should give one structure and the ground when the stack holds one structure', () => {
    expect(
      measureStackedHeight([{ structure: SECTOR, row: 0, column: 0 }]),
    ).toBe(VERTICAL_HEIGHT + VERTICAL_GROUND_DEPTH);
  });

  it('should give zero when there are no placements', () => {
    expect(measureStackedHeight([])).toBe(0);
  });
});
