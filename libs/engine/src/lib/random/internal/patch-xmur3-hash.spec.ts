import { describe, expect, it } from 'vitest';

import { patchXmur3Hash } from './patch-xmur3-hash';
import type { Xmur3Cell } from './types/xmur3-cell';

describe('patchXmur3Hash', () => {
  it('should keep the new hash in the cell when it is called', () => {
    const cell: Xmur3Cell = { hash: 1 };

    patchXmur3Hash(cell, 42);

    expect(cell.hash).toBe(42);
  });

  it('should give back the new hash when it is called', () => {
    const cell: Xmur3Cell = { hash: 1 };

    const hash = patchXmur3Hash(cell, 42);

    expect(hash).toBe(42);
  });

  it('should keep zero in the cell when the new hash is zero', () => {
    const cell: Xmur3Cell = { hash: 1 };

    patchXmur3Hash(cell, 0);

    expect(cell.hash).toBe(0);
  });
});
