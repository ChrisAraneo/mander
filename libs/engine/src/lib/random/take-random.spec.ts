import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from './create-random';
import { takeRandom } from './take-random';

const VALUES = ['a', 'b', 'c'];

describe('takeRandom', () => {
  it('should take the first value when the roll is zero', () => {
    expect(takeRandom(VALUES, constant(0))).toBe('a');
  });

  it('should take the last value when the roll is just under one', () => {
    expect(takeRandom(VALUES, constant(0.9999))).toBe('c');
  });

  it('should take the value whose share holds the roll when the roll is in the middle', () => {
    expect(takeRandom(VALUES, constant(0.5))).toBe('b');
  });

  it('should take the same value when it is seeded with the same text', () => {
    expect(takeRandom(VALUES, createRandom('mander'))).toBe(
      takeRandom(VALUES, createRandom('mander')),
    );
  });

  it('should take another value when it is seeded with other text', () => {
    expect(takeRandom(VALUES, createRandom('mander'))).not.toBe(
      takeRandom(VALUES, createRandom('seed-b')),
    );
  });
});
