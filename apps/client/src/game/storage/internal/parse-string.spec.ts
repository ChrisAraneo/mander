import { describe, expect, it } from 'vitest';

import { parseString } from './parse-string';

describe('parseString', () => {
  it('should keep the text when the value is text', () => {
    expect(parseString('ABC')).toBe('ABC');
  });

  it('should give empty text when the value is a number', () => {
    expect(parseString(7)).toBe('');
  });

  it('should give empty text when the value is missing', () => {
    expect(parseString(undefined)).toBe('');
  });
});
