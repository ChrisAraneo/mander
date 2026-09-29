import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { getStructures } from './get-structures';

describe('getStructures', () => {
  it('should give the normal structures when the category is normal', () => {
    expect(getStructures('NORMAL')).toBe(NORMAL_STRUCTURES);
  });

  it('should give the hard structures when the category is hard', () => {
    expect(getStructures('HARD')).toBe(HARD_STRUCTURES);
  });

  it('should give the vertical structures when the category is vertical', () => {
    expect(getStructures('VERTICAL')).toBe(VERTICAL_STRUCTURES);
  });
});
