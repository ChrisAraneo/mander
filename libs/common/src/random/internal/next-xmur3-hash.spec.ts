import { describe, expect, it } from 'vitest';

import { nextXmur3Hash } from './next-xmur3-hash';
import type { Xmur3Cell } from './types/xmur3-cell';

describe('nextXmur3Hash', () => {
  it('should give the recorded hashes in order when the cell starts from the hash of mander', () => {
    const cell: Xmur3Cell = { hash: 1_301_155_065 };

    const hashes = [nextXmur3Hash(cell), nextXmur3Hash(cell)];

    expect(hashes).toEqual([701_479_220, 3_833_185_317]);
  });

  it('should keep the signed hash in the cell when the hash it gives is above the signed range', () => {
    const cell: Xmur3Cell = { hash: 701_479_220 };

    const hash = nextXmur3Hash(cell);

    expect(hash).toBe(3_833_185_317);
    expect(cell.hash).toBe(-461_781_979);
  });

  it('should give the same hash when the cell holds the same hash', () => {
    expect(nextXmur3Hash({ hash: 1 })).toBe(nextXmur3Hash({ hash: 1 }));
  });

  it('should give another hash when the cell holds another hash', () => {
    expect(nextXmur3Hash({ hash: 1 })).not.toBe(nextXmur3Hash({ hash: 2 }));
  });

  it('should give zero and keep zero when the cell holds zero', () => {
    const cell: Xmur3Cell = { hash: 0 };

    const hash = nextXmur3Hash(cell);

    expect(hash).toBe(0);
    expect(cell.hash).toBe(0);
  });
});
