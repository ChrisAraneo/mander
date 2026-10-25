import { describe, expect, it } from 'vitest';

import { toStructureLevelVariant } from './to-structure-level-variant';

describe('toStructureLevelVariant', () => {
  it('should give a normal level when the structure comes from the normal pool', () => {
    expect(toStructureLevelVariant('NORMAL')).toBe('NORMAL');
  });

  it('should give a hard level when the structure comes from the hard pool', () => {
    expect(toStructureLevelVariant('HARD')).toBe('HARD');
  });

  it('should give a vertical level when the structure comes from the vertical pool', () => {
    expect(toStructureLevelVariant('VERTICAL')).toBe('VERTICAL');
  });
});
