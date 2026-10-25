import { STRUCTURE_CHOICES } from '@mander/generator';
import { describe, expect, it } from 'vitest';

import { findStructureName } from './find-structure-name';

describe('findStructureName', () => {
  it('should keep the structure when it is one of the choices', () => {
    expect(findStructureName('HARD_010')).toBe('HARD_010');
  });

  it('should give the first structure when nothing was played before', () => {
    expect(findStructureName(null)).toBe(STRUCTURE_CHOICES[0].name);
  });

  it('should give the first structure when the stored one no longer exists', () => {
    expect(findStructureName('NORMAL_999')).toBe(STRUCTURE_CHOICES[0].name);
  });
});
