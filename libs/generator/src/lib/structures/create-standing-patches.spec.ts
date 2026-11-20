import { TILE_KEY, TILE_PORTAL } from '@mander/model';
import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../types/spot';
import { createStandingPatches } from './create-standing-patches';

const createSpot = (): Spot => ({ row: 5, column: 2 });

describe('createStandingPatches', () => {
  it('should mark the rows above the spot when it stands a tile there', () => {
    expect(createStandingPatches(createSpot(), TILE_PORTAL, 2)).toEqual([
      { row: 4, column: 2, tile: TILE_PORTAL },
      { row: 3, column: 2, tile: TILE_PORTAL },
    ]);
  });

  it('should make as many marks as the height when it stands a tall tile', () => {
    expect(
      size(createStandingPatches({ row: 9, column: 0 }, TILE_KEY, 4)),
    ).toBe(4);
  });

  it('should make no marks when the height is zero', () => {
    expect(createStandingPatches(createSpot(), TILE_KEY, 0)).toEqual([]);
  });

  it('should not change the old spot when it stands a tile there', () => {
    const spot = createSpot();

    createStandingPatches(spot, TILE_PORTAL, 2);

    expect(spot).toEqual(createSpot());
  });
});
