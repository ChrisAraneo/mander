import { describe, expect, it } from 'vitest';

import { parseHsl } from './parse-hsl';

describe('parseHsl', () => {
  it('should read the three channels when the colour is written as hsl', () => {
    const result = parseHsl('hsl(210, 40%, 55%)');

    expect(result).toEqual({ hue: 210, saturation: 40, lightness: 55 });
  });

  it('should read the colour when it is upper case with fractions and a negative hue', () => {
    const result = parseHsl('HSL(-12.5, 30.5%, 7%)');

    expect(result).toEqual({ hue: -12.5, saturation: 30.5, lightness: 7 });
  });

  it('should give nothing when the colour is not written as hsl', () => {
    const result = parseHsl('#6D7480');

    expect(result).toBeUndefined();
  });
});
