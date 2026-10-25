import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getStructureName } from './get-structure-name';
import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  VERTICAL_STRUCTURES,
} from './library';
import type { Sector } from './types/sector';

const getFirstStructure = (structures: readonly Sector[]): Sector =>
  structures[0];

const getLastStructure = (structures: readonly Sector[]): Sector =>
  structures[size(structures) - 1];

describe('getStructureName', () => {
  it('should return the pool name and padded position when the structure is the first of its pool', () => {
    expect(getStructureName(getFirstStructure(NORMAL_STRUCTURES))).toBe(
      'NORMAL_001',
    );
    expect(getStructureName(getFirstStructure(HARD_STRUCTURES))).toBe(
      'HARD_001',
    );
    expect(getStructureName(getFirstStructure(VERTICAL_STRUCTURES))).toBe(
      'VERTICAL_001',
    );
  });

  it('should return the pool name and padded position when the structure is the last of its pool', () => {
    expect(getStructureName(getLastStructure(NORMAL_STRUCTURES))).toBe(
      'NORMAL_205',
    );
    expect(getStructureName(getLastStructure(HARD_STRUCTURES))).toBe(
      'HARD_046',
    );
    expect(getStructureName(getLastStructure(VERTICAL_STRUCTURES))).toBe(
      'VERTICAL_030',
    );
  });

  it('should return unknown when the structure is not in the library', () => {
    expect(getStructureName([[], []])).toBe('UNKNOWN');
  });
});
