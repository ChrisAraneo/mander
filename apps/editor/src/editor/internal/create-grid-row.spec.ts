import { TILE_AIR, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_START_ROW,
} from '@mander/structures';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createGridRow } from './create-grid-row';

describe('createGridRow', () => {
  it('should lay dirt across the row when the row is the ground of a horizontal pool', () => {
    expect(createGridRow('hard', STRUCTURE_HEIGHT - 1)).toEqual(
      times(STRUCTURE_WIDTH, () => TILE_DIRT),
    );
  });

  it('should give a row of air when the row is above the ground of a horizontal pool', () => {
    expect(createGridRow('normal', 0)).toEqual(
      times(STRUCTURE_WIDTH, () => TILE_AIR),
    );
  });

  it('should place the start in the row when the row is the bottom one of the vertical pool', () => {
    const row = createGridRow('vertical', VERTICAL_START_ROW);

    expect(row[VERTICAL_MARKER_COLUMN]).toBe(STRUCTURE_START);
    expect(row[0]).toBe(TILE_AIR);
  });
});
