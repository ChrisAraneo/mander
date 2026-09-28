import { describe, expect, it } from 'vitest';

import { convertToFlag } from './convert-to-flag';

describe('convertToFlag', () => {
  it('should give one when it is on', () => {
    expect(convertToFlag(true)).toBe(1);
  });

  it('should give zero when it is off', () => {
    expect(convertToFlag(false)).toBe(0);
  });
});
