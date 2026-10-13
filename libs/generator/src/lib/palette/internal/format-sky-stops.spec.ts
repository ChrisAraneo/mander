import { describe, expect, it } from 'vitest';

import { formatSkyStops } from './format-sky-stops';

describe('formatSkyStops', () => {
  it('should write each stop as a css colour in order when it gets three stops', () => {
    expect(
      formatSkyStops([
        { hue: 200, saturation: 30, lightness: 30 },
        { hue: 30, saturation: 24, lightness: 46 },
        { hue: 30, saturation: 50, lightness: 60 },
      ]),
    ).toEqual(['HSL(200, 30%, 30%)', 'HSL(30, 24%, 46%)', 'HSL(30, 50%, 60%)']);
  });

  it('should round a fraction to a whole percent when a stop has one', () => {
    expect(
      formatSkyStops([
        { hue: 200, saturation: 20.8, lightness: 30 },
        { hue: 30, saturation: 24, lightness: 46 },
        { hue: 30, saturation: 50, lightness: 60 },
      ])[0],
    ).toBe('HSL(200, 21%, 30%)');
  });
});
