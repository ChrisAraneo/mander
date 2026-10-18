import { describe, expect, it } from 'vitest';

import { computeFacing } from './compute-facing';

describe('computeFacing', () => {
  it('should face forwards when it faces right', () => {
    expect(computeFacing(true)).toBe(1);
  });

  it('should face backwards when it faces left', () => {
    expect(computeFacing(false)).toBe(-1);
  });
});
