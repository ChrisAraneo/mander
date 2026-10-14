import { describe, expect, it } from 'vitest';

import { formatPaletteColours } from './format-palette-colours';
import type { PaletteGround } from './types/palette-ground';
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

describe('formatPaletteColours', () => {
  it('should paint the sky, the hills and the blocks in css colours when it gets a sky and a ground', () => {
    expect(formatPaletteColours({ sky: SKY, ground: GROUND })).toEqual({
      sky: ['HSL(200, 30%, 30%)', 'HSL(30, 24%, 46%)', 'HSL(30, 50%, 60%)'],
      hills: ['HSL(200, 24%, 40%)', 'HSL(200, 24%, 34%)'],
      block: 'HSL(40, 25%, 32%)',
      blockCap: 'HSL(100, 40%, 50%)',
      blockCapHighlight: 'HSL(100, 44%, 56%)',
    });
  });
});
