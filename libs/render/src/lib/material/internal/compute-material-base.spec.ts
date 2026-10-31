import { TILE_BRICK, TILE_CERAMIC, TILE_DIRT, TILE_WOOD } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { Hsl } from '../../color/types/hsl';
import type { Palette } from '../../types/palette';
import { computeMaterialBase } from './compute-material-base';

const PLAIN: Palette = {
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
};

const ROLLED: Palette = {
  ...PLAIN,
  materials: {
    brick: 'HSL(14, 46%, 44%)',
    wood: 'HSL(30, 32%, 46%)',
    ceramic: 'HSL(186, 50%, 46%)',
  },
};

const BROKEN: Palette = {
  ...PLAIN,
  materials: { brick: '', wood: 'red', ceramic: '' },
};

const GROUND: Hsl = { hue: 30, saturation: 25, lightness: 27 };

describe('computeMaterialBase', () => {
  it('should take the colour the level rolled when the palette carries one for the tile', () => {
    expect(computeMaterialBase(TILE_BRICK, ROLLED, GROUND)).toEqual({
      hue: 14,
      saturation: 46,
      lightness: 44,
    });
    expect(computeMaterialBase(TILE_CERAMIC, ROLLED, GROUND)).toEqual({
      hue: 186,
      saturation: 50,
      lightness: 46,
    });
  });

  it('should step away from the ground when the palette carries no colour for the tile', () => {
    expect(computeMaterialBase(TILE_WOOD, PLAIN, GROUND)).toEqual({
      hue: 26,
      saturation: 21,
      lightness: 43,
    });
  });

  it('should keep the ground colour when the tile is dirt', () => {
    expect(computeMaterialBase(TILE_DIRT, ROLLED, GROUND)).toEqual(GROUND);
  });

  it('should step away from the ground when the rolled colour is no colour at all', () => {
    expect(computeMaterialBase(TILE_WOOD, BROKEN, GROUND)).toEqual(
      computeMaterialBase(TILE_WOOD, PLAIN, GROUND),
    );
    expect(computeMaterialBase(TILE_BRICK, BROKEN, GROUND)).toEqual(
      computeMaterialBase(TILE_BRICK, PLAIN, GROUND),
    );
  });
});
