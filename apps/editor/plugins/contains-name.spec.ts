import { describe, expect, it } from 'vitest';

import { containsName } from './contains-name.ts';

describe('containsName', () => {
  it('should find the name when the list holds it', () => {
    expect(containsName(' DR, __ ', 'DR')).toBe(true);
  });

  it('should not find the name when the list only holds a longer one', () => {
    expect(containsName(' DRX, __ ', 'DR')).toBe(false);
  });

  it('should not find the name when it is commented out', () => {
    expect(containsName('\n  // DR,\n  __,\n', 'DR')).toBe(false);
  });

  it('should not find the name when the list is empty', () => {
    expect(containsName('', 'DR')).toBe(false);
  });
});
