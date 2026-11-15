import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createXmur3 } from './create-xmur3';
import { toHashChunks } from './to-hash-chunks';

describe('toHashChunks', () => {
  it('should join the two chunks when it draws twice', () => {
    expect(toHashChunks(constant(35))).toBe('000000z000000z');
  });

  it('should give fourteen zeros when every draw gives zero', () => {
    expect(toHashChunks(constant(0))).toBe('00000000000000');
  });

  it('should keep the order of the draws when the two draws differ', () => {
    expect(toHashChunks(createXmur3('mander'))).toBe('0bln4tw1re6gpx');
  });

  it('should give the same text when it is seeded with the same text', () => {
    expect(toHashChunks(createXmur3('mander'))).toBe(
      toHashChunks(createXmur3('mander')),
    );
  });

  it('should give other text when it is seeded with other text', () => {
    expect(toHashChunks(createXmur3('mander'))).not.toBe(
      toHashChunks(createXmur3('seed-b')),
    );
  });
});
