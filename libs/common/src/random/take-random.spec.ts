import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from './create-random';
import { takeRandom } from './take-random';

const FIRST_ROLL = 0;
const LAST_ROLL = 0.9999;
const MIDDLE_ROLL = 0.5;

const createValues = (): string[] => ['a', 'b', 'c'];

const VALUES = createValues();

describe('takeRandom', () => {
  it('should take the first value when the roll is zero', () => {
    expect(takeRandom(VALUES, constant(FIRST_ROLL))).toBe('a');
  });

  it('should take the last value when the roll is just under one', () => {
    expect(takeRandom(VALUES, constant(LAST_ROLL))).toBe('c');
  });

  it('should take the value whose share holds the roll when the roll is in the middle', () => {
    expect(takeRandom(VALUES, constant(MIDDLE_ROLL))).toBe('b');
  });

  it('should take nothing when it is given no values', () => {
    expect(takeRandom([], constant(MIDDLE_ROLL))).toBeUndefined();
  });

  it('should not change the values it was given when it takes one', () => {
    const values = createValues();

    takeRandom(values, constant(MIDDLE_ROLL));

    expect(values).toEqual(createValues());
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
