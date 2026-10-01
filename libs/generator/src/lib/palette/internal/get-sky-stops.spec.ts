import { describe, expect, it } from 'vitest';

import { getSkyStops } from './get-sky-stops';

const SKY = {
  hue: 200,
  glowHue: 30,
  saturation: 30,
  glowSaturation: 50,
  topLightness: 28,
};

describe('getSkyStops', () => {
  it('should start the sky at its own hue on top when it lays out the stops', () => {
    expect(getSkyStops(SKY)[0]).toEqual({
      hue: 200,
      saturation: 30,
      lightness: 28,
    });
  });

  it('should haze the middle into the glow when it lays out the stops', () => {
    const middle = getSkyStops(SKY)[1];

    expect(middle.hue).toBe(30);
    expect(middle.saturation).toBeCloseTo(24);
    expect(middle.lightness).toBe(44);
  });

  it('should light the horizon with the glow when it lays out the stops', () => {
    expect(getSkyStops(SKY)[2]).toEqual({
      hue: 30,
      saturation: 50,
      lightness: 58,
    });
  });
});
