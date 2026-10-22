import { describe, expect, it } from 'vitest';

import { toLevelCategory } from './to-level-category';

describe('toLevelCategory', () => {
  it('should give the vertical category when the level is a vertical one', () => {
    expect(toLevelCategory('VERTICAL')).toBe('VERTICAL');
  });

  it('should give the hard category when the level is a hard one', () => {
    expect(toLevelCategory('HARD')).toBe('HARD');
  });

  it('should give the normal category when the level is a normal one', () => {
    expect(toLevelCategory('NORMAL')).toBe('NORMAL');
  });

  it('should give the normal category when the level is a mirrored one', () => {
    expect(toLevelCategory('MIRRORED')).toBe('NORMAL');
  });
});
