import { describe, expect, it } from 'vitest';

import type { Sector } from '../types/sector';
import { toNamePairs } from './to-name-pairs';

const FIRST: Sector = [[], []];

const SECOND: Sector = [[], []];

describe('toNamePairs', () => {
  it('should pair each structure with its name in library order when the library has structures', () => {
    expect(toNamePairs({ NORMAL_001: FIRST, NORMAL_002: SECOND })).toEqual([
      [FIRST, 'NORMAL_001'],
      [SECOND, 'NORMAL_002'],
    ]);
  });

  it('should keep the same structure in each pair when the library has structures', () => {
    const [[first], [second]] = toNamePairs({
      NORMAL_001: FIRST,
      NORMAL_002: SECOND,
    });

    expect(first).toBe(FIRST);
    expect(second).toBe(SECOND);
  });

  it('should give no pairs when the library is empty', () => {
    expect(toNamePairs({})).toEqual([]);
  });
});
