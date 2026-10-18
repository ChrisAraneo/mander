import { describe, expect, it } from 'vitest';

import { shiftHsl } from './shift-hsl';

describe('shiftHsl', () => {
  it('should add the delta to every channel when the result stays in range', () => {
    const result = shiftHsl(
      { hue: 100, saturation: 40, lightness: 50 },
      { hue: 20, saturation: -10, lightness: 5 },
    );

    expect(result).toEqual({ hue: 120, saturation: 30, lightness: 55 });
  });

  it('should leave a channel alone when the delta does not mention it', () => {
    const result = shiftHsl(
      { hue: 100, saturation: 40, lightness: 50 },
      { lightness: 10 },
    );

    expect(result).toEqual({ hue: 100, saturation: 40, lightness: 60 });
  });

  it('should wrap the hue and clamp the percentages when the delta overshoots', () => {
    const result = shiftHsl(
      { hue: 350, saturation: 95, lightness: 5 },
      { hue: 20, saturation: 10, lightness: -10 },
    );

    expect(result).toEqual({ hue: 10, saturation: 100, lightness: 0 });
  });
});
