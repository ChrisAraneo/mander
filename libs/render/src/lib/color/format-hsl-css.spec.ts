import { describe, expect, it } from 'vitest';

import { formatHslCss } from './format-hsl-css';

describe('formatHslCss', () => {
  it('should write the colour as css hsl when the channels are whole numbers', () => {
    const result = formatHslCss({ hue: 210, saturation: 40, lightness: 55 });

    expect(result).toBe('HSL(210, 40%, 55%)');
  });

  it('should round every channel when the channels have fractions', () => {
    const result = formatHslCss({
      hue: 12.6,
      saturation: 30.4,
      lightness: 7.5,
    });

    expect(result).toBe('HSL(13, 30%, 8%)');
  });
});
