import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createSuffix } from './create-suffix';

describe('createSuffix', () => {
  it('should write the random draw in base 36 when it creates the suffix', () => {
    expect(createSuffix(constant(0.5))).toBe((5e7).toString(36));
  });

  it('should give the same suffix when the same random draw is used', () => {
    expect(createSuffix(constant(0.25))).toBe(createSuffix(constant(0.25)));
  });

  it('should give another suffix when another random draw is used', () => {
    expect(createSuffix(constant(0.1))).not.toBe(createSuffix(constant(0.2)));
  });

  it('should give zero when the random draw is zero', () => {
    expect(createSuffix(constant(0))).toBe('0');
  });
});
