import { describe, expect, it } from 'vitest';

import { toWrappedHue } from './to-wrapped-hue';

describe('toWrappedHue', () => {
  it('should keep the hue when it is already on the wheel', () => {
    const result = toWrappedHue(120);

    expect(result).toBe(120);
  });

  it('should wrap the hue back onto the wheel when it goes past a full turn', () => {
    const result = toWrappedHue(400);

    expect(result).toBe(40);
  });

  it('should wrap the hue forward onto the wheel when it is negative', () => {
    const result = toWrappedHue(-30);

    expect(result).toBe(330);
  });
});
