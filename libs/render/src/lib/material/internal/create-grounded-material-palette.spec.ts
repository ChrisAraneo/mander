import { TILE_AIR, TILE_BRICK } from '@mander/model';
import type { Hsl } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import type { Palette } from '../../types/palette';
import { DIRT_STYLE } from '../consts';
import { createGroundedMaterialPalette } from './create-grounded-material-palette';
import { createMaterialStyle } from './create-material-style';

const PALETTE: Palette = {
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
};

const GROUND: Hsl = { hue: 30, saturation: 25, lightness: 27 };

describe('createGroundedMaterialPalette', () => {
  it('should give each solid tile the style made from the ground colour when it is asked for a solid tile', () => {
    const result = createGroundedMaterialPalette(PALETTE, GROUND)(TILE_BRICK);

    expect(result).toEqual(createMaterialStyle(TILE_BRICK, PALETTE, GROUND));
  });

  it('should fall back to the hand-picked style when it is asked for a tile that is not solid', () => {
    const result = createGroundedMaterialPalette(PALETTE, GROUND)(TILE_AIR);

    expect(result).toBe(DIRT_STYLE);
  });
});
