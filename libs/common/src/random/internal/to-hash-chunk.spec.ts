import { describe, expect, it } from 'vitest';

import { toHashChunk } from './to-hash-chunk';

describe('toHashChunk', () => {
  it('should give the base-36 digits padded with zeros to seven when the number is small', () => {
    expect(toHashChunk(35)).toBe('000000z');
  });

  it('should give the seven base-36 digits unpadded when the number fills them', () => {
    expect(toHashChunk(36 ** 6)).toBe('1000000');
  });

  it('should give all zeros when the number is zero', () => {
    expect(toHashChunk(0)).toBe('0000000');
  });
});
