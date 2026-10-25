import { describe, expect, it } from 'vitest';

import { parseStructureNumber } from './parse-structure-number';

describe('parseStructureNumber', () => {
  it('should give the number after the prefix when the name has one', () => {
    expect(parseStructureNumber('VERTICAL_012')).toBe(12);
  });

  it('should give zero when the name has no number', () => {
    expect(parseStructureNumber('NORMAL')).toBe(0);
  });
});
