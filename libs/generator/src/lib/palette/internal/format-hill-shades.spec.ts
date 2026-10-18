import { describe, expect, it } from 'vitest';

import { formatHillShades } from './format-hill-shades';

describe('formatHillShades', () => {
  it('should write the far and the near shade as css colours in order when it gets two shades', () => {
    expect(
      formatHillShades([
        { hue: 200, saturation: 24, lightness: 40 },
        { hue: 200, saturation: 24, lightness: 34 },
      ]),
    ).toEqual(['HSL(200, 24%, 40%)', 'HSL(200, 24%, 34%)']);
  });
});
