import { describe, expect, it } from 'vitest';

import { formatPaletteColours } from './format-palette-colours';
import type { PaletteGround } from './types/palette-ground';
import type { PaletteMaterialTones } from './types/palette-material-tones';
import type { PaletteSky } from './types/palette-sky';

const SKY: PaletteSky = {
  hue: 200,
  glowHue: 30,
  saturation: 30,
  glowSaturation: 50,
  topLightness: 30,
};

const GROUND: PaletteGround = {
  hue: 40,
  saturation: 25,
  lightness: 32,
  capHue: 100,
  capSaturation: 40,
  capLightness: 50,
};

const MATERIALS: PaletteMaterialTones = {
  brick: { hue: 14, saturation: 46, lightness: 44 },
  wood: { hue: 30, saturation: 32, lightness: 46 },
  ceramic: { hue: 186, saturation: 52, lightness: 48 },
};

describe('formatPaletteColours', () => {
  it('should paint the sky, the hills and the blocks in css colours when it gets a sky and a ground', () => {
    expect(
      formatPaletteColours({
        sky: SKY,
        ground: GROUND,
        materials: MATERIALS,
      }),
    ).toEqual({
      sky: ['HSL(200, 30%, 30%)', 'HSL(30, 24%, 46%)', 'HSL(30, 50%, 60%)'],
      hills: ['HSL(200, 24%, 40%)', 'HSL(200, 24%, 34%)'],
      block: 'HSL(40, 25%, 32%)',
      blockCap: 'HSL(100, 40%, 50%)',
      blockCapHighlight: 'HSL(100, 44%, 56%)',
      materials: {
        brick: 'HSL(14, 46%, 44%)',
        wood: 'HSL(30, 32%, 46%)',
        ceramic: 'HSL(186, 52%, 48%)',
      },
    });
  });
});
