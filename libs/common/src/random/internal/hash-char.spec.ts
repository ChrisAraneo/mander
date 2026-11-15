import { describe, expect, it } from 'vitest';

import { hashChar } from './hash-char';

describe('hashChar', () => {
  it('should give the recorded hash when it mixes a letter into the seed', () => {
    expect(hashChar(1_779_033_703, 'm')).toBe(-1_318_762_601);
  });

  it('should give the recorded hash when the hash so far is negative', () => {
    expect(hashChar(-5, 'Z')).toBe(-1_512_168_919);
  });

  it('should give the recorded hash when the hash so far is zero', () => {
    expect(hashChar(0, 'a')).toBe(-445_239_043);
  });

  it('should give another hash when the letter differs only in case', () => {
    expect(hashChar(0, 'a')).not.toBe(hashChar(0, 'A'));
  });
});
