import { TILE_DIRT, TILE_WOOD } from '@mander/model';
import type { Hsl } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import type { Palette } from '../../types/palette';
import { HIGHLIGHT, JOINT, WOOD_JOINT } from '../consts';
import { createMaterialStyle } from './create-material-style';

const PALETTE: Palette = {
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
};

const GROUND: Hsl = { hue: 30, saturation: 25, lightness: 27 };

describe('createMaterialStyle', () => {
  it('should tint the ground colour for wood and cap it with lighter shades when the tile is wood', () => {
    const result = createMaterialStyle(TILE_WOOD, PALETTE, GROUND);

    expect(result).toEqual({
      base: 'HSL(26, 21%, 43%)',
      cap: 'HSL(26, 21%, 50%)',
      capHighlight: 'HSL(26, 21%, 57%)',
      joint: WOOD_JOINT,
      highlight: HIGHLIGHT,
    });
  });

  it('should keep the ground colour and cap it with the grass when the tile is dirt', () => {
    const result = createMaterialStyle(TILE_DIRT, PALETTE, GROUND);

    expect(result).toEqual({
      base: 'HSL(30, 25%, 27%)',
      cap: 'HSL(96, 42%, 48%)',
      capHighlight: 'HSL(96, 47%, 54%)',
      joint: JOINT,
      highlight: HIGHLIGHT,
    });
  });
});
