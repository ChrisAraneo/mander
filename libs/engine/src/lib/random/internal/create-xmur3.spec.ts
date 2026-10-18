import { describe, expect, it } from 'vitest';

import { createXmur3 } from './create-xmur3';

describe('createXmur3', () => {
  it('should give the same hashes in the same order when it is seeded with the same text', () => {
    const hash = createXmur3('mander');

    expect([hash(), hash()]).toEqual([701_479_220, 3_833_185_317]);
  });

  it('should give different hashes when it is seeded with different text', () => {
    const result = createXmur3('Mander')();

    expect(result).not.toBe(createXmur3('mander')());
  });
});
