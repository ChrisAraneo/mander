import { describe, expect, it } from 'vitest';

import { getBack } from './get-back';
import type { Sector } from './types/sector';

const FRONT = [[1, 0]];

const BACK = [[0, 9]];

const SECTOR: Sector = [FRONT, BACK];

describe('getBack', () => {
  it('should return the back layer when given a sector', () => {
    expect(getBack(SECTOR)).toBe(BACK);
  });

  it('should return an empty layer when the sector has no back layer', () => {
    expect(getBack([FRONT, []])).toEqual([]);
  });
});
