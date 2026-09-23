import { first, last } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  VERTICAL_STRUCTURES,
} from './library';
import type { Sector } from './structure';
import { getStructureName } from './structure-name';

const SKIPPED_INDEX = 180;

const SKIPPED_NAME = 'NORMAL_182';

const firstOf = (structures: readonly Sector[]): Sector =>
  first(structures) as Sector;

const lastOf = (structures: readonly Sector[]): Sector =>
  last(structures) as Sector;

describe('getStructureName', () => {
  it('should name the structure after its pool and padded position when it is the first of one', () => {
    expect(getStructureName(firstOf(NORMAL_STRUCTURES))).toBe('NORMAL_001');
    expect(getStructureName(firstOf(HARD_STRUCTURES))).toBe('HARD_001');
    expect(getStructureName(firstOf(VERTICAL_STRUCTURES))).toBe('VERTICAL_001');
  });

  it('should name the structure after its pool and padded position when it is the last of one', () => {
    expect(getStructureName(lastOf(NORMAL_STRUCTURES))).toBe('NORMAL_205');
    expect(getStructureName(lastOf(HARD_STRUCTURES))).toBe('HARD_046');
    expect(getStructureName(lastOf(VERTICAL_STRUCTURES))).toBe('VERTICAL_022');
  });

  it('should name the structure after the constant when its position does not match it', () => {
    expect(getStructureName(NORMAL_STRUCTURES[SKIPPED_INDEX])).toBe(
      SKIPPED_NAME,
    );
  });

  it('should fall back when the structure is not in the library', () => {
    expect(getStructureName([] as unknown as Sector)).toBe('UNKNOWN');
  });
});
