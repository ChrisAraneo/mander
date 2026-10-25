import { assign } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { cloneShiftedHsl } from '../color/clone-shifted-hsl';
import { parseHsl } from '../color/parse-hsl';

describe('hsl maths', () => {
  it('should read the colour back when it is written the way the palette writes it', () => {
    expect(parseHsl('HSL(210, 34%, 21%)')).toEqual({
      hue: 210,
      saturation: 34,
      lightness: 21,
    });
    expect(parseHsl('#6F5A43')).toBeUndefined();
    expect(parseHsl('')).toBeUndefined();
  });

  it('should wrap the hue and stop saturation and lightness at the ends when a shift runs past them', () => {
    const color = { hue: 350, saturation: 90, lightness: 10 };
    expect(cloneShiftedHsl(color, { hue: 30 })).toEqual(
      assign({}, color, { hue: 20 }),
    );
    expect(cloneShiftedHsl(color, { saturation: 40 }).saturation).toBe(100);
    expect(cloneShiftedHsl(color, { lightness: -40 }).lightness).toBe(0);
  });
});
