import { describe, expect, it } from 'vitest';

import { parseNumber } from './parse-number';

describe('parseNumber', () => {
  it('should keep the number when the value is a finite number', () => {
    expect(parseNumber(42.5)).toBe(42.5);
  });

  it('should give zero when the value is text', () => {
    expect(parseNumber('42')).toBe(0);
  });

  it('should give zero when the value is not finite', () => {
    expect(parseNumber(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('should give zero when the value is missing', () => {
    expect(parseNumber(undefined)).toBe(0);
  });
});
