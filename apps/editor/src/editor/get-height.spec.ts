import { STRUCTURE_HEIGHT, VERTICAL_HEIGHT } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { getHeight } from './get-height';

describe('getHeight', () => {
  it('should give the vertical height when the pool is the vertical one', () => {
    expect(getHeight('vertical')).toBe(VERTICAL_HEIGHT);
  });

  it('should give the sector height when the pool is a horizontal one', () => {
    expect(getHeight('normal')).toBe(STRUCTURE_HEIGHT);
    expect(getHeight('hard')).toBe(STRUCTURE_HEIGHT);
  });
});
