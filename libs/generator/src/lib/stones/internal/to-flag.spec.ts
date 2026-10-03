import { describe, expect, it } from 'vitest';

import { toFlag } from './to-flag';

describe('toFlag', () => {
  it('should give one when it is on', () => {
    expect(toFlag(true)).toBe(1);
  });

  it('should give zero when it is off', () => {
    expect(toFlag(false)).toBe(0);
  });
});
