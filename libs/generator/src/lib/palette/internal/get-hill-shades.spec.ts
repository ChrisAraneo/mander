import { describe, expect, it } from 'vitest';

import { getHillShades } from './get-hill-shades';

const SKY = {
  hue: 200,
  glowHue: 30,
  saturation: 30,
  glowSaturation: 50,
  topLightness: 28,
};

describe('getHillShades', () => {
  it('should paint the far hills paler than the sky when it shades them', () => {
    expect(getHillShades(SKY)[0]).toEqual({
      hue: 200,
      saturation: 24,
      lightness: 38,
    });
  });

  it('should paint the near hills darker than the far ones when it shades them', () => {
    expect(getHillShades(SKY)[1]).toEqual({
      hue: 200,
      saturation: 24,
      lightness: 32,
    });
  });
});
