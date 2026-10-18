import { TILE_DIRT, TILE_STONE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { Palette } from '../../types/palette';
import { computeMaterialCap } from './compute-material-cap';
import type { Hsl } from '../../color/types/hsl';

const PALETTE: Palette = {
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
};

const GROUND: Hsl = { hue: 30, saturation: 25, lightness: 27 };

describe('computeMaterialCap', () => {
  it('should cap dirt with the grass colours of the palette when the tile is dirt', () => {
    const result = computeMaterialCap(TILE_DIRT, PALETTE, GROUND);

    expect(result).toEqual({
      cap: 'HSL(96, 42%, 48%)',
      capHighlight: 'HSL(96, 47%, 54%)',
    });
  });

  it('should cap the material with two lighter shades of itself when the tile is not dirt', () => {
    const result = computeMaterialCap(TILE_STONE, PALETTE, {
      hue: 200,
      saturation: 10,
      lightness: 40,
    });

    expect(result).toEqual({
      cap: 'HSL(200, 10%, 47%)',
      capHighlight: 'HSL(200, 10%, 54%)',
    });
  });
});
