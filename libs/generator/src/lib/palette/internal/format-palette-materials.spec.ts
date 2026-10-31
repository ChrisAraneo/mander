import { describe, expect, it } from 'vitest';

import { formatPaletteMaterials } from './format-palette-materials';
import type { PaletteMaterialTones } from './types/palette-material-tones';

const TONES: PaletteMaterialTones = {
  brick: { hue: 14, saturation: 46, lightness: 44 },
  wood: { hue: 30, saturation: 32, lightness: 46 },
  ceramic: { hue: 186, saturation: 52, lightness: 48 },
};

describe('formatPaletteMaterials', () => {
  it('should write the brick, the wood and the ceramic as css colours when it gets their tones', () => {
    expect(formatPaletteMaterials(TONES)).toEqual({
      brick: 'HSL(14, 46%, 44%)',
      wood: 'HSL(30, 32%, 46%)',
      ceramic: 'HSL(186, 52%, 48%)',
    });
  });
});
