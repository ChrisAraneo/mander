import { describe, expect, it } from 'vitest';

import { getFront } from './get-front';
import type { Sector } from './types/sector';

const FRONT = [[1, 0]];

const BACK = [[0, 9]];

const SECTOR: Sector = [FRONT, BACK];

describe('getFront', () => {
  it('should return the front layer when given a sector', () => {
    expect(getFront(SECTOR)).toBe(FRONT);
  });

  it('should return an empty layer when the front layer is empty', () => {
    expect(getFront([[], BACK])).toEqual([]);
  });
});
